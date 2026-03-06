import Link from 'next/link'
import { Zap, Library, ClipboardList, Plus } from 'lucide-react'
import { NavLink } from './NavLink'

export function Header() {
  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center px-6 sticky top-0 z-50 backdrop-blur-sm">
      <Link href="/" className="flex items-center gap-2 mr-8 group">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-white text-lg tracking-tight">AutoQA</span>
      </Link>

      <nav className="flex items-center gap-1 flex-1">
        <NavLink href="/library" icon={<Library className="w-4 h-4" />} label="Library" />
        <NavLink href="/runs" icon={<ClipboardList className="w-4 h-4" />} label="Runs" />
      </nav>

      <Link
        href="/"
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition-all hover:shadow-lg hover:shadow-blue-500/20"
      >
        <Plus className="w-4 h-4" />
        New Test
      </Link>
    </header>
  )
}
