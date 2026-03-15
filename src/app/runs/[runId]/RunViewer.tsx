'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, RotateCcw, Timer, Copy, Check, Share2, Code2, Link2, Mail } from 'lucide-react'
import { api } from '@/lib/api'
import { useRunSocket } from '@/hooks/useRunSocket'
import { useElapsed } from '@/hooks/useElapsed'
import { useAuth } from '@/components/auth/AuthProvider'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { NarrationTerminal } from '@/components/run/NarrationTerminal'
import { ScreenshotViewer } from '@/components/run/ScreenshotViewer'
import { StepsTimeline } from '@/components/run/StepsTimeline'

export function RunViewer({ runId }: { runId: string }) {
  const { status, steps, narrations, currentScreenshot, summary, reportUrl, durationMs, accessError } = useRunSocket(runId)
  const elapsed = useElapsed(status === 'RUNNING')
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [sharing, setSharing] = useState(false)

  const handleCopyLink = async () => {
    const url = shareLink || window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerateShareLink = async () => {
    if (shareLink) {
      setShareOpen(!shareOpen)
      return
    }
    setSharing(true)
    try {
      const { shareId } = await api.createShareLink(runId)
      const url = `${window.location.origin}/shared/${shareId}`
      setShareLink(url)
      setShareOpen(true)
    } catch {
      // Fallback to current URL
      setShareLink(window.location.href)
      setShareOpen(true)
    }
    setSharing(false)
  }

  const handleOpenReport = async () => {
    try {
      const token = await import('@/lib/firebase').then(m => m.getIdToken())
      const res = await fetch(`/api/reports/${runId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!res.ok) throw new Error('Failed to load report')
      const html = await res.text()
      const win = window.open('', '_blank')
      if (win) {
        win.document.write(html)
        win.document.close()
      }
    } catch {
      // Fallback: try opening directly
      window.open(`/api/reports/${runId}`, '_blank')
    }
  }

  const handleEmailShare = () => {
    const url = shareLink || window.location.href
    const subject = `AutoQA Test Report — Run #${runId.slice(0, 8)} (${status})`
    const body = `${user?.displayName || 'A team member'} shared a test result with you.\n\nStatus: ${status}\nSteps: ${steps.length}\n${summary ? `Summary: ${summary}\n` : ''}\nView the full report: ${url}`
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
  }

  const isDone = status === 'PASS' || status === 'FAIL' || status === 'ERROR'

  if (accessError) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-800/50 flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 text-sm mb-6">{accessError}</p>
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    )
  }

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

          {/* Run by indicator */}
          {user && isDone && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--theme-muted)]">
              {user.photoURL && (
                <img src={user.photoURL} alt="" className="w-4 h-4 rounded-full" referrerPolicy="no-referrer" />
              )}
              <span>{user.displayName?.split(' ')[0]}</span>
            </div>
          )}

          {isDone && (
            <div className="relative">
              <button
                onClick={handleGenerateShareLink}
                disabled={sharing}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-gray-400 hover:text-white transition-all border border-gray-700"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>

              {shareOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[var(--theme-border)] rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
                  <div className="p-3 border-b border-[var(--theme-border)]">
                    <p className="text-xs font-medium text-[var(--theme-text)] mb-2">Share this result</p>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={shareLink || window.location.href}
                        className="flex-1 bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--theme-text)] truncate"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-1 px-3 py-1.5 bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] rounded-lg text-xs font-medium text-white transition-colors"
                        style={{ color: 'white' }}
                      >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleEmailShare}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors"
                    >
                      <Mail className="w-4 h-4 text-[var(--theme-muted)]" />
                      Share via email
                    </button>
                    <button
                      onClick={() => {
                        const url = shareLink || window.location.href
                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my test result on AutoQA! ${url}`)}`)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--theme-text)] hover:bg-[var(--theme-surface)] transition-colors"
                    >
                      <Link2 className="w-4 h-4 text-[var(--theme-muted)]" />
                      Share on X
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {(status === 'PASS' || status === 'FAIL') && (
            <button
              onClick={async () => {
                try {
                  const token = await import('@/lib/firebase').then(m => m.getIdToken())
                  const res = await fetch(api.exportPlaywright(runId), {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                  })
                  if (!res.ok) throw new Error('Failed')
                  const text = await res.text()
                  const blob = new Blob([text], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `autoqa-test-${runId.slice(0, 8)}.spec.ts`
                  a.click()
                  URL.revokeObjectURL(url)
                } catch {
                  window.open(api.exportPlaywright(runId), '_blank')
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-all border border-gray-700"
            >
              <Code2 className="w-4 h-4" />
              Export
            </button>
          )}

          {(status === 'PASS' || status === 'FAIL') && reportUrl && (
            <button
              onClick={handleOpenReport}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-all border border-gray-700"
            >
              <FileText className="w-4 h-4" />
              Report
            </button>
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

          {/* Result Banner */}
          {status === 'PASS' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/85 border border-green-800/50 animate-fade-in shadow-sm">
              <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-800/50 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-green-400 font-semibold text-sm">Test Passed</p>
                <p className="text-gray-500 text-xs">{steps.length} steps completed in {((durationMs || 0) / 1000).toFixed(1)}s</p>
              </div>
            </div>
          )}
          {status === 'FAIL' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/30 border border-red-800/50 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="text-red-400 text-lg font-bold">&times;</span>
              </div>
              <div>
                <p className="text-red-400 font-semibold text-sm">Test Failed</p>
                <p className="text-red-300/70 text-xs">{steps.length} steps — see AI summary below</p>
              </div>
            </div>
          )}

          {/* Summary Card */}
          {(status === 'PASS' || status === 'FAIL') && summary && (
            <div className={`p-4 rounded-xl border text-sm ${
              status === 'PASS'
                ? 'bg-white/85 border-green-800/50 text-gray-300 shadow-sm'
                : 'bg-red-950/20 border-red-800/50 text-red-300'
            }`}>
              <p className={`font-medium mb-1.5 ${status === 'PASS' ? 'text-green-400' : ''}`}>AI Summary</p>
              <p className="opacity-90 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Error State */}
          {status === 'ERROR' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/30 border border-red-800/50 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span className="text-red-400 text-lg font-bold">!</span>
              </div>
              <div>
                <p className="text-red-400 font-semibold text-sm">Error</p>
                <p className="text-red-300/70 text-xs">Something went wrong during execution</p>
              </div>
            </div>
          )}

          {/* Done Actions */}
          {isDone && (
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
