import { getIdToken } from '@/lib/firebase'

const BASE = typeof window !== 'undefined' && process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_API_URL + '/api'
  : '/api'

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await getIdToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...Object.fromEntries(
      Object.entries(options?.headers || {}).filter(([, v]) => typeof v === 'string') as [string, string][]
    ),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
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
    auth?: {
      loginUrl: string
      credentials: Array<{ field: string; value: string }>
      submitButton?: string
    }
    authProfileId?: string
  }) => req<{ runId: string }>('/runs', { method: 'POST', body: JSON.stringify(body) }),

  getRun: (runId: string) => req<any>(`/runs/${runId}`),

  getRuns: () => req<any[]>('/runs'),

  getTests: () => req<any[]>('/tests'),

  runTest: (id: string) =>
    req<{ runId: string }>(`/tests/${id}/run`, { method: 'POST', body: JSON.stringify({}) }),

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

  getWebhooks: () =>
    req<{ webhooks: Array<{ url: string; type: 'slack' | 'generic' }> }>('/settings/webhooks'),

  saveWebhooks: (webhooks: Array<{ url: string; type: 'slack' | 'generic' }>) =>
    req<{ webhooks: Array<{ url: string; type: 'slack' | 'generic' }> }>('/settings/webhooks', {
      method: 'PUT',
      body: JSON.stringify({ webhooks }),
    }),

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

  // Auth profiles
  getAuthProfiles: () =>
    req<any[]>('/auth-profiles'),

  getAuthProfile: (id: string) =>
    req<any>(`/auth-profiles/${id}`),

  createAuthProfile: (body: {
    name: string
    domain: string
    loginUrl: string
    credentials: Array<{ field: string; value: string }>
    submitButton?: string
  }) => req<any>('/auth-profiles', { method: 'POST', body: JSON.stringify(body) }),

  updateAuthProfile: (id: string, body: {
    name: string
    domain: string
    loginUrl: string
    credentials: Array<{ field: string; value: string }>
    submitButton?: string
  }) => req<any>(`/auth-profiles/${id}`, { method: 'PUT', body: JSON.stringify(body) }),

  deleteAuthProfile: (id: string) =>
    req<void>(`/auth-profiles/${id}`, { method: 'DELETE' }),

  matchAuthProfiles: (domain: string) =>
    req<any[]>(`/auth-profiles/match?domain=${encodeURIComponent(domain)}`),

  // Share — generate a public share link for a run
  createShareLink: (runId: string) =>
    req<{ shareId: string; shareUrl: string }>(`/runs/${runId}/share`, { method: 'POST', body: JSON.stringify({}) }),
}
