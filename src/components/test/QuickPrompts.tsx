'use client'

const PROMPTS = [
  { label: 'Login test', prompt: 'Test login with wrong credentials and verify an error message appears.' },
  { label: 'Add to cart', prompt: 'Find the first product, click Add to Cart, and verify cart count increases to 1.' },
  { label: 'Signup', prompt: 'Fill in the signup form with test data, submit, and verify a success message.' },
  { label: 'Search', prompt: 'Search for "laptop" and verify results appear on the page.' },
  { label: 'Contact form', prompt: 'Fill the contact form with name "Test User", email "test@autoqa.app", a message, and submit.' },
  { label: 'Accessibility', prompt: 'Navigate through the page and check for accessibility issues: color contrast, missing labels, small touch targets, and keyboard navigation.' },
]

export function QuickPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {PROMPTS.map(p => (
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
