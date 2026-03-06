import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-6xl font-bold text-gray-700 mb-4">404</h1>
      <p className="text-gray-400 text-lg mb-8">Page not found</p>
      <Link
        href="/"
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition-all border border-gray-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  )
}
