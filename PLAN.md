# AutoQA Build Plan

## Phase 1: Project Scaffolding
- [x] **1a** Frontend: Next.js 14 + TypeScript + Tailwind setup (autoqa-web)
- [x] **1b** Backend: Fastify + TypeScript setup (autoqa-api)

## Phase 2: Shared Types & Config
- [x] **2a** Frontend: Types, API client, utils, env config
- [x] **2b** Backend: Config (zod), DB schema (Drizzle + Postgres), Redis connection

## Phase 3: Core UI (Frontend)
- [x] **3a** Root layout, globals.css, fonts (Inter + JetBrains Mono)
- [x] **3b** Header + NavLink components
- [x] **3c** Home page with hero + TestBuilder + QuickPrompts
- [x] **3d** UI components: StatusBadge, Button, Spinner

## Phase 4: Backend Core
- [x] **4a** Server bootstrap (Fastify + CORS + WebSocket)
- [x] **4b** Routes: runs (POST/GET), tests (CRUD), webhooks
- [x] **4c** WebSocket handler (per-run rooms, broadcast)
- [x] **4d** BullMQ queue setup (jobs, worker skeleton)

## Phase 5: Gemini AI Services (Backend)
- [x] **5a** Gemini client (google/generative-ai)
- [x] **5b** ActionPlanner — plan next action from screenshot
- [x] **5c** ElementDetector — bounding box detection
- [x] **5d** ResultValidator — pass/fail determination
- [x] **5e** Rate limiter for Gemini API

## Phase 6: Playwright Engine (Backend)
- [x] **6a** Browser pool + screenshot capture
- [x] **6b** Action executor (click, type, scroll, pressKey, navigate, wait, hover)
- [x] **6c** Full test runner worker (orchestrates planner + detector + executor)

## Phase 7: Live Run UI (Frontend)
- [x] **7a** Run page + RunViewer component
- [x] **7b** useRunSocket hook (WebSocket real-time)
- [x] **7c** useElapsed hook
- [x] **7d** ScreenshotViewer component
- [x] **7e** NarrationTerminal component
- [x] **7f** StepsTimeline component

## Phase 8: Reports & Library
- [x] **8a** Backend: Screenshot annotator (Sharp)
- [x] **8b** Backend: HTML report generator + serving route
- [x] **8c** Frontend: Library page (saved tests, run, delete)
- [x] **8d** Backend: AI test suggester endpoint

## Phase 9: Polish & Deploy
- [x] **9a** Docker-compose (Postgres + Redis)
- [x] **9b** Backend Dockerfile
- [x] **9c** Mobile responsiveness
- [x] **9d** Error handling polish
- [ ] **9e** Deploy to Railway (backend) + Vercel (frontend)
