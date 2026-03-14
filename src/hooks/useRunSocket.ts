'use client'
import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import type { RunStatus, StepRecord } from '@/types'

interface NarrationEntry {
  step: number
  text: string
  type: 'action' | 'complete' | 'validation' | 'summary'
  success?: boolean
}

const MAX_RECONNECT_ATTEMPTS = 5
const BASE_RECONNECT_DELAY = 1000
const FINAL_STATUSES: RunStatus[] = ['PASS', 'FAIL', 'ERROR']

function isRunStatus(value: unknown): value is RunStatus {
  return value === 'QUEUED' || value === 'RUNNING' || value === 'PASS' || value === 'FAIL' || value === 'ERROR'
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
  const reconnectAttempts = useRef(0)
  const isClosed = useRef(false)

  useEffect(() => {
    isClosed.current = false

    function connect() {
      if (isClosed.current) return

      const wsBase = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
      const ws = new WebSocket(`${wsBase}/ws/runs/${runId}`)
      wsRef.current = ws

      ws.onopen = () => {
        reconnectAttempts.current = 0
      }

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)
        if (msg.type === 'pong') return

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
            isClosed.current = true
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

      ws.onclose = () => {
        if (isClosed.current) return
        if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = BASE_RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current)
          reconnectAttempts.current++
          setTimeout(connect, delay)
        } else {
          setStatus('ERROR')
          setNarrations(prev => [...prev, {
            step: 0,
            text: 'Connection lost. Please refresh the page.',
            type: 'validation',
            success: false,
          }])
        }
      }

      ws.onerror = () => {
        // onclose will handle reconnection
      }

      const ping = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'ping' }))
        }
      }, 30000)

      ws.addEventListener('close', () => clearInterval(ping))
    }

    async function hydrateThenConnect() {
      try {
        const data = await api.getRun(runId)
        if (isClosed.current) return

        if (isRunStatus(data?.status)) {
          setStatus(data.status)
          if (FINAL_STATUSES.includes(data.status)) {
            if (Array.isArray(data.steps)) setSteps(data.steps)
            if (Array.isArray(data.narrations)) setNarrations(data.narrations)
            if (typeof data.summary === 'string') setSummary(data.summary)
            if (typeof data.reportUrl === 'string') setReportUrl(data.reportUrl)
            if (typeof data.durationMs === 'number') setDurationMs(data.durationMs)
            // Use the final saved screenshot; fall back to last step's annotated screenshot if ever added
            if (typeof data.lastScreenshotDataUrl === 'string' && data.lastScreenshotDataUrl) {
              setCurrentScreenshot(data.lastScreenshotDataUrl)
            }
            return
          }
        }
      } catch {
        // Fall back to websocket-only mode if hydrate fails.
      }

      connect()
    }

    hydrateThenConnect()

    return () => {
      isClosed.current = true
      wsRef.current?.close()
    }
  }, [runId])

  return { status, steps, narrations, currentScreenshot, summary, reportUrl, durationMs }
}
