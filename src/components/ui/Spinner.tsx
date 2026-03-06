export function Spinner({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <span
      className={`inline-block border-2 border-white/30 border-t-white rounded-full animate-spin ${className}`}
    />
  )
}
