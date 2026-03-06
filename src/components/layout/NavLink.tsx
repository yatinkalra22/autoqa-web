'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + '/')

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
        ${active
          ? 'bg-gray-800 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
        }`}
    >
      {icon}
      {label}
    </Link>
  )
}
