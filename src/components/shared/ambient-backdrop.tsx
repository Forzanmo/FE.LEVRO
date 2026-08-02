import { cn } from '@/lib/utils'

/**
 * Ambient background for the authenticated product surface — the restrained
 * counterpart to the marketing `BrandBackdrop`. Same two ingredients, both
 * turned down: a whisper of navy at the top so the header region lifts off a
 * flat surface, and the chevron field at roughly half the marketing alpha.
 *
 * It does NOT drift, anywhere. The marketing page gets one slow rise because a
 * visitor is being told a story; a person editing their CV is not, and ambient
 * motion under dense working content is distraction dressed as craft. That is
 * the product/brand register split, made literal in one property.
 *
 * The two drifting blobs this used to draw — a teal glow upper-right and a gold
 * one lower-left — went with the gold half of the old palette. They also
 * referenced `aurora-drift-*` keyframes that no longer exist.
 *
 * `fixed` so it holds while content scrolls; server-rendered (no WebGL, so the
 * app stays light); decorative (`aria-hidden`); theme-aware via tokens.
 */
export function AmbientBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)}
    >
      {/* Gentle top wash so the header region lifts off the flat surface. */}
      <div
        className="absolute inset-x-0 top-0 h-[34rem]"
        style={{
          backgroundImage:
            'linear-gradient(180deg, color-mix(in oklab, var(--brand) 6%, transparent) 0%, transparent 100%)',
        }}
      />
      {/* The chevron field, quiet enough to disappear behind dense content. */}
      <div className="chevron-field absolute inset-0 text-[var(--brand-900)] opacity-[0.028] dark:text-white dark:opacity-[0.035]" />
    </div>
  )
}
