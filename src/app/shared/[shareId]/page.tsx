import { SharedRunViewer } from './SharedRunViewer'

export const metadata = { title: 'Shared Report — AutoQA' }

export default async function SharedPage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = await params
  return <SharedRunViewer shareId={shareId} />
}
