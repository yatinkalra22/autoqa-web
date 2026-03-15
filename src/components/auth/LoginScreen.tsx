'use client'
import { useState } from 'react'
import { Zap, Shield, Users, BarChart3 } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { Spinner } from '@/components/ui/Spinner'

export function LoginScreen() {
  const { signIn } = useAuth()
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState('')

  const handleSignIn = async () => {
    setSigningIn(true)
    setError('')
    try {
      await signIn()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Sign-in failed. Please try again.'
      // Don't show error for user-cancelled popups
      if (!msg.includes('popup-closed-by-user') && !msg.includes('cancelled')) {
        setError(msg)
      }
    }
    setSigningIn(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo & Title */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--theme-accent)] rounded-2xl mb-6 shadow-lg shadow-[var(--theme-accent)]/20">
          <Zap className="w-8 h-8 text-white" style={{ color: 'white' }} />
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight">
          Welcome to <span className="text-[var(--theme-accent)]">AutoQA</span>
        </h1>
        <p className="text-[var(--theme-muted)] text-lg max-w-md mx-auto">
          AI-powered browser testing. Sign in to manage your tests, view run history, and share reports.
        </p>
      </div>

      {/* Sign In Card */}
      <div className="w-full max-w-sm">
        <div className="bg-white/80 backdrop-blur-sm border border-[var(--theme-border)] rounded-2xl p-8 shadow-sm">
          <button
            onClick={handleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-gray-300 hover:border-gray-400 hover:shadow-md rounded-xl font-medium text-[var(--theme-text)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {signingIn ? (
              <Spinner className="w-5 h-5" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            )}
            {signingIn ? 'Signing in...' : 'Continue with Google'}
          </button>

          {error && (
            <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center">
              <Shield className="w-4 h-4 text-[var(--theme-accent)]" />
            </div>
            <span className="text-xs text-[var(--theme-muted)]">Personal workspace</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center">
              <Users className="w-4 h-4 text-[var(--theme-accent)]" />
            </div>
            <span className="text-xs text-[var(--theme-muted)]">Share reports</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[var(--theme-surface)] border border-[var(--theme-border)] flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[var(--theme-accent)]" />
            </div>
            <span className="text-xs text-[var(--theme-muted)]">Track history</span>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--theme-muted)] mt-8">
          By signing in, you agree to our terms of service.
        </p>
      </div>
    </div>
  )
}
