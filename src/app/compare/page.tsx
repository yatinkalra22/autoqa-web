import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CompareView } from './CompareView'

export const metadata: Metadata = {
  title: 'Visual Regression',
}

export default function ComparePage() {
  return (
    <Suspense>
      <CompareView />
    </Suspense>
  )
}
