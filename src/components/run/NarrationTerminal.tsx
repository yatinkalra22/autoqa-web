'use client'
import { useEffect, useRef } from 'react'
import {
  MousePointerClick,
  Keyboard,
  ScrollText,
  Globe,
  Clock,
  Move,
  ChevronRight,
} from 'lucide-react'
import type { RunStatus } from '@/types'

interface NarrationEntry {
  step: number
  text: string
  type: 'action' | 'complete' | 'validation' | 'summary'
  actionType?: string
  success?: boolean
}

function ActionIcon({ text, actionType }: { text: string; actionType?: string }) {
  const t = actionType?.toLowerCase() || text.toLowerCase()
  const cls = 'w-3.5 h-3.5 shrink-0 mt-0.5'

  if (t.includes('click') || t.includes('press'))
    return <MousePointerClick className={`${cls} text-blue-400`} />
  if (t.includes('type') || t.includes('input') || t.includes('enter'))
    return <Keyboard className={`${cls} text-amber-400`} />
  if (t.includes('scroll'))
    return <ScrollText className={`${cls} text-purple-400`} />
  if (t.includes('navigate') || t.includes('go to') || t.includes('url'))
    return <Globe className={`${cls} text-cyan-400`} />
  if (t.includes('wait'))
    return <Clock className={`${cls} text-gray-400`} />
  if (t.includes('hover') || t.includes('move'))
    return <Move className={`${cls} text-orange-400`} />

  return <ChevronRight className={`${cls} text-blue-500`} />
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
              <ActionIcon text={n.text} actionType={n.actionType} />
              <span className="text-green-400 leading-relaxed">{n.text}</span>
            </div>
          )}
          {n.type === 'validation' && (
            <div className={`flex items-start gap-2 ${
              n.success ? 'text-green-400'
              : n.text.includes('⚠') ? 'text-amber-400'
              : 'text-red-400'
            }`}>
              <span className="shrink-0">{n.success ? '\u2713' : n.text.includes('⚠') ? '⚠' : '\u2717'}</span>
              <span className="leading-relaxed">{n.text.replace(/^⚠\s*/, '')}</span>
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
