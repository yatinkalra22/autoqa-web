'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Trash2, Clock, BookOpen } from 'lucide-react'
import { api } from '@/lib/api'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Spinner } from '@/components/ui/Spinner'

interface SavedTest {
  id: string
  name: string
  prompt: string
  targetUrl: string
  lastRun?: {
    status: 'QUEUED' | 'RUNNING' | 'PASS' | 'FAIL' | 'ERROR'
    durationMs: number
  }
}

export function LibraryView() {
  const router = useRouter()
  const [tests, setTests] = useState<SavedTest[]>([])
  const [loading, setLoading] = useState(true)
  const [runningId, setRunningId] = useState<string | null>(null)

  useEffect(() => {
    api.getTests()
      .then(t => setTests(t))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleRun = async (id: string) => {
    setRunningId(id)
    try {
      const { runId } = await api.runTest(id)
      router.push(`/runs/${runId}`)
    } catch {
      setRunningId(null)
    }
  }

  const handleDelete = async (id: string) => {
    await api.deleteTest(id)
    setTests(t => t.filter(x => x.id !== id))
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Test Library</h1>
        <p className="text-gray-500 mt-1">Saved tests — run anytime, on any schedule</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="w-8 h-8" />
        </div>
      ) : tests.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-2xl">
          <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-1">No saved tests yet</p>
          <p className="text-gray-600 text-sm">Run a test and enable &quot;Save as reusable test&quot;</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tests.map(test => (
            <div
              key={test.id}
              className="group bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-semibold text-white">{test.name}</h3>
                    {test.lastRun && <StatusBadge status={test.lastRun.status} />}
                  </div>
                  <p className="text-sm text-gray-500 truncate mb-2">{test.prompt}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <span>{test.targetUrl}</span>
                    {test.lastRun?.durationMs && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {(test.lastRun.durationMs / 1000).toFixed(1)}s
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRun(test.id)}
                    disabled={runningId === test.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 rounded-lg text-xs font-medium text-white transition-all"
                  >
                    {runningId === test.id ? <Spinner className="w-3 h-3" /> : <Play className="w-3.5 h-3.5" />}
                    Run
                  </button>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
