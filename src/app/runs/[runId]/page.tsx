import { RunViewer } from './RunViewer'

export default async function RunPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params
  return <RunViewer runId={runId} />
}
