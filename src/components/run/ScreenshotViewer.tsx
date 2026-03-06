'use client'
import type { BoundingBox, RunStatus } from '@/types'

export function ScreenshotViewer({
  screenshotDataUrl,
  annotation,
  status,
}: {
  screenshotDataUrl: string
  annotation?: BoundingBox
  status: RunStatus
}) {
  const borderColor =
    status === 'PASS' ? 'border-green-700'
    : status === 'FAIL' ? 'border-red-700'
    : 'border-gray-800'

  return (
    <div className={`relative bg-gray-900 border ${borderColor} rounded-xl overflow-hidden transition-colors duration-500`}>
      {!screenshotDataUrl ? (
        <div className="aspect-video flex items-center justify-center text-gray-700">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Launching browser...</p>
          </div>
        </div>
      ) : (
        <img
          src={screenshotDataUrl}
          alt="Browser preview"
          className="w-full animate-fade-in"
        />
      )}

      {status === 'RUNNING' && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur px-2.5 py-1 rounded-full text-xs text-amber-400 border border-amber-800/40">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          LIVE
        </div>
      )}
    </div>
  )
}
