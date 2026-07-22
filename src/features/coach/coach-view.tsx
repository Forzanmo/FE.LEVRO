'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useReducedMotion } from 'motion/react'

import { CoachComposer } from '@/components/coach/coach-composer'
import { CoachMessage } from '@/components/coach/coach-message'
import { CoachProgress } from '@/components/coach/coach-progress'
import { ProcessingScreen } from '@/components/coach/processing-screen'
import { TypingIndicator } from '@/components/coach/typing-indicator'
import { UserAnswer } from '@/components/coach/user-answer'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/routes'

import type { CoachAnswer, CoachQuestion } from './types'
import { useCoach } from './use-coach'

/** Render an answer as human-readable text (option labels, not raw values). */
function formatAnswer(question: CoachQuestion, answer: CoachAnswer): string {
  if (Array.isArray(answer.value)) {
    return answer.value
      .map((v) => question.options?.find((o) => o.value === v)?.label ?? v)
      .join(', ')
  }
  if (question.type === 'single') {
    return question.options?.find((o) => o.value === answer.value)?.label ?? String(answer.value)
  }
  return String(answer.value)
}

export function CoachView() {
  const coach = useCoach()
  const router = useRouter()
  const endRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  // Keep the newest turn in view as the conversation advances — honoring the
  // user's reduced-motion preference like the rest of the app.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'end' })
  }, [coach.index, coach.phase, reduceMotion])

  if (coach.phase === 'complete') {
    return <ProcessingScreen onComplete={() => router.push(ROUTES.dashboard)} />
  }

  const history = coach.questions.slice(0, coach.index)

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <div className="flex items-start justify-between gap-4 pb-4">
        <div className="min-w-0">
          <h1 className="font-heading text-lg font-semibold tracking-tight">Career assessment</h1>
          <p className="text-muted-foreground text-sm">A few questions to build your score.</p>
        </div>
        <Button asChild variant="ghost" size="sm">
          <Link href={ROUTES.dashboard}>Save &amp; exit</Link>
        </Button>
      </div>

      <div className="pb-8">
        <CoachProgress index={coach.index} total={coach.total} />
      </div>

      <div className="space-y-6" role="log" aria-live="polite" aria-label="Coaching conversation">
        <CoachMessage prompt={coach.intro} />

        {history.map((question, i) => {
          const answer = coach.answers[question.id]
          return (
            <div key={question.id} className="space-y-3">
              <CoachMessage prompt={question.prompt} reasoning={question.reasoning} />
              {answer ? (
                <UserAnswer skipped={answer.skipped} onEdit={() => coach.editAt(i)}>
                  {formatAnswer(question, answer)}
                </UserAnswer>
              ) : null}
            </div>
          )
        })}

        {coach.phase === 'typing' ? <TypingIndicator /> : null}

        {coach.phase === 'awaiting' && coach.current ? (
          <CoachMessage
            prompt={coach.current.prompt}
            reasoning={coach.current.reasoning}
            emphasized
          />
        ) : null}

        <div ref={endRef} />
      </div>

      {coach.phase === 'awaiting' && coach.current ? (
        <div className="bg-background/85 supports-[backdrop-filter]:bg-background/65 sticky bottom-[var(--bottom-nav-height)] z-[var(--z-docked)] mt-6 border-t py-4 backdrop-blur md:bottom-0">
          <CoachComposer
            key={coach.current.id}
            question={coach.current}
            existing={coach.answers[coach.current.id]}
            canGoBack={coach.index > 0}
            onSubmit={coach.submit}
            onSkip={coach.skip}
            onBack={coach.back}
          />
        </div>
      ) : null}
    </div>
  )
}
