'use client'

import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Scroll-reveal wrapper (Motion). Rises its children into view once, the first
 * time they enter the viewport. Under `prefers-reduced-motion` it renders them
 * plainly, so nothing is ever gated behind an animation that won't run.
 *
 * TRANSFORM ONLY — opacity is never animated. Motion serializes `initial` into
 * the SSR output, so `initial={{ opacity: 0 }}` shipped HTML that was invisible
 * until JS hydrated: a script error, a slow bundle, or a headless renderer left
 * everything below the landing fold blank. The hero already avoids this via the
 * CSS-only `hero-rise` utility for exactly this reason (see globals.css); this
 * applies the same rule to the rest of the page. The content is legible from
 * the first frame and the motion is pure enhancement.
 *
 * Use for below-the-fold sections. Above-the-fold content should use the CSS
 * `animate-rise` utility instead, which never depends on JS at all.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  /** Seconds to defer the entrance — use to stagger siblings. */
  delay?: number
  /** Rise distance in px. */
  y?: number
  /**
   * Element to render. Defaults to `div`.
   *
   * Required inside content models that only accept specific children: a
   * wrapper `div` between `<ol>` and its `<li>`s, or between `<dl>` and its
   * `<dt>`/`<dd>` pairs, is invalid HTML and axe reports it as four serious
   * violations (`list`, `listitem`, `definition-list`, `dlitem`). Animation
   * must not cost the document its semantics — pass `as="li"` or wrap the
   * whole list instead.
   */
  as?: 'div' | 'li'
}) {
  const reduceMotion = useReducedMotion()
  const Static = as
  const Motion = as === 'li' ? motion.li : motion.div

  if (reduceMotion) return <Static className={className}>{children}</Static>

  return (
    <Motion
      className={className}
      initial={{ y }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion>
  )
}
