'use client'
import { QUICK_PROMPTS } from '@/mocks/quickPrompts'

export function QuickPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {QUICK_PROMPTS.map(p => (
        <button
          key={p.label}
          onClick={() => onSelect(p.prompt)}
          className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-sm text-gray-300 hover:text-white transition-all"
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
