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
  /** Centre content (e.g. the numeric score). */
  children?: React.ReactNode
}

/**
 * Career-score progress ring. Animated once on mount (respecting reduced
 * motion) with a brand gradient stroke over a token-driven track.
 */
export function ProgressRing({
  value,
  size = 168,
  strokeWidth = 14,
  className,
  label = 'Progress',
  children,
}: ProgressRingProps) {
  const gradientId = React.useId()
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
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--gradient-from)" />
            <stop offset="50%" stopColor="var(--gradient-via)" />
            <stop offset="100%" stopColor="var(--gradient-to)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--score-track)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
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
