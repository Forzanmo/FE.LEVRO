'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { ProgressRing } from '@/components/shared/progress-ring'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'

const TIPS = [
  'Most junior candidates underestimate how much they already have to show.',
  'Recruiters skim for evidence in about six seconds — we’ll help you surface it.',
  'A skill you can’t point to on paper reads as a skill you don’t have.',
  'Specifics beat adjectives. One number outweighs three strong words.',
  'Every answer you gave is shaping a CV that’s actually yours.',
]

// Spec allows up to 30s; kept demo-friendly here.
const DURATION_MS = 6000
const TIP_INTERVAL_MS = 2800

/**
 * Post-assessment processing state with rotating, honest tips.
 *
 * This used to say "Drafting your CV" and hand off to the editor. That framing
 * skipped the thing the user was actually promised: the landing page sells "See
 * what your CV proves", the user answers eight questions, and the payoff is the
 * skills read-out — not a text form. The CV draft is the step *after* seeing
 * where you stand, which is also the order PRODUCT.md describes.
 */
export function ProcessingScreen({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion()
  const [tip, setTip] = useState(0)
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const tipTimer = setInterval(() => setTip((t) => (t + 1) % TIPS.length), TIP_INTERVAL_MS)
    const doneTimer = setTimeout(() => setDone(true), reduceMotion ? 0 : DURATION_MS)
    // The ring sweeps rather than sitting at a fixed value: a parked arc under
    // a "building…" heading reads as a result rather than as progress.
    const started = performance.now()
    const progressTimer = setInterval(() => {
      const elapsed = performance.now() - started
      setProgress(Math.min(100, (elapsed / DURATION_MS) * 100))
    }, 80)
    return () => {
      clearInterval(tipTimer)
      clearTimeout(doneTimer)
      clearInterval(progressTimer)
    }
  }, [reduceMotion])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 text-center">
      <ProgressRing
        value={done ? 100 : progress}
        size={128}
        strokeWidth={11}
        label="Reading your answers"
      >
        <Icon
          name={done ? 'success' : 'sparkles'}
          size="lg"
          tone="brand"
          variant={done ? 'filled' : 'outline'}
        />
      </ProgressRing>

      {/*
       * Without a live region the heading silently flips to "Your results are
       * ready" and the button un-disables, announcing nothing — a screen-reader
       * user waits indefinitely for a state that already changed.
       */}
      <div className="space-y-2" aria-live="polite" aria-atomic="true">
        <Heading level={2} size="2xl">
          {done ? 'Your results are ready' : 'Reading your answers…'}
        </Heading>
        <div className="flex h-10 items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={done ? 'done' : tip}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Text tone="muted">
                {done
                  ? 'Which skills your CV proves, which it doesn’t, and why — all from your answers.'
                  : TIPS[tip]}
              </Text>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <Button
        variant="gradient"
        size="lg"
        onClick={onComplete}
        disabled={!done}
        isLoading={!done}
        rightIcon={done ? <Icon name="arrow-right" size="sm" /> : undefined}
      >
        {done ? 'See where I stand' : 'Reading…'}
      </Button>
    </div>
  )
}
