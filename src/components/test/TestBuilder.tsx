'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Play, ChevronDown, ChevronUp, Save, Wand2 } from 'lucide-react'
import { api } from '@/lib/api'
import { QuickPrompts } from './QuickPrompts'
import { A11yAuditPanel } from './A11yAuditPanel'
import { Spinner } from '@/components/ui/Spinner'

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

  const handleRun = async () => {
    if (!url.trim()) return setError('Please enter a target URL.')
    if (!prompt.trim()) return setError('Please describe what to test.')
    setError('')
    setLoading(true)
    try {
      const { runId } = await api.createRun({
        targetUrl: url.trim(),
        prompt: prompt.trim(),
        maxSteps,
        saveTest,
        testName,
      })
      router.push(`/runs/${runId}`)
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to start test. Check the URL and try again.'
      setError(message)
      setLoading(false)
    }
  }

  const handleSuggest = async () => {
    if (!url.trim()) return setError('Enter a URL first to get suggestions.')
    setSuggesting(true)
    try {
      const { suggestions } = await api.suggestTests(url.trim())
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
            <button
              onClick={handleSuggest}
              disabled={suggesting || !url.trim()}
              className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              {suggesting ? 'Analyzing...' : 'AI Suggest'}
            </button>
          </div>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={'Describe what to test in plain English...\n\nExample: "Test login with wrong password and verify an error message appears."'}
            rows={5}
            maxLength={2000}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all"
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${prompt.length > 1800 ? 'text-amber-400' : 'text-gray-600'}`}>
              {prompt.length} / 2000
            </span>
          </div>
        </div>

        {/* Options */}
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

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-950/50 border border-red-800/50 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleRun}
          disabled={loading || !url.trim() || !prompt.trim()}
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
