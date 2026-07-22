'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { ProgressRing } from '@/components/shared/progress-ring'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'

const TIPS = [
  'Most junior candidates underestimate how ready they already are.',
  'The biggest score gains usually come from interview practice, not more projects.',
  'Recruiters skim for evidence in about six seconds — we’ll help you surface it.',
  'Clarity beats perfection. A focused plan gets you interviewing sooner.',
  'Every answer you gave is shaping a plan that’s actually yours.',
]

// Spec allows up to 30s; kept demo-friendly here.
const DURATION_MS = 6000
const TIP_INTERVAL_MS = 2800

/** Post-assessment "generating your score" state with rotating, honest tips. */
export function ProcessingScreen({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion()
  const [tip, setTip] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const tipTimer = setInterval(() => setTip((t) => (t + 1) % TIPS.length), TIP_INTERVAL_MS)
    const doneTimer = setTimeout(() => setDone(true), reduceMotion ? 0 : DURATION_MS)
    return () => {
      clearInterval(tipTimer)
      clearTimeout(doneTimer)
    }
  }, [reduceMotion])

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 text-center">
      <ProgressRing value={done ? 100 : 72} size={128} strokeWidth={11} label="Building your score">
        <Icon
          name={done ? 'success' : 'sparkles'}
          size="lg"
          tone="brand"
          variant={done ? 'filled' : 'outline'}
        />
      </ProgressRing>

      <div className="space-y-2">
        <Heading level={2} size="2xl">
          {done ? 'Your score is ready' : 'Building your Career Score…'}
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
                {done ? 'Analysis complete — evidence-checked, no guesses.' : TIPS[tip]}
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
        {done ? 'View my score' : 'Analyzing…'}
      </Button>
    </div>
  )
}
