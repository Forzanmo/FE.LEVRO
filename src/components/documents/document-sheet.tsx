import { cn } from '@/lib/utils'

/**
 * The printable paper surface — one definition, used by every document.
 *
 * The CV templates, the cover-letter preview, and the landing hero's product
 * shot each declared their own version of this: three near-identical class
 * strings for `bg-white`, an ink colour, a hairline ring, and a shadow. They had
 * already drifted (different shadow steps, one carrying `shadow-2xl`, which is
 * not in DESIGN.md's documented xs–xl scale), and any change to how a document
 * looks on screen had to be made in three places to stay consistent.
 *
 * Deliberately theme-INVARIANT primitive tokens rather than semantic roles: a CV
 * is a document that gets printed and emailed, so it must look identical whether
 * the app is in light or dark mode. This is the one place in the product where
 * bypassing the semantic layer is correct, and it is bypassed here so no call
 * site has to decide that for itself.
 *
 * `print-sheet` scopes the browser print/PDF export — see the @media print block
 * in globals.css, which also forces background colours to survive printing.
 */
/**
 * `wrap-anywhere` is load-bearing, not tidying.
 *
 * Everything on a sheet is text the user typed, and one unbroken token — a long
 * URL in the website field, a German compound job title, a pasted tracking link
 * — pushes past the paper edge and prints clipped. `overflow-wrap` inherits, so
 * declaring it on the surface covers every field in all three CV templates and
 * the cover letter at once. `anywhere` rather than `break-word` because only
 * `anywhere` is counted in min-content sizing, which is what stops the Designer
 * template's two-column grid being sized by its longest word.
 *
 * This is the artifact the candidate sends to a recruiter. It does not get to
 * overflow.
 */
export const SHEET_SURFACE =
  'bg-white text-[var(--neutral-900)] ring-1 ring-[var(--neutral-200)] wrap-anywhere'

/** Ink and hairline tokens for content rendered ON the sheet. */
export const SHEET_INK = {
  heading: 'text-[var(--neutral-900)]',
  body: 'text-[var(--neutral-700)]',
  muted: 'text-[var(--neutral-500)]',
  accent: 'text-[var(--brand-700)]',
  hairline: 'border-[var(--neutral-200)]',
  chip: 'bg-[var(--neutral-100)] text-[var(--neutral-700)]',
} as const

export function DocumentSheet({
  children,
  className,
  /** Omit the default padding when a template manages its own (e.g. a sidebar). */
  padded = true,
}: {
  children: React.ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <div
      className={cn(
        'print-sheet mx-auto w-full max-w-[46rem] rounded-lg shadow-lg',
        SHEET_SURFACE,
        padded && 'p-8 sm:p-10',
        className,
      )}
    >
      {children}
    </div>
  )
}
