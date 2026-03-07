const BASE = typeof window !== 'undefined' && process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL + '/api'
  : '/api'

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  createRun: (body: {
    targetUrl: string
    prompt: string
    maxSteps: number
    saveTest: boolean
    testName: string
  }) => req<{ runId: string }>('/runs', { method: 'POST', body: JSON.stringify(body) }),

  getRun: (runId: string) => req<any>(`/runs/${runId}`),

  getRuns: () => req<any[]>('/runs'),

  getTests: () => req<any[]>('/tests'),

  runTest: (id: string) =>
    req<{ runId: string }>(`/tests/${id}/run`, { method: 'POST' }),

  deleteTest: (id: string) =>
    req<void>(`/tests/${id}`, { method: 'DELETE' }),

  suggestTests: (targetUrl: string) =>
    req<{ suggestions: string[] }>('/suggest', { method: 'POST', body: JSON.stringify({ targetUrl }) }),

  exportPlaywright: (runId: string) =>
    `${BASE}/runs/${runId}/export`,

  compareRuns: (baselineRunId: string, currentRunId: string) =>
    req<{
      hasChanges: boolean
      changeLevel: 'none' | 'minor' | 'moderate' | 'major'
      differences: Array<{ area: string; description: string; severity: 'low' | 'medium' | 'high' }>
      summary: string
      baselineScreenshot: string
      currentScreenshot: string
    }>('/compare', { method: 'POST', body: JSON.stringify({ baselineRunId, currentRunId }) }),

  auditA11y: (targetUrl: string) =>
    req<{
      score: number
      issues: Array<{
        severity: 'critical' | 'major' | 'minor'
        category: string
        element: string
        issue: string
        suggestion: string
      }>
      summary: string
    }>('/a11y', { method: 'POST', body: JSON.stringify({ targetUrl }) }),
}
