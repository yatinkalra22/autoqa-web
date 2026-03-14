# AutoQA Web

> Frontend for AutoQA - AI-powered browser testing agent. Test any web app with plain English.

## Tech Stack

- **Next.js 16** - App Router, React 19
- **TypeScript** - Full type safety
- **Tailwind CSS** - Dark mode UI
- **Lucide React** - Icons
- **WebSocket** - Real-time test execution streaming

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
| `/runs/[id]` | Live run view - Real-time screenshot + AI narration |
| `/library` | Test library - Saved reusable tests |
| `/compare` | Visual regression - Side-by-side screenshot comparison |
| `/settings` | Notification webhooks (Slack + generic) |

## Features

### Test Creation
- **Natural language test writing** — describe what to test in plain English, no code or selectors needed
- **AI Suggest** — enter a URL and let Gemini analyze the page to suggest relevant tests
- **Voice input** — dictate test instructions using Web Speech API (Chrome/Safari)
- **Quick prompts** — pre-built test templates for common scenarios (login, forms, navigation)
- **Advanced options** — configure max steps (5-50), save tests for re-use

### Live Execution
- **Real-time browser preview** — live screenshot stream of the AI interacting with your app
- **AI narration terminal** — see what the AI is thinking and doing in real-time, with action-type icons (click, type, scroll, navigate, wait, hover)
- **Step timeline** — compact pass/fail list of every action taken
- **Progress bar** — current step count vs. max steps
- **Result banner** — PASS/FAIL/ERROR with AI-generated summary explaining why

### Testing & QA
- **Test library** — save tests and re-run them with one click
- **Export to Playwright** — generate real `.spec.ts` test code from any AI run
- **Visual regression** — compare screenshots between two runs with AI-powered diff analysis (change level: none/minor/moderate/major)
- **Accessibility audit** — WCAG 2.1 analysis powered by Gemini Vision, with score (0-100), issue categorization (critical/major/minor), element selectors, and fix suggestions
- **Run comparison mode** — select any two runs from history to compare side-by-side

### Notifications & Integration
- **Slack webhooks** — get notified on test pass/fail
- **Generic webhooks** — integrate with any HTTP endpoint
- **CI/CD webhook trigger** — trigger test runs from your CI pipeline

### UI/UX
- Mobile responsive dark mode UI
- Status badges with live indicators (QUEUED, RUNNING, PASS, FAIL, ERROR)
- Copy shareable link to any test run
- Error boundaries and 404 handling

## Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home (TestBuilder)
│   ├── runs/
│   │   ├── page.tsx             # Run history list
│   │   └── [runId]/page.tsx     # Live run viewer
│   ├── library/page.tsx         # Saved tests
│   ├── compare/page.tsx         # Visual regression
│   └── settings/page.tsx        # Webhook config
├── components/
│   ├── test/                    # Test creation
│   │   ├── TestBuilder.tsx      # Main form (URL + prompt + options)
│   │   ├── QuickPrompts.tsx     # Pre-built prompt templates
│   │   ├── A11yAuditPanel.tsx   # Accessibility audit UI
│   │   ├── HowItWorks.tsx       # Onboarding steps
│   │   └── RecentRuns.tsx       # Home page recent runs
│   ├── run/                     # Run execution display
│   │   ├── ScreenshotViewer.tsx # Live screenshot with status border
│   │   ├── StepsTimeline.tsx    # Step list with pass/fail icons
│   │   └── NarrationTerminal.tsx# AI narration log
│   ├── layout/                  # Header, Footer, NavLink
│   └── ui/                      # StatusBadge, Spinner
├── hooks/
│   ├── useRunSocket.ts          # WebSocket + run hydration
│   ├── useVoiceInput.ts         # Web Speech API
│   └── useElapsed.ts            # Timer
├── lib/
│   ├── api.ts                   # API client (all endpoints)
│   └── utils.ts                 # URL validation, helpers
├── types/index.ts               # TypeScript types
└── mocks/                       # Quick prompts, tutorial steps
```

### Real-time Data Flow

```
TestBuilder (form submit)
    → api.createRun() → backend creates job → returns runId
    → router.push(/runs/{runId})

RunViewer (page load)
    → api.getRun(runId) → hydrate if already complete
    → useRunSocket(runId) → WebSocket to ws://localhost:3001/ws/runs/{runId}
        → run_started      → status = RUNNING
        → step_start       → add narration entry
        → step_complete    → update screenshot + append step
        → validation       → show pass/fail message
        → run_complete     → final status + summary + report URL
        → error            → show error state
```

## Deployment

```bash
# Build for production
pnpm build

# Deploy to Vercel
vercel
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL` — Backend API URL (e.g., `https://api.autoqa.dev`)
- `NEXT_PUBLIC_WS_URL` — Backend WebSocket URL (e.g., `wss://api.autoqa.dev`)
