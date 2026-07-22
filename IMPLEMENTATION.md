# Levvro — Implementation Plan (enhanced build brief)

The definitive blueprint for the enhanced Levvro frontend. It captures the
review feedback that motivated this iteration, the design + tech decisions that
answer each point, and the build order. Read alongside
[`PRODUCT.md`](./PRODUCT.md) (strategy — who/what/why) and
[`DESIGN.md`](./DESIGN.md) (visual system — how it looks).

> A complete, **working reference implementation** of everything below already
> exists and was verified — WCAG-AA contrast gate + `tsc` typecheck + browser
> screenshots (marketing & dashboard, light & dark, no console errors) — in the
> sibling `FRONT_LEVVRO` project. This brief is the enhanced blueprint; the
> reference code can be adopted directly rather than rebuilt from scratch.

---

## 1. Source requirements — review feedback (verbatim)

The previous build got good feedback with strict comments. Each is a hard
requirement for this enhanced version:

1. **Buttons feel odd and cheap.**
2. **The background was plain black or white — it must have a dynamic gradient
   background.**
3. **No colour palette.**
4. **No brand identity.**
5. **The dashboard needs to be better.**
6. **Structure: a landing page + header + footer + marketing page is a must.**
7. **Search online for the best library per section of the frontend, evaluate
   as a top-0.1% designer, then pick, use, and install the winners.**

---

## 2. How each requirement is answered

### #3 + #4 — Colour palette & brand identity → **Deep Teal + Achievement Gold**
The reflex palette (indigo → violet → fuchsia) *is* the generic AI-SaaS purple
the brand's own anti-references forbid — which is exactly why it read as "no
identity." The ownable replacement (all OKLCH in `src/lib/design/tokens.ts`,
gated to WCAG-AA at build time):

- **Primary — deep peacock teal** (`brand`, hue ~195°): actions, selection,
  focus, links, brand text. Distinct from AI purple, LinkedIn blue, growth-green.
- **Accent — warm achievement gold** (`accent`, hue ~80°): the gradient
  terminus, highlights, streaks, achievement/score moments — the "confident &
  motivated" emotion.
- **Brand gradient** `gradient-from → via → to` = teal → aqua → gold — logo,
  CTA band, progress ring, and both backdrops.
- Surfaces re-hued from violet to teal-cool: near-white (light) / teal-ink
  near-black (dark). Neutrals stay zinc. Full detail in `DESIGN.md`.

### #1 — Buttons → crafted, with depth  (`src/components/ui/button.tsx`)
Default **36px** (`h-9`), soft shadow, a crafted inner top highlight via
Tailwind v4 `inset-ring` (no focus-ring collision), a brightness lift on hover,
and an `:active` press — replacing the flat `opacity/80` fade.

### #2 — Background → dynamic on every surface
- **Marketing / auth — `AuroraBackdrop`:** layered CSS wash + drifting glows + a
  low-opacity WebGL mesh (`@paper-design/shaders-react`) in teal → aqua → gold.
- **App — `AmbientBackdrop`:** a restrained, CSS-only glow behind the app shell
  (which is transparent so it shows through). No screen is ever flat.
- Both `fixed`, `aria-hidden`, token-themed, frozen under `prefers-reduced-motion`.

### #5 — Dashboard → premium & on-brand
The Career Health Dashboard carries the new palette, ambient background, gold
accents, crafted buttons, and the teal→gold score ring. **Premium pass applied:**
the Career Score is now a hero (a larger glowing ring with a soft brand aura, a
6xl score, and always-visible teal category bars); the stat row leads with a
gradient chip on the Career-Score stat while the rest stay tinted; Applications
is hairline-divided (no nested cards); and every card has a subtle resting lift.
Product-register restraint preserved — refined, not over-decorated.

### #6 — Structure → landing + header + footer + marketing
Built in `src/app/page.tsx`: marketing header, hero with an authentic product
preview, bento feature section, gradient CTA band, and a large SaaS footer.
**Next:** real `/about`, `/pricing`, `/security` routes (footer currently links
to `#` anchors) and a testimonials band once proof assets exist.

### #7 — Best library per section (researched, 2026)
Consolidation is the tiebreaker for a Linear/Notion-craft bar on Next 16 (RSC) ·
React 19 · Tailwind v4.

| Concern | Winner | Notes |
|---|---|---|
| Component primitives | **shadcn/ui on Radix** | own-the-code; Tailwind-native; RSC-friendly |
| Styling engine | **Tailwind v4 + CVA + tailwind-merge** | no runtime CSS-in-JS (kills Emotion/Theme UI) |
| Animation | **Motion** (`motion/react`) | reduced-motion native |
| Smooth scroll (marketing only) | **Lenis** | disable under reduced-motion; not in the app |
| Charts | **Recharts** | one library (drop Tremor / Mantine charts) |
| Tables | **TanStack Table** v8 | headless, keeps your design language |
| Forms | **react-hook-form + zod** | shared client/server schema |
| Icons | **lucide** | geometric line set shadcn expects |
| Background FX | **@paper-design/shaders-react** | pinned 0.0.x, reduced-motion-gated |
| Client state | **TanStack Query + Zustand** | drop Redux Toolkit (Zustand for the little UI state) |
| Toasts | **Sonner** | shadcn's toast |
| Theme / Auth | **next-themes / Clerk** | — |

Removed as bloat with zero component consumers: **Mantine, Theme UI, Emotion,
Tremor** (four styling systems → one; 96 packages gone in the reference build).

---

## 3. Build / adoption order

1. Scaffold Next 16 (App Router, RSC) · React 19 · TypeScript · Tailwind v4, or
   adopt the `FRONT_LEVVRO` codebase directly.
2. Install the stack in §2.7 (winners only — do not install the removed bloat).
3. Land `src/lib/design/tokens.ts` (teal/gold) + `scripts/build-tokens.mts`
   (contrast gate). `npm run tokens`.
4. Build the `ui` primitives (crafted Button first) and the app shell
   (sidebar / header / bottom-nav) with `AmbientBackdrop`.
5. Marketing page (`AuroraBackdrop` hero, features, CTA, footer) — requirement #6.
6. Career Health Dashboard — requirement #5, including the depth pass.
7. Feature surfaces: AI Coach, Roadmap, Resume, Cover Letter, Applications,
   Achievements, Onboarding/empty states.
8. Add Lenis to marketing routes; wire Zustand for UI state.
9. `/impeccable audit` + `/impeccable polish` sweep (a11y / perf / responsive).

## 4. Run & verify

```bash
npm install
npm run tokens       # regenerate token CSS + WCAG-AA contrast gate
npm run typecheck    # tsc --noEmit
npm run dev          # http://localhost:3000  (mock auth if .env.local unset)
```

The contrast gate fails the build on any WCAG-AA violation, so a palette edit is
provably accessible before it ships. Never edit `src/styles/*.generated.css` by
hand — edit `tokens.ts` and run `npm run tokens`.
