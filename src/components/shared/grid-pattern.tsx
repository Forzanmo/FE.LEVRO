import { cn } from '@/lib/utils'

export interface GridPatternProps {
  variant?: 'grid' | 'dots'
  /** Cell size in px. */
  size?: number
  /** Radial-fade the pattern toward the edges. */
  fade?: boolean
  className?: string
}

// Very faint line/dot ink that flips with the theme (foreground is themed).
const INK = 'color-mix(in oklab, var(--foreground) 7%, transparent)'
const FADE_MASK = 'radial-gradient(ellipse at center, black 30%, transparent 75%)'

/**
 * Decorative background texture — pure CSS (no SVG id, no dependency, server-safe)
 * so it works anywhere and stays cheap. Sits behind content; purely decorative.
 */
export function GridPattern({
  variant = 'grid',
  size = 32,
  fade = true,
  className,
}: GridPatternProps) {
  const backgroundImage =
    variant === 'dots'
      ? `radial-gradient(${INK} 1px, transparent 1.5px)`
      : `linear-gradient(to right, ${INK} 1px, transparent 1px), linear-gradient(to bottom, ${INK} 1px, transparent 1px)`

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 -z-10', className)}
      style={{
        backgroundImage,
        backgroundSize: `${size}px ${size}px`,
        maskImage: fade ? FADE_MASK : undefined,
        WebkitMaskImage: fade ? FADE_MASK : undefined,
      }}
    />
  )
}
