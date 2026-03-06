'use client'
import Link from 'next/link'
import { ArrowLeft, FileText, RotateCcw, Timer } from 'lucide-react'
import { useRunSocket } from '@/hooks/useRunSocket'
import { useElapsed } from '@/hooks/useElapsed'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { NarrationTerminal } from '@/components/run/NarrationTerminal'
import { ScreenshotViewer } from '@/components/run/ScreenshotViewer'
import { StepsTimeline } from '@/components/run/StepsTimeline'

export function RunViewer({ runId }: { runId: string }) {
  const { status, steps, narrations, currentScreenshot, summary, reportUrl, durationMs } = useRunSocket(runId)
  const elapsed = useElapsed(status === 'RUNNING')

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Run Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 lg:px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-white font-medium">Run #{runId.slice(0, 8)}</span>
            <StatusBadge status={status} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm flex items-center gap-1.5">
            <Timer className="w-4 h-4" />
            {status === 'RUNNING' ? elapsed : `${((durationMs || 0) / 1000).toFixed(1)}s`}
          </span>

          {status === 'RUNNING' && (
            <div className="flex items-center gap-1.5 text-amber-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              LIVE
            </div>
          )}

          {(status === 'PASS' || status === 'FAIL') && reportUrl && (
            <a
              href={reportUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-all border border-gray-700"
            >
              <FileText className="w-4 h-4" />
              View Report
            </a>
          )}
        </div>
      </div>

      {/* 2-Column Content (stacks on mobile) */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left - Screenshot + Summary */}
        <div className="lg:flex-[6] flex flex-col p-4 lg:p-6 gap-4 overflow-auto lg:border-r border-b lg:border-b-0 border-gray-800">
          <ScreenshotViewer
            screenshotDataUrl={currentScreenshot}
            annotation={steps[steps.length - 1]?.annotation}
            status={status}
          />

          {/* Progress */}
          {status === 'RUNNING' && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>Step {steps.length}</span>
                <span>Max 20</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min((steps.length / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Summary Card */}
          {(status === 'PASS' || status === 'FAIL') && summary && (
            <div className={`p-4 rounded-xl border text-sm ${
              status === 'PASS'
                ? 'bg-green-950/20 border-green-800/50 text-green-300'
                : 'bg-red-950/20 border-red-800/50 text-red-300'
            }`}>
              <p className="font-medium mb-1.5">AI Summary</p>
              <p className="opacity-90 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Done Actions */}
          {(status === 'PASS' || status === 'FAIL') && (
            <div className="flex gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-all border border-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
                New Test
              </Link>
            </div>
          )}
        </div>

        {/* Right - Narration + Steps */}
        <div className="lg:flex-[4] flex flex-col overflow-hidden min-h-[300px] lg:min-h-0">
          <NarrationTerminal narrations={narrations} status={status} />
          <StepsTimeline steps={steps} />
        </div>
      </div>
    </div>
  )
}
