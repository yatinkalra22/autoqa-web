# AutoQA Web

> AI-powered browser testing agent. Test any web app with plain English. Personalized per user via Google sign-in.

## Tech Stack

- **Next.js 16** — App Router, React 19
- **Firebase Auth** — Google sign-in, per-user sessions
- **TypeScript** — Full type safety
- **Tailwind CSS** — Light theme UI
- **Lucide React** — Icons
- **WebSocket** — Real-time test execution streaming

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment (interactive)
./scripts/setup-env.sh

# 3. Start development server
pnpm dev
```

Opens on `http://localhost:3000`. Requires the [autoqa-api](https://github.com/your-org/autoqa-api) backend on port 3001.

### Firebase Setup

1. Create a project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Google** sign-in under Authentication > Sign-in method
3. Add `http://localhost:3000` to Authorized Domains
4. Copy the Web app config into `.env.local` (or run `./scripts/setup-env.sh`)

Or automate it:

```bash
./scripts/firebase-setup.sh <YOUR_PROJECT_ID>
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — personalized greeting + test builder |
| `/runs` | Your run history (scoped to your account) |
| `/runs/[id]` | Live run view — real-time screenshot + AI narration |
| `/shared/[id]` | Public shared report (no auth required) |
| `/library` | Your saved reusable tests |
| `/compare` | Visual regression — side-by-side screenshot comparison |
| `/settings` | Account info, notification webhooks |

## Features

### Authentication & Personalization
- **Google sign-in** — one-click login via Firebase Auth
- **Per-user sessions** — runs, tests, and settings are scoped to your account
- **Personalized greeting** — time-based welcome with your name
- **User menu** — profile photo, account info, sign-out in the header
- **Account settings** — view your profile and manage sign-out from Settings

### Test Creation
- **Natural language** — describe what to test in plain English
- **AI Suggest** — let Gemini analyze the page and suggest tests
- **Voice input** — dictate instructions via Web Speech API
- **Quick prompts** — pre-built templates for common scenarios
- **Auth profiles** — saved login credentials with auto-matching by domain

### Live Execution
- **Real-time browser preview** — live screenshot stream
- **AI narration terminal** — what the AI is thinking and doing
- **Step timeline** — compact pass/fail list of every action
- **Progress bar** — step count vs max steps
- **Result banner** — PASS/FAIL/ERROR with AI summary

### Sharing & Reports
- **Share panel** — generate shareable links for completed runs
- **Email share** — send results with a pre-filled email
- **Social share** — share on X/Twitter
- **Export to Playwright** — generate `.spec.ts` test code
- **HTML report** — full report link from the backend

### Testing & QA
- **Test library** — save and re-run tests with one click
- **Visual regression** — AI-powered screenshot diff (none/minor/moderate/major)
- **Accessibility audit** — WCAG 2.1 analysis via Gemini Vision
- **Run comparison** — select two runs to compare side-by-side

### Notifications
- **Slack webhooks** — get notified on pass/fail
- **Generic webhooks** — integrate with any HTTP endpoint

## Architecture

```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home (PersonalizedHero + TestBuilder)
│   ├── layout.tsx               # Root layout (AuthProvider + AuthGuard)
│   ├── runs/                    # Run history + live viewer
│   ├── library/                 # Saved tests
│   ├── compare/                 # Visual regression
│   └── settings/                # Account + webhooks
├── components/
│   ├── auth/                    # Authentication
│   │   ├── AuthProvider.tsx     # Firebase auth context
│   │   ├── AuthGuard.tsx        # Route protection
│   │   ├── LoginScreen.tsx      # Google sign-in page
│   │   └── UserMenu.tsx         # Header profile dropdown
│   ├── test/                    # Test creation
│   ├── run/                     # Run execution display
│   ├── layout/                  # Header (with UserMenu), Footer, NavLink
│   └── ui/                      # StatusBadge, Spinner
├── hooks/                       # useRunSocket, useVoiceInput, useElapsed
├── lib/
│   ├── api.ts                   # API client (auto-attaches Firebase JWT)
│   ├── firebase.ts              # Firebase init, auth helpers
│   └── utils.ts                 # URL validation, helpers
├── types/                       # TypeScript types
└── mocks/                       # Quick prompts, tutorial steps

scripts/
├── firebase-setup.sh            # Automated Firebase project provisioning
├── deploy.sh                    # Vercel deployment with pre-flight checks
└── setup-env.sh                 # Interactive .env.local configuration
```

### Auth Flow

```
User visits app
  → AuthProvider checks Firebase auth state
  → Not signed in? → LoginScreen (Google sign-in popup)
  → Signed in? → App renders with user context
  → API calls include Bearer token (Firebase JWT)
  → Backend validates JWT and scopes data to user
```

## Deployment

### Automated (recommended)

```bash
# Preview deployment
./scripts/deploy.sh

# Production deployment
./scripts/deploy.sh --production
```

### Manual

```bash
pnpm build
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_WS_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

### Infrastructure-as-Code

```bash
# Provision Firebase project + auth + Firestore rules
./scripts/firebase-setup.sh autoqa-prod

# Deploy with pre-flight validation
./scripts/deploy.sh --production
```

See `scripts/` for all automation tooling.

### Backend

The backend deploys to GCP Cloud Run. See [autoqa-api/deploy/DEPLOYMENT.md](../autoqa-api/deploy/DEPLOYMENT.md) for the full guide.
