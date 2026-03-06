'use client'
import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
      <p className="text-gray-400 text-sm mb-6 max-w-md text-center">
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium text-white transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  )
}
