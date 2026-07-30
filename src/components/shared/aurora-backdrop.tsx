import { cn } from '@/lib/utils'

/**
 * Full-page brand backdrop for the marketing and auth surfaces.
 *
 * A token gradient wash plus three slow drifting glows — pure CSS, server
 * rendered, present on the first frame, no JavaScript and no WebGL.
 *
 * The alphas here are not a matter of taste. They are the ceiling that keeps
 * `muted-foreground` body copy above 4.5:1 once every layer has composited, and
 * `scripts/check-contrast.mjs` measures the rendered result and fails if they
 * drift up. At their previous values (a 55% wash under glows at up to 60%) the
 * hero subhead measured 1.01:1 — the reassurance copy written to calm an
 * anxious first-time job-seeker was the least readable text on the page.
 *
 * This used to also run a `@paper-design/shaders-react` WebGL MeshGradient.
 * It was removed rather than tuned:
 *   - it held a live GL context animating for the lifetime of the tab, shipping
 *     a shader runtime to every landing and auth visitor, for a layer rendered
 *     at 0.16 opacity underneath a wash;
 *   - in dark mode it composited with `mix-blend-plus-lighter`, which is
 *     additive — gold over teal produced olive, and bright overlaps saturated
 *     all three channels to pure white, measured at 1.04:1 behind body copy.
 * Deleting it is visually near-undetectable and removes the single largest
 * runtime cost on the page.
 *
 * `fixed`, so the gradient stays put while content scrolls. Every layer freezes
 * under `prefers-reduced-motion` via the global rule in globals.css.
 * Decorative only (`aria-hidden`) and theme-aware through the gradient tokens.
 */
export function AuroraBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)}
    >
      {/* Base wash — a brand gradient across the entire viewport, so no part of
          the page is ever a flat block of colour. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(158deg,' +
            ' color-mix(in oklab, var(--gradient-from) 14%, transparent) 0%,' +
            ' color-mix(in oklab, var(--gradient-via) 10%, transparent) 30%,' +
            ' color-mix(in oklab, var(--gradient-to) 7%, transparent) 60%,' +
            ' color-mix(in oklab, var(--gradient-from) 5%, transparent) 100%)',
        }}
      />

      {/* Drifting aurora glows (frozen under reduced-motion). */}
      <div
        className="absolute -top-40 left-[8%] h-[46rem] w-[46rem] rounded-full opacity-[0.13] blur-3xl dark:opacity-[0.18]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--gradient-from) 40%, transparent), transparent 66%)',
          animation: 'aurora-drift-a 28s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -top-24 right-[-8rem] h-[42rem] w-[42rem] rounded-full opacity-[0.11] blur-3xl dark:opacity-[0.15]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--gradient-to) 38%, transparent), transparent 66%)',
          animation: 'aurora-drift-b 34s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-10rem] left-1/3 h-[44rem] w-[44rem] rounded-full opacity-[0.10] blur-3xl dark:opacity-[0.14]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--gradient-via) 36%, transparent), transparent 66%)',
          animation: 'aurora-drift-c 40s ease-in-out infinite',
        }}
      />

      {/* Faint dot texture for depth. */}
      <div
        className="absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            'radial-gradient(color-mix(in oklab, var(--foreground) 9%, transparent) 1px, transparent 1.6px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}
