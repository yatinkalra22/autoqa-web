'use client'
import { useState } from 'react'
import { Accessibility, AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { api } from '@/lib/api'
import { Spinner } from '@/components/ui/Spinner'

interface A11yIssue {
  severity: 'critical' | 'major' | 'minor'
  category: string
  element: string
  issue: string
  suggestion: string
}

interface AuditResult {
  score: number
  issues: A11yIssue[]
  summary: string
}

export function A11yAuditPanel({ url }: { url: string }) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(true)

  const handleAudit = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const data = await api.auditA11y(url.trim())
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Audit failed')
    }
    setLoading(false)
  }

  const severityIcon = (s: string) => {
    if (s === 'critical') return <AlertTriangle className="w-4 h-4 text-red-400" />
    if (s === 'major') return <AlertCircle className="w-4 h-4 text-amber-400" />
    return <Info className="w-4 h-4 text-blue-400" />
  }

  const severityColor = (s: string) => {
    if (s === 'critical') return 'border-red-800/50 bg-red-950/20'
    if (s === 'major') return 'border-amber-800/50 bg-amber-950/20'
    return 'border-blue-800/50 bg-blue-950/20'
  }

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <div className="mt-6">
      <button
        onClick={result ? () => setExpanded(!expanded) : handleAudit}
        disabled={loading || !url.trim()}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white disabled:text-gray-600 transition-colors"
      >
        <Accessibility className="w-4 h-4" />
        {loading ? (
          <>
            <Spinner />
            Running accessibility audit...
          </>
        ) : result ? (
          <>
            Accessibility Audit
            <span className={`font-bold ${scoreColor(result.score)}`}>{result.score}/100</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </>
        ) : (
          'Run Accessibility Audit'
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}

      {result && expanded && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <div className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl">
            <div className={`text-4xl font-bold ${scoreColor(result.score)}`}>{result.score}</div>
            <div>
              <p className="text-sm text-white font-medium">Accessibility Score</p>
              <p className="text-xs text-gray-500 mt-0.5">{result.summary}</p>
            </div>
          </div>

          <div className="text-xs text-gray-500 flex gap-4">
            <span className="text-red-400">{result.issues.filter(i => i.severity === 'critical').length} critical</span>
            <span className="text-amber-400">{result.issues.filter(i => i.severity === 'major').length} major</span>
            <span className="text-blue-400">{result.issues.filter(i => i.severity === 'minor').length} minor</span>
          </div>

          {result.issues.map((issue, i) => (
            <div key={i} className={`p-3 rounded-lg border ${severityColor(issue.severity)}`}>
              <div className="flex items-start gap-2">
                {severityIcon(issue.severity)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium">{issue.issue}</span>
                    <span className="text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">{issue.category}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Element: {issue.element}</p>
                  <p className="text-xs text-green-400/80">Fix: {issue.suggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
