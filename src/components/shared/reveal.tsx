'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Scroll-reveal wrapper (Motion). Fades + rises its children into view once,
 * the first time they enter the viewport. Under `prefers-reduced-motion` it
 * renders the children plainly (already visible, no transform) so nothing is
 * ever gated behind an animation that won't run.
 *
 * Use for below-the-fold sections. Above-the-fold content should use the
 * CSS `animate-rise` utility instead, which never depends on JS.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: ReactNode
  className?: string
  /** Seconds to defer the entrance — use to stagger siblings. */
  delay?: number
  /** Rise distance in px. */
  y?: number
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
