import { cn } from '@/lib/utils'

/**
 * Ambient background for the authenticated product surface — a restrained,
 * CSS-only counterpart to the marketing `AuroraBackdrop`. Two faint brand glows
 * (cool teal + warm gold) drift over a whisper of a top wash, so no screen is
 * ever a flat block of colour — yet it stays quiet enough to disappear behind
 * dense content (product-register restraint, not a marketing centrepiece).
 *
 * `fixed` so it holds while content scrolls; server-rendered (no WebGL, so the
 * app stays light); decorative (`aria-hidden`); theme-aware via gradient tokens;
 * and frozen under `prefers-reduced-motion` by the global rule in globals.css.
 * Reuses the existing `aurora-drift-*` keyframes.
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
            'linear-gradient(180deg, color-mix(in oklab, var(--brand) 7%, transparent) 0%, transparent 100%)',
        }}
      />
      {/* Cool brand glow, upper-right. */}
      <div
        className="absolute -top-40 right-[-10rem] h-[38rem] w-[38rem] rounded-full opacity-[0.07] blur-3xl dark:opacity-20"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--gradient-from) 70%, transparent), transparent 68%)',
          animation: 'aurora-drift-b 46s ease-in-out infinite',
        }}
      />
      {/* Warm achievement glow, lower-left — the gold accent, very faint. */}
      <div
        className="absolute bottom-[-12rem] left-[-8rem] h-[34rem] w-[34rem] rounded-full opacity-[0.06] blur-3xl dark:opacity-[0.14]"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--gradient-to) 70%, transparent), transparent 68%)',
          animation: 'aurora-drift-c 56s ease-in-out infinite',
        }}
      />
    </div>
  )
}
