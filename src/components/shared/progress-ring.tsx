'use client'

import * as React from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

export interface ProgressRingProps {
  /** 0–100. */
  value: number
  size?: number
  strokeWidth?: number
  className?: string
  /** Accessible label for the meter. */
  label?: string
  /** Centre content (e.g. an icon or a numeric readout). */
  children?: React.ReactNode
}

/**
 * Circular progress meter. Animated once on mount (respecting reduced motion),
 * stroked in a value-warmed brand colour over a token-driven track.
 */
export function ProgressRing({
  value,
  size = 168,
  strokeWidth = 14,
  className,
  label = 'Progress',
  children,
}: ProgressRingProps) {
  const reduceMotion = useReducedMotion()
  const clamped = Math.max(0, Math.min(100, value))

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const targetOffset = circumference * (1 - clamped / 100)

  return (
    <div
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--progress-track)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          /*
           * A SOLID stroke whose colour is mixed from teal toward gold in
           * proportion to the score — so the whole ring warms as the number
           * rises, monotonically, by construction.
           *
           * Two gradient attempts failed here, and the reason is geometric: on
           * a circle, any straight ramp is non-monotonic in sweep angle. The
           * first ran corner-to-corner and rendered low scores entirely gold.
           * The second pinned the ramp to a diameter and mixed its far stop by
           * value — which fixed low scores but left the ramp's warm point at a
           * fixed 6 o'clock, so a 90 warmed to gold at the halfway mark and
           * then *cooled back to teal* at its leading edge. Measured, not
           * assumed: sampling the rendered arc at value 90 gave gold at 180°
           * and rgb(69,143,128) at 320°.
           *
           * DESIGN.md's Warming-Score Rule asks for a ring that reads as
           * progress and warmth and never judges. One colour that is a pure
           * function of the score satisfies that literally, cannot regress, and
           * reads more confidently at 132px than a three-stop ramp does.
           */
          stroke={`color-mix(in oklab, var(--gradient-to) ${Math.round(clamped)}%, var(--gradient-from))`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          // Soft brand glow so the progress arc reads luminous, not printed.
          style={{
            filter:
              'drop-shadow(0 0 5px color-mix(in oklab, var(--gradient-via) 45%, transparent))',
          }}
          initial={{ strokeDashoffset: reduceMotion ? targetOffset : circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.2, 0, 0, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}
