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
        <h2 className="text-sm font-medium text-gray-500 tracking-wider uppercase">Recent Runs</h2>
        <Link href="/runs" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
          View all
        </Link>
      </div>
      <div className="space-y-2">
        {runs.map(run => (
          <Link
            key={run.id}
            href={`/runs/${run.id}`}
            className="flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl px-4 py-3 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <StatusBadge status={run.status} />
              <span className="text-sm text-gray-400 truncate">{run.prompt}</span>
            </div>
            {run.durationMs && (
              <span className="flex items-center gap-1 text-xs text-gray-600 shrink-0 ml-3">
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
