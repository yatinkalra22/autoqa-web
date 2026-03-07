import type { Metadata } from 'next'
import { CompareView } from './CompareView'

export const metadata: Metadata = {
  title: 'Visual Regression',
}

export default function ComparePage() {
  return <CompareView />
}
