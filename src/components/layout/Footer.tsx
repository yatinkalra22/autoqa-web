'use client'
import { usePathname } from 'next/navigation'
import { Zap } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith('/shared/')) return null

  return (
    <footer className="border-t border-gray-800 py-6 px-4 lg:px-6">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3 h-3" />
          <span>AutoQA - AI-powered browser testing</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Powered by Gemini 2.5 Flash</span>
          <span className="text-gray-800">|</span>
          <span>Built for Gemini Live Agent Challenge</span>
        </div>
      </div>
    </footer>
  )
}
