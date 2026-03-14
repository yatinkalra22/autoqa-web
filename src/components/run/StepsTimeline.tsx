'use client'
import { CheckCircle2, XCircle } from 'lucide-react'
import type { StepRecord } from '@/types'

export function StepsTimeline({ steps }: { steps: StepRecord[] }) {
  if (steps.length === 0) return null

  return (
    <div className="h-48 overflow-auto bg-gray-900 border-t border-gray-800 p-4">
      <div className="text-gray-600 mb-2 text-xs tracking-widest">STEPS</div>
      <div className="space-y-1.5">
        {steps.map(s => (
          <div key={s.step} className="flex items-center gap-2 text-xs">
            {s.success
              ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
              : <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            }
            <span className="text-gray-500 w-6 shrink-0">{s.step}.</span>
            <span className="text-gray-400 truncate">
              {s.action} — {s.target}
              {s.value && <span className="text-gray-600 ml-1">({s.value})</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
