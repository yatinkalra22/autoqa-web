'use client'
import { useState } from 'react'
import { GitCompareArrows, AlertTriangle, AlertCircle, Info, ArrowRight } from 'lucide-react'
import { api } from '@/lib/api'
import { Spinner } from '@/components/ui/Spinner'

interface Difference {
  area: string
  description: string
  severity: 'low' | 'medium' | 'high'
}

interface CompareResult {
  hasChanges: boolean
  changeLevel: 'none' | 'minor' | 'moderate' | 'major'
  differences: Difference[]
  summary: string
  baselineScreenshot: string
  currentScreenshot: string
}

export function CompareView() {
  const [baselineId, setBaselineId] = useState('')
  const [currentId, setCurrentId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CompareResult | null>(null)
  const [error, setError] = useState('')

  const handleCompare = async () => {
    if (!baselineId.trim() || !currentId.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await api.compareRuns(baselineId.trim(), currentId.trim())
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Comparison failed')
    }
    setLoading(false)
  }

  const levelColor = (level: string) => {
    if (level === 'none') return 'text-green-400 bg-green-950/30 border-green-800/50'
    if (level === 'minor') return 'text-blue-400 bg-blue-950/30 border-blue-800/50'
    if (level === 'moderate') return 'text-amber-400 bg-amber-950/30 border-amber-800/50'
    return 'text-red-400 bg-red-950/30 border-red-800/50'
  }

  const severityIcon = (s: string) => {
    if (s === 'high') return <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
    if (s === 'medium') return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
    return <Info className="w-4 h-4 text-blue-400 shrink-0" />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
      <div className="flex items-center gap-3 mb-8">
        <GitCompareArrows className="w-6 h-6 text-purple-400" />
        <h1 className="text-2xl font-bold text-white">Visual Regression</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <p className="text-gray-400 text-sm mb-4">Compare screenshots from two test runs to detect visual changes.</p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={baselineId}
            onChange={e => setBaselineId(e.target.value)}
            placeholder="Baseline Run ID"
            className="flex-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
          />
          <ArrowRight className="w-5 h-5 text-gray-600 shrink-0 hidden sm:block" />
          <input
            type="text"
            value={currentId}
            onChange={e => setCurrentId(e.target.value)}
            placeholder="Current Run ID"
            className="flex-1 w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={handleCompare}
            disabled={loading || !baselineId.trim() || !currentId.trim()}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium text-white text-sm transition-all whitespace-nowrap"
          >
            {loading ? <Spinner /> : 'Compare'}
          </button>
        </div>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </div>

      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Change level badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${levelColor(result.changeLevel)}`}>
            {result.hasChanges ? `${result.changeLevel.charAt(0).toUpperCase() + result.changeLevel.slice(1)} Changes Detected` : 'No Changes Detected'}
          </div>

          {/* Side-by-side screenshots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Baseline</p>
              <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
                <img src={result.baselineScreenshot} alt="Baseline" className="w-full" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Current</p>
              <div className="border border-gray-800 rounded-xl overflow-hidden bg-gray-900">
                <img src={result.currentScreenshot} alt="Current" className="w-full" />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-sm text-gray-400 font-medium mb-1">AI Analysis</p>
            <p className="text-sm text-gray-300 leading-relaxed">{result.summary}</p>
          </div>

          {/* Differences list */}
          {result.differences.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                {result.differences.length} Difference{result.differences.length !== 1 && 's'}
              </p>
              <div className="space-y-2">
                {result.differences.map((diff, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-900 border border-gray-800 rounded-lg">
                    {severityIcon(diff.severity)}
                    <div>
                      <p className="text-sm text-white font-medium">{diff.area}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{diff.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
