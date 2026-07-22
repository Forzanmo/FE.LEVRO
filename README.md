# Levvro — AI Career Intelligence (Frontend)

Transform career uncertainty into a measurable roadmap toward getting hired.
Built with a production-grade, scalable frontend architecture.

## Stack

- **Next.js 16** (App Router, RSC, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first) · **shadcn/ui** (Radix) · **CVA** (variants)
- **Motion** (animation) · **Lucide** (icons via a unified `Icon`)
- **TanStack Query** (server state) · **Redux Toolkit** (UI state)
- **React Hook Form** + **Zod** · **TanStack Table** · **Recharts** (charts)
- **Clerk** (auth) · **Sonner** (toasts) · **next-themes** (dark/light)
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

```bash
npm install
cp .env.example .env.local   # optional — runs with mock auth if unset
npm run dev                  # http://localhost:3000
```

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server (regenerates tokens first) |
| `npm run build` | Production build |
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
  config/              Site, fonts, env
```

### Principles

- Server Components by default; client boundaries opt in explicitly.
- No business logic in UI components; every API call goes through `services/`.
- No hardcoded colors / magic numbers — reference tokens only.
- Mobile-first, accessible-first (ARIA, keyboard, reduced-motion honored globally).

## Pending setup (offline environment note)

Storybook and Playwright are **configured and declared** in `package.json`, but their
packages were not installed during scaffolding due to a restricted network. When online:

```bash
npm install                    # installs Storybook, Playwright, Prettier, etc.
npx playwright install chromium
npm run storybook              # or: npm run test:e2e
```

If Storybook's Next.js framework needs reconciling with this Next version, run
`npx storybook@latest init` (the provided `.storybook/*` config and `*.stories.tsx`
are compatible).
