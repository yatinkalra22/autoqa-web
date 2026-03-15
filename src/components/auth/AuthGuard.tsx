'use client'
import { usePathname } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { LoginScreen } from './LoginScreen'
import { Spinner } from '@/components/ui/Spinner'

// Routes that don't require authentication
const PUBLIC_ROUTES = ['/shared/']

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()

  // Allow public routes without authentication
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="w-10 h-10" />
          <p className="text-[var(--theme-muted)] text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return <>{children}</>
}
