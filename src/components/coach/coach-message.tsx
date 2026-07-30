'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

import { CoachAvatar } from './coach-avatar'

/**
 * A coach turn. The current question is `emphasized`; earlier questions render
 * quieter. The "Why I'm asking" disclosure uses a grid-rows expand (no height
 * animation) and a tinted block — never a side-stripe accent.
 */
export function CoachMessage({
  prompt,
  reasoning,
  emphasized = false,
}: {
  prompt: string
  reasoning?: string
  emphasized?: boolean
}) {
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="flex items-start gap-3"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <CoachAvatar />
      <div className="min-w-0 flex-1 space-y-1.5 pt-0.5">
        <span className="text-muted-foreground text-xs font-medium">Levvro coach</span>
        {/*
         * The CURRENT question renders as a real <h2>, not a styled <p>. It is
         * the single most important thing on the screen, and as a paragraph it
         * was unreachable by screen-reader heading navigation — so a user could
         * not jump to "what am I being asked right now" on the product's core
         * surface. History stays a <p>: only one question is ever current.
         */}
        {emphasized ? (
          <h2 className="font-heading text-xl leading-snug font-semibold tracking-tight text-pretty">
            {prompt}
          </h2>
        ) : (
          <p className="text-foreground/90 text-base text-pretty">{prompt}</p>
        )}

        {reasoning ? (
          <div>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              /*
               * `after:` expands the tap target without changing layout — the
               * same pattern the Switch uses for its 18px track. The visible
               * control is 16px tall, which is under the 24px touch floor, and
               * this is the disclosure carrying the product's entire
               * evidence-over-assertion promise on its core surface. `relative`
               * is required for the absolutely-positioned pseudo-element.
               */
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring relative inline-flex items-center gap-1 rounded text-xs font-medium transition-colors outline-none after:absolute after:-inset-x-2 after:-inset-y-2.5 focus-visible:ring-2"
            >
              <Icon
                name="chevron-down"
                size="xs"
                className={cn('transition-transform duration-200', open && 'rotate-180')}
              />
              Why I&rsquo;m asking
            </button>
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-[var(--ease-emphasized)]',
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                {/* `max-w-[68ch]`: this measured 89 characters per line, against
                    DESIGN.md's own 65–75ch cap for prose. It is the one block of
                    running text in the assessment, read by someone deciding
                    whether to trust the question. */}
                <p className="text-muted-foreground bg-muted/60 mt-1.5 max-w-[68ch] rounded-lg px-3 py-2 text-sm">
                  {reasoning}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
