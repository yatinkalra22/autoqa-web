import { TestBuilder } from '@/components/test/TestBuilder'
import { RecentRuns } from '@/components/test/RecentRuns'

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8 lg:py-16">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950 border border-blue-800 rounded-full text-blue-400 text-sm font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          AI-Powered Browser Testing
        </div>
        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
          Test anything.<br />
          <span className="text-blue-400">Just describe it.</span>
        </h1>
        <p className="text-gray-400 text-lg lg:text-xl">
          No code. No selectors. AutoQA handles the rest.
        </p>
      </div>

      <TestBuilder />

      <RecentRuns />
    </div>
  )
}
