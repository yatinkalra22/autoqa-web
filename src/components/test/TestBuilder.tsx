'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Play, ChevronDown, ChevronUp, Save, Wand2, Mic, MicOff, Lock, Plus, X } from 'lucide-react'
import { api } from '@/lib/api'
import { QuickPrompts } from './QuickPrompts'
import { A11yAuditPanel } from './A11yAuditPanel'
import { Spinner } from '@/components/ui/Spinner'
import { useVoiceInput } from '@/hooks/useVoiceInput'
import { normalizeTargetUrl } from '@/lib/utils'

export function TestBuilder() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [prompt, setPrompt] = useState('')
  const [maxSteps, setMaxSteps] = useState(20)
  const [saveTest, setSaveTest] = useState(false)
  const [testName, setTestName] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [error, setError] = useState('')
  const [useAuth, setUseAuth] = useState(false)
  const [authMode, setAuthMode] = useState<'profile' | 'inline'>('profile')
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null)
  const [matchedProfiles, setMatchedProfiles] = useState<any[]>([])
  const [allProfiles, setAllProfiles] = useState<any[]>([])
  const [loginUrl, setLoginUrl] = useState('')
  const [credentials, setCredentials] = useState<Array<{ field: string; value: string }>>([
    { field: 'Email', value: '' },
    { field: 'Password', value: '' },
  ])
  const [submitButton, setSubmitButton] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)
  const { listening, supported: voiceSupported, toggle: toggleVoice, error: voiceError } = useVoiceInput(
    (transcript) => setPrompt(prev => prev ? `${prev} ${transcript}` : transcript)
  )
  const urlValidation = normalizeTargetUrl(url)
  const hasValidUrl = Boolean(urlValidation.normalizedUrl)

  // Load all auth profiles on mount
  useEffect(() => {
    api.getAuthProfiles().then(setAllProfiles).catch(() => {})
  }, [])

  // Auto-match profiles when URL changes
  const matchProfiles = useCallback((targetUrl: string) => {
    try {
      const domain = new URL(targetUrl).hostname
      const matches = allProfiles.filter(p =>
        domain.includes(p.domain) || p.domain.includes(domain)
      )
      setMatchedProfiles(matches)
      // Auto-select if exactly one match
      if (matches.length === 1 && !selectedProfileId) {
        setSelectedProfileId(matches[0].id)
        setUseAuth(true)
        setAuthMode('profile')
      }
    } catch {
      setMatchedProfiles([])
    }
  }, [allProfiles, selectedProfileId])

  useEffect(() => {
    const { normalizedUrl } = normalizeTargetUrl(url)
    if (normalizedUrl) matchProfiles(normalizedUrl)
  }, [url, matchProfiles])

  const handleRun = async () => {
    const { normalizedUrl, error: urlError } = normalizeTargetUrl(url)
    if (urlError || !normalizedUrl) return setError(urlError || 'Please enter a valid URL.')
    if (!prompt.trim()) return setError('Please describe what to test.')
    setError('')
    setLoading(true)
    try {
      // Build auth config
      let authConfig: any = undefined
      let authProfileId: string | undefined = undefined

      if (useAuth) {
        if (authMode === 'profile' && selectedProfileId) {
          authProfileId = selectedProfileId
        } else if (authMode === 'inline' && loginUrl.trim() && credentials.some(c => c.value.trim())) {
          authConfig = {
            loginUrl: loginUrl.trim(),
            credentials: credentials.filter(c => c.field.trim() && c.value.trim()),
            ...(submitButton.trim() ? { submitButton: submitButton.trim() } : {}),
          }
        }
      }

      const { runId } = await api.createRun({
        targetUrl: normalizedUrl,
        prompt: prompt.trim(),
        maxSteps,
        saveTest,
        testName,
        auth: authConfig,
        authProfileId,
      })
      setUrl(normalizedUrl)
      router.push(`/runs/${runId}`)
    } catch (e: unknown) {
      const rawMessage = e instanceof Error ? e.message : 'Failed to start test. Check the URL and try again.'
      const message = /^HTTP 5\d\d$/.test(rawMessage)
        ? 'Could not start the test right now. Please check that the API server is running and try again.'
        : rawMessage
      setError(message)
      setLoading(false)
    }
  }

  const handleSuggest = async () => {
    const { normalizedUrl, error: urlError } = normalizeTargetUrl(url)
    if (urlError || !normalizedUrl) return setError(urlError || 'Enter a valid URL first to get suggestions.')
    setError('')
    setSuggesting(true)
    try {
      const { suggestions } = await api.suggestTests(normalizedUrl)
      setUrl(normalizedUrl)
      if (suggestions?.[0]) setPrompt(suggestions[0])
    } catch {
      // silently fail on suggestion errors
    }
    setSuggesting(false)
  }

  return (
    <>
      <QuickPrompts onSelect={setPrompt} />

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-4">
        {/* URL */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Globe className="w-4 h-4 inline mr-1.5 text-gray-500" />
            Target URL
          </label>
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://your-app.com"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* Prompt */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-300">Test Instructions</label>
            <div className="flex items-center gap-3">
              {voiceSupported && (
                <button
                  onClick={toggleVoice}
                  title={listening ? 'Stop recording' : 'Dictate test instructions'}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                    listening
                      ? 'bg-red-50 border-red-300 text-red-600 shadow-sm shadow-red-100'
                      : 'bg-white border-[#b9cbe8] text-[var(--theme-muted)] hover:border-[var(--theme-accent)] hover:text-[var(--theme-accent)] hover:bg-orange-50'
                  }`}
                >
                  {listening ? (
                    <>
                      <MicOff className="w-3.5 h-3.5" />
                      <span>Stop</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5" />
                      <span>Voice</span>
                    </>
                  )}
                </button>
              )}
              <button
                onClick={handleSuggest}
                disabled={suggesting || !hasValidUrl}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors"
              >
                <Wand2 className="w-3.5 h-3.5" />
                {suggesting ? 'Analyzing...' : 'AI Suggest'}
              </button>
            </div>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={'Describe what to test in plain English...\n\nExample: "Test login with wrong password and verify an error message appears."'}
            rows={5}
            maxLength={2000}
            className={`w-full bg-gray-800 border rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 resize-none transition-all ${
              listening
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500/50'
            }`}
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${prompt.length > 1800 ? 'text-amber-400' : 'text-gray-600'}`}>
              {prompt.length} / 2000
            </span>
          </div>
        </div>

        {/* Auth — always visible */}
        {/* Smart banner when a saved profile matches the URL */}
        {matchedProfiles.length > 0 && !useAuth && (
          <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-blue-950/40 border border-blue-800/40 rounded-xl animate-fade-in">
            <Lock className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm text-blue-300">
                Saved login for <span className="font-medium text-blue-200">{matchedProfiles[0].name}</span> detected
              </span>
            </div>
            <button
              onClick={() => {
                setUseAuth(true)
                setAuthMode('profile')
                setSelectedProfileId(matchedProfiles[0].id)
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors shrink-0"
            >
              Use it
            </button>
          </div>
        )}

        {/* Auth toggle — always visible, not hidden in advanced */}
        <div className="mb-5">
          <button
            onClick={() => setUseAuth(!useAuth)}
            className={`flex items-center gap-2 text-sm transition-colors ${
              useAuth ? 'text-blue-400' : 'text-gray-500 hover:text-gray-400'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{useAuth ? 'Login enabled' : 'Need to log in first?'}</span>
            {useAuth && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-600/20 text-blue-400 text-[10px] font-medium rounded">ON</span>
            )}
          </button>

          {useAuth && (
            <div className="mt-3 bg-gray-800/50 rounded-xl p-4 space-y-3 border border-gray-700/50 animate-fade-in">
              {/* Mode toggle: saved profile vs inline */}
              <div className="flex gap-2">
                <button
                  onClick={() => setAuthMode('profile')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    authMode === 'profile'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Saved Profile
                </button>
                <button
                  onClick={() => setAuthMode('inline')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    authMode === 'inline'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  Enter Credentials
                </button>
              </div>

              {authMode === 'profile' && (
                <div className="space-y-2">
                  {matchedProfiles.length > 0 && (
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {matchedProfiles.length} saved profile{matchedProfiles.length > 1 ? 's' : ''} matched for this domain
                    </div>
                  )}

                  {allProfiles.length > 0 ? (
                    <div className="space-y-1.5">
                      {(matchedProfiles.length > 0 ? matchedProfiles : allProfiles).map(profile => (
                        <button
                          key={profile.id}
                          onClick={() => setSelectedProfileId(
                            selectedProfileId === profile.id ? null : profile.id
                          )}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                            selectedProfileId === profile.id
                              ? 'bg-blue-600/20 border border-blue-500/50 text-white'
                              : 'bg-gray-800 border border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{profile.name}</div>
                            <div className="text-xs text-gray-500 truncate">{profile.domain} — {(profile.credentials as any[]).map((c: any) => c.field).join(', ')}</div>
                          </div>
                          {selectedProfileId === profile.id && (
                            <span className="text-blue-400 text-xs font-medium shrink-0">Selected</span>
                          )}
                        </button>
                      ))}
                      {matchedProfiles.length > 0 && matchedProfiles.length < allProfiles.length && (
                        <button
                          onClick={() => setMatchedProfiles(allProfiles)}
                          className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                        >
                          Show all {allProfiles.length} profiles
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      No saved profiles yet. Switch to &quot;Enter Credentials&quot; to create one.
                    </div>
                  )}
                </div>
              )}

              {authMode === 'inline' && (
                <div className="space-y-3">
                  <input
                    type="url"
                    value={loginUrl}
                    onChange={e => setLoginUrl(e.target.value)}
                    placeholder="Login page URL (e.g. https://app.example.com/login)"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                  />

                  <div className="space-y-2">
                    <div className="text-xs text-gray-500">Field names should match form labels or placeholders</div>
                    {credentials.map((cred, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={cred.field}
                          onChange={e => {
                            const next = [...credentials]
                            next[i] = { ...next[i], field: e.target.value }
                            setCredentials(next)
                          }}
                          placeholder="Field (e.g. Email)"
                          className="w-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type={cred.field.toLowerCase().includes('password') ? 'password' : 'text'}
                          value={cred.value}
                          onChange={e => {
                            const next = [...credentials]
                            next[i] = { ...next[i], value: e.target.value }
                            setCredentials(next)
                          }}
                          placeholder="Value"
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                        />
                        {credentials.length > 1 && (
                          <button
                            onClick={() => setCredentials(credentials.filter((_, j) => j !== i))}
                            className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => setCredentials([...credentials, { field: '', value: '' }])}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      Add field
                    </button>
                  </div>

                  <input
                    type="text"
                    value={submitButton}
                    onChange={e => setSubmitButton(e.target.value)}
                    placeholder="Submit button text (optional, e.g. 'Log in')"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                  />

                  {loginUrl.trim() && credentials.some(c => c.value.trim()) && (
                    <button
                      onClick={async () => {
                        setSavingProfile(true)
                        try {
                          const domain = new URL(loginUrl).hostname
                          // Check if a profile already exists for this domain — update instead of creating duplicate
                          const existing = allProfiles.find(p => p.domain === domain)
                          const profileData = {
                            name: `${domain} login`,
                            domain,
                            loginUrl: loginUrl.trim(),
                            credentials: credentials.filter(c => c.field.trim() && c.value.trim()),
                            ...(submitButton.trim() ? { submitButton: submitButton.trim() } : {}),
                          }
                          let profile: any
                          if (existing) {
                            profile = await api.updateAuthProfile(existing.id, profileData)
                            setAllProfiles(prev => prev.map(p => p.id === existing.id ? profile : p))
                          } else {
                            profile = await api.createAuthProfile(profileData)
                            setAllProfiles(prev => [profile, ...prev])
                          }
                          setSelectedProfileId(profile.id)
                          setAuthMode('profile')
                        } catch {}
                        setSavingProfile(false)
                      }}
                      disabled={savingProfile}
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors"
                    >
                      <Save className="w-3 h-3" />
                      {savingProfile ? 'Saving...' : 'Save as profile for future tests'}
                    </button>
                  )}
                </div>
              )}

              <div className="text-xs text-gray-600 leading-relaxed">
                Saved profiles are stored securely and reused across test runs.
              </div>
            </div>
          )}
        </div>

        {/* Advanced options — only max steps + save test */}
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-400 mb-4 transition-colors"
        >
          {showOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          Advanced options
        </button>

        {showOptions && (
          <div className="bg-gray-800/50 rounded-xl p-4 mb-5 space-y-4 border border-gray-700/50 animate-fade-in">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-400 w-24">Max steps:</label>
              <input
                type="number"
                value={maxSteps}
                onChange={e => setMaxSteps(Number(e.target.value))}
                min={5}
                max={50}
                className="w-20 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-xs text-gray-600">Actions before timeout (5-50)</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="saveTest"
                checked={saveTest}
                onChange={e => setSaveTest(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 accent-blue-500"
              />
              <label htmlFor="saveTest" className="text-sm text-gray-400 flex items-center gap-1.5 cursor-pointer">
                <Save className="w-3.5 h-3.5" />
                Save as reusable test
              </label>
            </div>
            {saveTest && (
              <input
                type="text"
                value={testName}
                onChange={e => setTestName(e.target.value)}
                placeholder="Test name (e.g. 'Login error validation')"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
              />
            )}
          </div>
        )}

        {voiceError && (
          <div className="mb-4 px-4 py-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-400 text-sm">
            {voiceError}
          </div>
        )}

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleRun}
          disabled={loading || !hasValidUrl || !prompt.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/20 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Spinner />
              Starting test...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Test
            </>
          )}
        </button>

        <A11yAuditPanel url={url} />
      </div>
    </>
  )
}
