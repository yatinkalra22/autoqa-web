'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Clock, ExternalLink, ClipboardList, GitCompareArrows } from 'lucide-react'
import { api } from '@/lib/api'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Spinner } from '@/components/ui/Spinner'
import type { RunStatus } from '@/types'

interface RunItem {
  id: string
  prompt: string
  targetUrl: string
  status: RunStatus
  durationMs: number | null
  startedAt: string | null
}

export function RunsListView() {
  const router = useRouter()
  const [runs, setRuns] = useState<RunItem[]>([])
  const [loading, setLoading] = useState(true)
  const [compareMode, setCompareMode] = useState(false)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    api.getRuns()
      .then(r => setRuns(r))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleSelect = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    )
  }

  const handleCompare = () => {
    if (selected.length === 2) {
      router.push(`/compare?baseline=${selected[0]}&current=${selected[1]}`)
    }
  }

  const formatTime = (iso: string | null) => {
    if (!iso) return ''
    const d = new Date(iso)
    const now = Date.now()
    const diff = now - d.getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Run History</h1>
          <p className="text-gray-500 mt-1">All test executions</p>
        </div>
        {runs.length >= 2 && (
          <div className="flex items-center gap-3">
            {compareMode && selected.length === 2 && (
              <button
                onClick={handleCompare}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium text-white transition-all"
              >
                <GitCompareArrows className="w-4 h-4" />
                Compare Selected
              </button>
            )}
            <button
              onClick={() => { setCompareMode(!compareMode); setSelected([]) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                compareMode
                  ? 'bg-purple-600/20 border-purple-500 text-purple-400'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              <GitCompareArrows className="w-4 h-4" />
              {compareMode ? `Select runs (${selected.length}/2)` : 'Compare'}
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="w-8 h-8" />
        </div>
      ) : runs.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-2xl">
          <ClipboardList className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-1">No runs yet</p>
          <p className="text-gray-600 text-sm">Run your first test from the home page</p>
        </div>
      ) : (
        <div className="space-y-2">
          {runs.map(run => {
            const isSelected = selected.includes(run.id)
            const content = (
              <>
                {compareMode && (
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-600'
                  }`}>
                    {isSelected && <span className="text-white text-xs font-bold">{selected.indexOf(run.id) + 1}</span>}
                  </div>
                )}
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-white font-medium text-sm">#{run.id.slice(0, 8)}</span>
                    <StatusBadge status={run.status} />
                  </div>
                  <p className="text-sm text-gray-500 truncate">{run.prompt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                    <span className="truncate max-w-[200px]">{run.targetUrl}</span>
                    {run.durationMs && (
                      <span className="flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {(run.durationMs / 1000).toFixed(1)}s
                      </span>
                    )}
                    {run.startedAt && (
                      <span className="shrink-0">{formatTime(run.startedAt)}</span>
                    )}
                  </div>
                </div>
                {!compareMode && (
                  <ExternalLink className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors shrink-0" />
                )}
              </>
            )

            if (compareMode) {
              return (
                <button
                  key={run.id}
                  onClick={() => toggleSelect(run.id)}
                  className={`group flex items-center gap-3 w-full text-left bg-gray-900 border rounded-xl px-5 py-4 transition-all ${
                    isSelected ? 'border-purple-500/50 bg-purple-950/20' : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  {content}
                </button>
              )
            }

            return (
              <Link
                key={run.id}
                href={`/runs/${run.id}`}
                className="group flex items-center justify-between bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl px-5 py-4 transition-all"
              >
                {content}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
