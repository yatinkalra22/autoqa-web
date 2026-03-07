'use client'
import { useState, useEffect } from 'react'
import { Settings, Plus, Trash2, Check, Bell } from 'lucide-react'
import { api } from '@/lib/api'
import { Spinner } from '@/components/ui/Spinner'

interface WebhookEntry {
  url: string
  type: 'slack' | 'generic'
}

export function SettingsView() {
  const [webhooks, setWebhooks] = useState<WebhookEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.getWebhooks()
      .then(data => setWebhooks(data.webhooks))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const addWebhook = () => {
    setWebhooks([...webhooks, { url: '', type: 'slack' }])
  }

  const removeWebhook = (index: number) => {
    setWebhooks(webhooks.filter((_, i) => i !== index))
  }

  const updateWebhook = (index: number, field: keyof WebhookEntry, value: string) => {
    setWebhooks(webhooks.map((w, i) => i === index ? { ...w, [field]: value } : w))
  }

  const handleSave = async () => {
    const valid = webhooks.filter(w => w.url.trim())
    setSaving(true)
    try {
      const data = await api.saveWebhooks(valid)
      setWebhooks(data.webhooks)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // silently fail
    }
    setSaving(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8 lg:py-12">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-6 h-6 text-gray-400" />
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-gray-400" />
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">Get notified when test runs complete. Supports Slack incoming webhooks and generic HTTP webhooks.</p>

        {loading ? (
          <div className="flex justify-center py-8"><Spinner className="w-6 h-6" /></div>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {webhooks.map((wh, i) => (
                <div key={i} className="flex items-center gap-3 animate-fade-in">
                  <select
                    value={wh.type}
                    onChange={e => updateWebhook(i, 'type', e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="slack">Slack</option>
                    <option value="generic">Webhook</option>
                  </select>
                  <input
                    type="url"
                    value={wh.url}
                    onChange={e => updateWebhook(i, 'url', e.target.value)}
                    placeholder={wh.type === 'slack' ? 'https://hooks.slack.com/services/...' : 'https://your-server.com/webhook'}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => removeWebhook(i)}
                    className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addWebhook}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
            >
              <Plus className="w-4 h-4" />
              Add webhook
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-lg font-medium text-white text-sm transition-all"
            >
              {saving ? (
                <Spinner />
              ) : saved ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  Saved
                </>
              ) : (
                'Save Settings'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
