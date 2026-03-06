'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import type { RunStatus, StepRecord, BoundingBox } from '@/types'

interface NarrationEntry {
  step: number
  text: string
  type: 'action' | 'complete' | 'validation' | 'summary'
  success?: boolean
}

export function useRunSocket(runId: string) {
  const [status, setStatus] = useState<RunStatus>('QUEUED')
  const [steps, setSteps] = useState<StepRecord[]>([])
  const [narrations, setNarrations] = useState<NarrationEntry[]>([])
  const [currentScreenshot, setCurrentScreenshot] = useState('')
  const [summary, setSummary] = useState('')
  const [reportUrl, setReportUrl] = useState('')
  const [durationMs, setDurationMs] = useState(0)
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const wsBase = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
    const ws = new WebSocket(`${wsBase}/ws/runs/${runId}`)
    wsRef.current = ws

    ws.onopen = () => setStatus('RUNNING')

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)

      switch (msg.type) {
        case 'run_started':
          setStatus('RUNNING')
          break

        case 'step_start':
          setNarrations(prev => [...prev, {
            step: msg.step,
            text: msg.narration || `${msg.action}: "${msg.target}"`,
            type: 'action',
          }])
          break

        case 'step_complete':
          setCurrentScreenshot(msg.screenshotDataUrl)
          setSteps(prev => [...prev, {
            step: prev.length + 1,
            action: msg.action || 'click',
            target: msg.target || '',
            reasoning: '',
            narration: '',
            success: msg.success,
            annotation: msg.annotation,
            durationMs: 0,
            timestamp: new Date().toISOString(),
          }])
          break

        case 'validation':
          setNarrations(prev => [...prev, {
            step: 0,
            text: msg.message,
            type: 'validation',
            success: msg.passed,
          }])
          break

        case 'run_complete':
          setStatus(msg.status)
          setSummary(msg.summary)
          setReportUrl(msg.reportUrl)
          setDurationMs(msg.durationMs)
          setNarrations(prev => [...prev, {
            step: 0,
            text: msg.summary,
            type: 'summary',
            success: msg.status === 'PASS',
          }])
          ws.close()
          break

        case 'error':
          setStatus('ERROR')
          setNarrations(prev => [...prev, {
            step: msg.step || 0,
            text: `Error: ${msg.message}`,
            type: 'validation',
            success: false,
          }])
          break
      }
    }

    ws.onerror = () => setStatus('ERROR')

    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000)

    return () => {
      clearInterval(ping)
      ws.close()
    }
  }, [runId])

  return { status, steps, narrations, currentScreenshot, summary, reportUrl, durationMs }
}
