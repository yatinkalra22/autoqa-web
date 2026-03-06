import type { RunStatus } from '@/types'

const styles: Record<RunStatus, { label: string; dot: string; badge: string }> = {
  QUEUED:  { label: 'Queued',  dot: 'bg-gray-400',                    badge: 'bg-gray-900 text-gray-400 border-gray-700' },
  RUNNING: { label: 'Running', dot: 'bg-amber-400 animate-pulse',     badge: 'bg-amber-950/50 text-amber-400 border-amber-800' },
  PASS:    { label: 'Pass',    dot: 'bg-green-400',                    badge: 'bg-green-950/50 text-green-400 border-green-800' },
  FAIL:    { label: 'Fail',    dot: 'bg-red-400',                      badge: 'bg-red-950/50 text-red-400 border-red-800' },
  ERROR:   { label: 'Error',   dot: 'bg-red-400',                      badge: 'bg-red-950/50 text-red-400 border-red-800' },
}

export function StatusBadge({ status }: { status: RunStatus }) {
  const s = styles[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}
