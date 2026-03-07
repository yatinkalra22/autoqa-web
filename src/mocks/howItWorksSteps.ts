import { MessageSquareText, Eye, MousePointerClick, ClipboardCheck } from 'lucide-react'

export const HOW_IT_WORKS_STEPS = [
  {
    icon: MessageSquareText,
    title: 'Describe',
    description: 'Write what to test in plain English',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Eye,
    title: 'See',
    description: 'Gemini Vision reads the live screenshot',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    icon: MousePointerClick,
    title: 'Act',
    description: 'AI clicks, types, and scrolls like a human',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: ClipboardCheck,
    title: 'Verify',
    description: 'Validates results visually and explains why',
    color: 'text-green-400 bg-green-500/10 border-green-500/20',
  },
]
