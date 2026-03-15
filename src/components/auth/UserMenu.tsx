'use client'
import { useState, useRef, useEffect } from 'react'
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react'
import { useAuth } from './AuthProvider'

export function UserMenu() {
  const { user, logOut } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const displayName = user.displayName || user.email?.split('@')[0] || 'User'
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--theme-surface-soft)] transition-all"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            className="w-8 h-8 rounded-full border-2 border-[var(--theme-border)]"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[var(--theme-accent)] flex items-center justify-center text-white text-xs font-bold" style={{ color: 'white' }}>
            {initials}
          </div>
        )}
        <span className="text-sm font-medium text-[var(--theme-text)] hidden lg:inline max-w-[120px] truncate">
          {displayName.split(' ')[0]}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--theme-muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[var(--theme-border)] rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
          {/* Profile Section */}
          <div className="px-4 py-3 border-b border-[var(--theme-border)] bg-[var(--theme-surface)]">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={displayName}
                  className="w-10 h-10 rounded-full border-2 border-[var(--theme-border)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[var(--theme-accent)] flex items-center justify-center text-white text-sm font-bold" style={{ color: 'white' }}>
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--theme-text)] truncate">{displayName}</p>
                <p className="text-xs text-[var(--theme-muted)] truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <div className="px-4 py-2.5 flex items-center gap-3 text-sm text-[var(--theme-muted)]">
              <UserIcon className="w-4 h-4" />
              <div className="flex-1">
                <span className="text-xs">Signed in via Google</span>
              </div>
            </div>

            <hr className="border-[var(--theme-border)]" />

            <button
              onClick={async () => {
                setOpen(false)
                await logOut()
              }}
              className="w-full px-4 py-2.5 flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
