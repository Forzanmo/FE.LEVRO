import { cn } from '@/lib/utils'

/**
 * The Levrro mark — a rising arrowhead with an open book cut out of it, and a
 * single teal triangle at the apex.
 *
 * Vector, not the source raster. The mark has to render at 24px in a sidebar,
 * 32px in a header, and 512px in an app-icon slot, and it has to invert to
 * white on the committed navy surfaces. A PNG does none of that; this path is
 * ~1.4KB and does all of it.
 *
 * The geometry is traced from the supplied 1024px artwork and re-coloured to
 * the canonical tokens, so the mark uses the same navy and teal as the rest of
 * the product rather than the artwork's near-miss values (#06274c / #19b5a8).
 *
 * The body is `currentColor` so a parent can set it with a text utility; only
 * the apex triangle carries its own fill, because it is the one part that must
 * stay teal on every surface.
 */

const BODY_PATH =
  'M49.81 0.17L50 0L50.22 0.2L100 59.5L100 87.98L99.7 87.86L94.03 83.37L89 79.87L80.68 74.61' +
  'L71.88 69.47L71.51 69.47L57.96 80.07L53.63 83.68L50.12 86.9L46.85 83.92L42.28 80.07' +
  'L37.3 76.16L28.37 69.47L24.48 71.59L18.74 74.99L11.24 79.75L5.85 83.49L0.3 87.86L0 87.98' +
  'L0 59.5Z' +
  'M21.63 39.9L25.01 41.81L29.5 44.66L33.45 47.44L37.35 50.51L39.16 52.07L41.56 54.47' +
  'L43.12 56.28L44.89 58.6L47.04 62.1L47.9 64.12L47.96 77.04L47.84 77.28L46.49 75.99' +
  'L40.92 71.7L36.44 68.72L31.65 65.95L28.13 64.18L23.42 62.15L18.35 60.38L15.92 59.68' +
  'L14.78 59.5L14.8 58.91Z' +
  'M78.04 40L78.37 39.9L85.46 59.38L82.01 60.26L77.54 61.79L72.12 64.06L68.35 65.95' +
  'L63.19 68.96L59.44 71.46L56.33 73.76L52.04 77.28L52.1 64.24L53.08 61.98L54.99 58.84' +
  'L58.08 54.95L61.2 51.83L63.61 49.79L69.18 45.62L72.57 43.36Z'

const APEX_PATH = 'M49.81 8.22L50 8.05L50.22 8.25L60.82 22.6L60.58 22.72L39.42 22.72L39.18 22.6Z'

export interface BrandMarkProps {
  /**
   * `auto` — navy on light surfaces, white on dark ones.
   * `onBrand` — always white, for the committed navy folds, which do not invert
   * with the theme and so must not let their logo invert either.
   */
  tone?: 'auto' | 'onBrand'
  className?: string
}

export function BrandMark({ tone = 'auto', className }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 100 87.98"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={cn(
        'h-auto w-full shrink-0',
        tone === 'onBrand' ? 'text-white' : 'text-[var(--brand-900)] dark:text-white',
        className,
      )}
    >
      <path d={BODY_PATH} fill="currentColor" fillRule="evenodd" />
      <path d={APEX_PATH} fill="var(--accent-500)" />
    </svg>
  )
}
