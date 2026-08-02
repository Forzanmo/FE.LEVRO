import { cn } from '@/lib/utils'

/**
 * Full-page brand backdrop for the marketing, auth and status surfaces.
 *
 * Five layers, in the order they composite:
 *   1. the themed page colour, owned by <html>
 *   2. one soft atmospheric pool per corner — navy pulling down from the top,
 *      teal answering from the bottom
 *   3. the chevron field: the mark's own hatch, the texture that makes this
 *      backdrop Levvro's rather than anyone's
 *   4. motion — the field rises, slowly, on pointer-fine screens only
 *   5. page content
 *
 * This replaced `AuroraBackdrop`, which was three blurred blobs drifting under
 * a 14% gradient wash. Blurred blobs are the single most saturated backdrop
 * cliché on the web and they were doing two jobs badly: carrying the identity
 * (they carried nothing — swap the hue and it is any other product) and adding
 * depth (a blur has no structure to be deep). The tints here are less than half
 * as strong, so the text above them is measurably cleaner, and the depth comes
 * from a real repeating structure instead.
 *
 * The alphas are a contrast ceiling, not a taste setting:
 * `npm run check:contrast` measures the composited result on the real pages and
 * fails if they drift up.
 *
 * `fixed`, so the field stays put while content scrolls. Decorative
 * (`aria-hidden`), theme-aware through tokens, pure CSS — no JS, no WebGL, and
 * present on the first server-rendered frame.
 */
export function BrandBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)}
    >
      {/* Layer 2 — atmosphere. Two pools, placed on a diagonal so the page has
          a light direction rather than an even glow. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(80% 55% at 15% -10%,' +
            ' color-mix(in oklab, var(--brand-600) 12%, transparent), transparent 70%),' +
            'radial-gradient(70% 50% at 95% 108%,' +
            ' color-mix(in oklab, var(--accent-500) 9%, transparent), transparent 72%)',
        }}
      />

      {/* Layer 3 + 4 — the chevron field. It overhangs by one tile top and
          bottom so the rise loops without a seam. */}
      <div
        className={cn(
          'chevron-field chevron-drift absolute inset-x-0 -inset-y-6',
          'text-[var(--brand-900)] opacity-[0.026] dark:text-white dark:opacity-[0.05]',
        )}
      />
    </div>
  )
}
