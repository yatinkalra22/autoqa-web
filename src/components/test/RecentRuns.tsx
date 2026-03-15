'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { api } from '@/lib/api'
import { StatusBadge } from '@/components/ui/StatusBadge'
import type { RunStatus } from '@/types'

interface RunItem {
  id: string
  prompt: string
  targetUrl: string
  status: RunStatus
  durationMs: number | null
  startedAt: string | null
}

export function RecentRuns() {
  const [runs, setRuns] = useState<RunItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    api.getRuns()
      .then(r => setRuns(r.slice(0, 5)))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  if (!loaded || runs.length === 0) return null

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-[var(--theme-muted)] tracking-wider uppercase">Recent Runs</h2>
        <Link href="/runs" className="text-xs text-[var(--theme-accent)] hover:underline transition-colors">
          View all
        </Link>
      </div>
      <div className="space-y-2">
        {runs.map(run => (
          <Link
            key={run.id}
            href={`/runs/${run.id}`}
            className="flex items-center justify-between bg-white/70 border border-[#b9cbe8] hover:bg-white hover:border-[var(--theme-accent)] hover:shadow-sm rounded-xl px-4 py-3 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <StatusBadge status={run.status} />
              <span className="text-sm text-[var(--theme-text)] truncate">{run.prompt}</span>
            </div>
            {run.durationMs && (
              <span className="flex items-center gap-1 text-xs text-[var(--theme-muted)] shrink-0 ml-3">
                <Clock className="w-3 h-3" />
                {(run.durationMs / 1000).toFixed(1)}s
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
