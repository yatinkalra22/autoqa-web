'use client'
import { useEffect, useRef } from 'react'
import type { RunStatus } from '@/types'

interface NarrationEntry {
  step: number
  text: string
  type: 'action' | 'complete' | 'validation' | 'summary'
  success?: boolean
}

export function NarrationTerminal({
  narrations,
  status,
}: {
  narrations: NarrationEntry[]
  status: RunStatus
}) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [narrations.length])

  return (
    <div className="flex-1 overflow-auto bg-gray-950 border-b border-gray-800 p-4 font-mono text-sm min-h-0">
      <div className="text-gray-600 mb-3 text-xs tracking-widest">AI NARRATION</div>

      {narrations.length === 0 && status === 'RUNNING' && (
        <div className="text-gray-600 animate-pulse">Starting browser engine...</div>
      )}

      {narrations.map((n, i) => (
        <div key={i} className="mb-2 animate-slide-up">
          {n.type === 'action' && (
            <div className="flex items-start gap-2">
              <span className="text-blue-500 shrink-0 mt-0.5">&rsaquo;</span>
              <span className="text-green-400 leading-relaxed">{n.text}</span>
            </div>
          )}
          {n.type === 'validation' && (
            <div className={`flex items-start gap-2 ${n.success ? 'text-green-400' : 'text-red-400'}`}>
              <span className="shrink-0">{n.success ? '\u2713' : '\u2717'}</span>
              <span className="leading-relaxed">{n.text}</span>
            </div>
          )}
          {n.type === 'summary' && (
            <div className="mt-3 pt-3 border-t border-gray-800 text-gray-300 text-xs leading-relaxed">
              {n.text}
            </div>
          )}
        </div>
      ))}

      {status === 'RUNNING' && (
        <div className="flex items-center gap-1 text-gray-700 mt-1">
          <span className="inline-block w-2 h-4 bg-gray-700 rounded-sm animate-pulse" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
