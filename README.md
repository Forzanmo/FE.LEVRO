# Levrro — AI Career Intelligence (Frontend)

Transform career uncertainty into a measurable roadmap toward getting hired.
Built with a production-grade, scalable frontend architecture.

## Stack

- **Next.js 16** (App Router, RSC, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first) · **shadcn/ui** (Radix) · **CVA** (variants)
- **Motion** (animation) · **Lucide** (icons via a unified `Icon`)
- **TanStack Query** (server state) · **Redux Toolkit** (UI state)
- **React Hook Form** + **Zod** · **TanStack Table** · **Recharts** (charts)
- **FastAPI email/password sessions** · **Sonner** (toasts) · **next-themes** (dark/light)
- **Storybook** (design system) · **Playwright** (E2E)

**One styling system** — Tailwind v4 + shadcn/Radix + CVA — over **one design-token
source of truth**, with **next-themes as the single light/dark authority**. (Mantine,
Theme UI, and Emotion were removed in the design consolidation — see `IMPLEMENTATION.md`.)

## Design tokens — single source of truth

All colors, radii, shadows, motion, z-index and layout dimensions are defined **once** in
[`src/lib/design/tokens.ts`](src/lib/design/tokens.ts) and projected everywhere:

```
tokens.ts ──▶ scripts/build-tokens.mts ──┬▶ styles/tokens.generated.css   (:root / .dark CSS vars, OKLCH)
                                          └▶ styles/theme.generated.css    (Tailwind v4 @theme mapping)
```

The generated CSS is committed and rebuilt automatically on `predev` / `prebuild`.
**Never edit `*.generated.css` by hand** — edit `tokens.ts` and run `npm run tokens`.

## Getting started

Use Node.js 24 LTS. Start the FastAPI backend on port 8000 first, then:

```bash
npm ci
cp .env.example .env.local
npm run api:generate
npm run dev                  # http://localhost:3000
```

`LEVRRO_BACKEND_ORIGIN` is server-only. The browser calls same-origin `/api/v1/*`, and Next.js proxies
those requests to FastAPI. Access tokens stay in memory and the rotating refresh token stays in the
backend's HTTP-only cookie.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server (regenerates tokens first) |
| `npm run build` | Production build |
| `npm run api:generate` | Regenerate the typed client from the committed backend OpenAPI contract |
| `npm run tokens` | Regenerate design-token CSS from `tokens.ts` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run storybook` | Storybook design-system explorer |
| `npm run test:e2e` | Playwright E2E |

## Architecture

```
src/
  app/                 App Router routes ((app) group = authenticated shell)
  components/
    ui/                Design-system primitives (Button, Input, Icon, Typography, shadcn)
    layout/            App shell: Sidebar, BottomNav, AppHeader, Logo
    dashboard/ …       Feature-specific presentational components
    shared/            Cross-feature composites (ProgressRing, StatCard, EmptyState …)
  features/            Feature logic: hooks, view-models, containers, types
  services/            All API access (UI never calls fetch directly)
  lib/                 Infra: api client, design tokens, formatters, constants
  providers/           Composed client providers (Store→Query→Auth→Theme→Appearance)
  stores/              Redux Toolkit store + slices (UI state only)
  styles/              Global CSS + generated token layers
  config/              Site and fonts
```

### Principles

- Server Components by default; client boundaries opt in explicitly.
- No business logic in UI components; every API call goes through `services/`.
- No hardcoded colors / magic numbers — reference tokens only.
- Mobile-first, accessible-first (ARIA, keyboard, reduced-motion honored globally).

## Product routes

- `/applications/[id]` is the backend-driven opportunity, CV extraction, guided interview, generation,
  and document workflow.
- `/documents/[id]` edits generated sections and creates durable PDF exports.
- `/admin` is visible only when `/api/v1/auth/me` returns `is_admin: true`; it includes question-set
  versioning/publishing and aggregate AI, email, and funnel operations.

- `/dashboard`, `/coach`, `/roadmap`, `/achievements`, `/resume`, and `/cover-letter` use authenticated
  `/api/v1/product/*` resources. Assessment answers, roadmap completion, resume drafts, and the latest
  standalone cover letter are durable user-owned records; dashboard scores and achievements are derived
  from those records, applications, profile data, and privacy-safe product events.

## Browser tests

```bash
npx playwright install chromium   # once per machine
npm run test:e2e                  # production build + 22 Chromium journeys
```
