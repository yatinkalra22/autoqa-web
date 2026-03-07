# AutoQA Web

> Frontend for AutoQA - AI-powered browser testing agent. Test any web app with plain English.

## Tech Stack

- **Next.js 14** - App Router, Server Components
- **TypeScript** - Full type safety
- **Tailwind CSS** - Dark mode UI
- **Zustand** - State management
- **Lucide React** - Icons
- **WebSocket** - Real-time test execution updates

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment
cp .env.example .env.local
# Update API URLs if needed

# 3. Start development server
pnpm dev
```

Opens on `http://localhost:3000`. Requires the [autoqa-api](https://github.com/your-org/autoqa-api) backend running on port 3001.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home - Test builder with URL + prompt input |
| `/runs` | Run history - All past test executions |
| `/runs/[id]` | Live run view - Real-time screenshot + narration |
| `/library` | Test library - Saved reusable tests |
| `/compare` | Visual regression - Side-by-side screenshot comparison |
| `/settings` | Notification webhooks configuration |

## Features

- Natural language test writing - no code, no selectors
- Live browser preview with screenshot streaming
- AI narration terminal with action-type icons (click, type, scroll, etc.)
- Step timeline with pass/fail indicators
- Test library for saving and re-running tests
- Export to Playwright code - generate real `.spec.ts` tests from AI runs
- Accessibility audit - Gemini-powered WCAG 2.1 analysis with score and fix suggestions
- Visual regression - AI-powered screenshot comparison between runs
- Voice input - dictate test instructions using Web Speech API
- Run comparison mode - select two runs from history to compare
- Slack/webhook notifications - get notified on test pass/fail
- Mobile responsive dark mode UI
- Error boundary and 404 handling

## Deployment

```bash
# Build for production
pnpm build

# Deploy to Vercel
vercel
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_WS_URL` - Backend WebSocket URL (use `wss://` for production)
