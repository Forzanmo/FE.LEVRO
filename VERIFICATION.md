# Verification status

How to prove this frontend is sound, and what was true at the last full run.

## Running the gates

```bash
npm run typecheck                        # tsc --noEmit
npx eslint src scripts --max-warnings 0  # zero warnings is the bar
node scripts/build-tokens.mts            # token contrast gate (42 pairs x 2 themes)
npm run build                            # production build, 15 routes

npm run dev                              # then, against the dev server:
npm run check:contrast                   # rendered-pixel WCAG AA, all routes x themes x viewports
npm run check:a11y                       # axe-core + keyboard walk, same matrix
```

Both browser gates take ~30-45 min for the full matrix. Scope them while iterating:

```bash
node scripts/check-contrast.mjs --base http://localhost:3001 --routes '/dashboard#onboarded'
node scripts/check-a11y.mjs     --base http://localhost:3001 --routes '/coach#onboarded'
```

Use PowerShell (not Git Bash) for `--routes`: Git Bash rewrites `/dashboard` into a
Windows path and the gate silently measures `file://` instead.

## Why there are four gates, not one

Each catches a class the others structurally cannot:

| Gate | Catches | Blind to |
|---|---|---|
| `build-tokens` | token *pair* contrast | anything composited — gradients, translucency, overlays |
| `check-contrast` | real composited pixels | semantics, keyboard, focus |
| `check-a11y` (axe) | static DOM violations | focus order, target size, anything behind an interaction |
| `check-a11y` (keyboard) | tab order, hit-area size, unreachable focus | colour |

Every composite failure this codebase has had was invisible to the token gate.
The token gate passed while the hero subhead measured **1.01:1** on screen.

## State matters as much as the route

`scripts/lib/app-state.mjs` holds one route list, shared by both browser gates, and
each route declares the app state it must be measured in (`new`, `onboarded`,
`needs-onboarding`, `signedout`). This exists because of two real misses:

- The dashboard first passed with **11 text runs** — that was the pre-assessment
  empty state. The skills card, documents list, and activity feed were never
  measured. Seeded correctly it reports **52**.
- `/sign-in` and `/onboarding` both **redirected to /dashboard** (the demo session
  auto-authenticates), so the gate measured the wrong page twice and reported green.

`check-contrast` now **fails** on an unexpected redirect rather than passing
quietly, and both gates fail on zero renders. A green result on a state you did not
intend to test is not evidence.

## Gate bugs found and fixed (worth knowing before trusting output)

The measurement harness was wrong more often than the app was. Each of these
produced a confident but false result:

1. **Computed colours are `oklch()`**, not `rgb()` — regex-parsing them yielded
   garbage. Now resolved by painting into a 1×1 sRGB canvas.
2. **Sampling the element box, not the glyph box** — a block-level `<a>` wrapping a
   button sampled page background at its corners. Now uses `Range` rects.
3. **`scroll-behavior: smooth`** meant client rects were collected mid-flight and no
   longer matched the screenshot. Now forced to `auto` during measurement.
4. **React re-renders stripped the `data-contrast-id` attributes** the glyph mask
   keyed on, so text un-masked and the sampler read glyph pixels — reporting a
   perfect 1.00:1 for perfectly fine text. Mask is now attribute-independent.
5. **Text scrolled under the sticky header** still reports client rects, so a heading
   was scored against the nav's teal button. Now hit-tested with `elementFromPoint`.
6. **Dev overlays** (TanStack Query devtools, Next portals) were sampled as page
   background, producing impossible lime/coral/magenta reads. Now hidden.
7. **Keyboard walk broke on the first null**, but Chromium's tab order transiently
   passes through the devtools portal — reporting "0 tab stops" on pages whose
   keyboard order was fine.
8. **Touch targets measured the element, not the hit area.** Small controls here
   expand with an absolutely-positioned `after:` pseudo-element, which
   `getBoundingClientRect` cannot see — so a correctly-built 56×34 switch read as
   18px. Now expands by the pseudo-element's computed insets.
9. **sr-only inputs inside a `<label>`** read as 1×1 targets. The label is the hit
   area; that pattern is correct and is no longer flagged.
10. **WCAG 2.2 SC 2.5.8 exempts inline links in a sentence.** A Privacy Policy link
    inside a paragraph is not an undersized target. Now honoured.
11. **Walk stopped on any repeated label**, so a second "Get started" (header and
    footer both have one) ended it early and left later stops unexamined. Now stops
    only on a true cycle back to the first stop.
12. **The walk pressed Tab twice per iteration** — once at the top of the loop and
    again after recording a stop — so it examined every *other* focusable element
    and reported the halved count as full coverage. Every touch-target and
    focus-visibility result before this fix was drawn from half the tab order.
13. **`probe()` could hang forever.** It cleared its abort timer as soon as the
    response headers arrived, then awaited `res.text()` with nothing to interrupt
    it, so a dev server that stalled mid-stream blocked the gate indefinitely.
    Three a11y runs sat blocked here for hours and were written off as lost.
14. **The probe budget was shorter than the server.** At 1500ms against a real
    first response of ~1.78s, the gate concluded a healthy dev server was dead and
    spawned a second one beside it, and the two then fought for the CPU — which is
    what the resulting garbage findings actually measured. Dead ports now cost a
    400ms TCP check; a port that is listening gets 20s.

## Last full-matrix result

Run end-to-end, sequentially, on the committed code — one gate at a time, nothing
else touching the machine. Concurrency between a gate and anything else is not a
detail: it invalidated two earlier runs outright.

- `typecheck` — clean
- `eslint src scripts --max-warnings 0` — clean
- token gate — **42 pairs × 2 themes**, pass
- production build — **14 routes**, pass
- `check-contrast` — **2,068/2,068 text runs clear WCAG AA**, every route in its
  intended state
- `check-a11y` — **80 page renders, 0 axe violations, 0 keyboard findings** (the
  first run with the doubled tab coverage, so this is the first time the
  touch-target and focus checks saw the whole tab order)
- `playwright test` — **21 passed, 2 skipped**; the skips are the `describe.skip`'d
  roadmap specs for the unbuilt feature

### Bundle, same run

Measured with CDP encoded bytes against `next start`, not estimated from the build
output.

| Route | JS (gzipped) |
|---|---|
| `/` | 285KB |
| `(app)` routes | 562KB |

~103KB of the app-route figure is two byte-equivalent copies of zod and two of
motion. It is a Turbopack chunk-allocation artifact, not app code — see the note in
`next.config.ts`.

## Known gaps

- **The duplicated vendor chunks above.** Worth re-measuring on each Next upgrade;
  if it persists, it is worth an upstream issue.
- No reduced-motion pass in either gate. `ProgressRing`, `Reveal`, and the aurora all
  branch on `useReducedMotion()`, and none of that is asserted.
- No intermediate breakpoints — only 390px and 1280px. The `md`/`lg` transitions
  (sidebar ↔ bottom-nav swap) are unprobed.
- Interaction states are unmeasured: no open Select/Dialog/Dropdown, no hover, no
  form-validation errors, no loading skeletons. axe therefore never sees portal
  content.
- `/terms` and `/privacy` are honest placeholders, not legal copy. They say so.
- `authService.seedReturningUser()` still auto-authenticates in dev, which is why
  `/sign-in` needs a seeded signed-out state to be reachable. Putting it behind
  `NEXT_PUBLIC_DEMO_MODE` would make the real funnel the default.
