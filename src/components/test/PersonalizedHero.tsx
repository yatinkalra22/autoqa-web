'use client'
import { useAuth } from '@/components/auth/AuthProvider'

export function PersonalizedHero() {
  const { user } = useAuth()
  const firstName = user?.displayName?.split(' ')[0] || 'there'

  // Time-based greeting
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950 border border-blue-800 rounded-full text-blue-400 text-sm font-medium mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        AI-Powered Browser Testing
      </div>
      <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
        {greeting}, {firstName}.<br />
        <span className="text-blue-400">What should we test?</span>
      </h1>
      <p className="text-gray-400 text-lg lg:text-xl">
        No code. No selectors. Just describe it and AutoQA handles the rest.
      </p>
    </div>
  )
}
