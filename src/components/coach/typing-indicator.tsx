'use client'

import { motion, useReducedMotion } from 'motion/react'

import { CoachAvatar } from './coach-avatar'

/** The coach "composing" state — three breathing dots. Announced politely. */
export function TypingIndicator() {
  const reduceMotion = useReducedMotion()

  return (
    // No `aria-label` on the container: it would override the sr-only text
    // below, leaving that span dead. One accessible name, from the content.
    <div className="flex items-center gap-3" role="status">
      <CoachAvatar />
      <span className="bg-muted flex items-center gap-1 rounded-full px-3 py-2.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="bg-muted-foreground/60 size-1.5 rounded-full"
            animate={reduceMotion ? undefined : { opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
            transition={
              reduceMotion
                ? undefined
                : { duration: 1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }
            }
          />
        ))}
      </span>
      <span className="sr-only">Coach is typing…</span>
    </div>
  )
}
