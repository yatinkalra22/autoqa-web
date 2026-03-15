'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Zap, Check, Timer } from 'lucide-react'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Spinner } from '@/components/ui/Spinner'
import { ScreenshotViewer } from '@/components/run/ScreenshotViewer'
import { StepsTimeline } from '@/components/run/StepsTimeline'
import { NarrationTerminal } from '@/components/run/NarrationTerminal'
import type { RunStatus } from '@/types'

interface SharedRunData {
  id: string
  prompt: string
  targetUrl: string
  status: RunStatus
  steps: any[]
  summary: string | null
  durationMs: number | null
  narrations: Array<{ step: number; text: string; type: 'action' | 'complete' | 'validation' | 'summary'; success?: boolean }>
  lastScreenshotDataUrl: string
  sharedAt: string
}

export function SharedRunViewer({ shareId }: { shareId: string }) {
  const [data, setData] = useState<SharedRunData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/shared/${shareId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Report not found')
        return res.json()
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [shareId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="w-10 h-10" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[var(--theme-muted)] text-lg">This shared report is no longer available.</p>
        <Link href="/" className="text-[var(--theme-accent)] hover:underline text-sm">
          Go to AutoQA
        </Link>
      </div>
    )
  }

  const isDone = data.status === 'PASS' || data.status === 'FAIL' || data.status === 'ERROR'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Minimal header for shared view */}
      <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">AutoQA</span>
        </Link>
        <div className="ml-4 flex items-center gap-3 text-sm">
          <span className="text-[var(--theme-muted)]">Shared Report</span>
          <StatusBadge status={data.status} />
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm text-[var(--theme-muted)]">
          <Timer className="w-4 h-4" />
          {data.durationMs ? `${(data.durationMs / 1000).toFixed(1)}s` : '-'}
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left — Screenshot + Summary */}
        <div className="lg:flex-[6] flex flex-col p-4 lg:p-6 gap-4 overflow-auto lg:border-r border-b lg:border-b-0 border-gray-800">
          <ScreenshotViewer
            screenshotDataUrl={data.lastScreenshotDataUrl}
            annotation={data.steps[data.steps.length - 1]?.annotation}
            status={data.status}
          />

          {data.status === 'PASS' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/85 border border-green-800/50 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-800/50 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-semibold text-sm">Test Passed</p>
                <p className="text-gray-500 text-xs">{data.steps.length} steps in {((data.durationMs || 0) / 1000).toFixed(1)}s</p>
              </div>
            </div>
          )}

          {data.status === 'FAIL' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/30 border border-red-800/50">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="text-red-400 text-lg font-bold">&times;</span>
              </div>
              <div>
                <p className="text-red-400 font-semibold text-sm">Test Failed</p>
                <p className="text-red-300/70 text-xs">{data.steps.length} steps</p>
              </div>
            </div>
          )}

          {isDone && data.summary && (
            <div className={`p-4 rounded-xl border text-sm ${
              data.status === 'PASS'
                ? 'bg-white/85 border-green-800/50 text-gray-300 shadow-sm'
                : 'bg-red-950/20 border-red-800/50 text-red-300'
            }`}>
              <p className={`font-medium mb-1.5 ${data.status === 'PASS' ? 'text-green-400' : ''}`}>AI Summary</p>
              <p className="opacity-90 leading-relaxed">{data.summary}</p>
            </div>
          )}

          <div className="mt-2 p-3 rounded-lg bg-[var(--theme-surface)] border border-[var(--theme-border)] text-xs text-[var(--theme-muted)]">
            <p><span className="font-medium">URL:</span> {data.targetUrl}</p>
            <p className="mt-1"><span className="font-medium">Test:</span> {data.prompt}</p>
          </div>
        </div>

        {/* Right — Narration + Steps */}
        <div className="lg:flex-[4] flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <NarrationTerminal narrations={data.narrations} status={data.status} />
          <StepsTimeline steps={data.steps} />
        </div>
      </div>
    </div>
  )
}
