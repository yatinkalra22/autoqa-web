import { TestBuilder } from '@/components/test/TestBuilder'
import { RecentRuns } from '@/components/test/RecentRuns'
import { HowItWorks } from '@/components/test/HowItWorks'
import { PersonalizedHero } from '@/components/test/PersonalizedHero'

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-8 lg:py-16">
      <PersonalizedHero />
      <TestBuilder />
      <RecentRuns />
      <HowItWorks />
    </div>
  )
}
