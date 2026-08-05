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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/typography'
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

/**
 * Offered when a saved assessment is found. The user decides — being dropped
 * back into question 5 unannounced is disorienting in its own right, and
 * silently discarding the work is what this whole change exists to prevent.
 */
function ResumePrompt({ onResume, onRestart }: { onResume: () => void; onRestart: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-start gap-4 py-16">
      <div className="space-y-1.5">
        <h1 className="font-heading text-xl font-semibold tracking-normal">
          Pick up where you left off
        </h1>
        <p className="text-muted-foreground text-sm">
          Your answers from last time are saved. Nothing was lost.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onResume}>Continue assessment</Button>
        <Button variant="ghost" onClick={onRestart}>
          Start over
        </Button>
      </div>
    </div>
  )
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
    /*
     * To the dashboard, not the CV editor.
     *
     * This was `ROUTES.resume`, so the whole assessment and a six-second progress
     * ring ended in a text form — the peak-end moment of the whole product
     * spent on data entry. `journey-storage` argues in its own header that "the
     * end of the first session is what the whole session is remembered by", and
     * the dashboard already renders "Your plan is ready, {name}" with the
     * skills read-out as its hero for exactly this arrival.
     */
    return <ProcessingScreen onComplete={() => router.push(ROUTES.dashboard)} />
  }

  // Wait for persisted state before painting, so a returning user never sees
  // question 1 flash past before the resume prompt replaces it.
  if (!coach.hydrated) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-[50svh] items-center justify-center"
      >
        <span className="text-muted-foreground text-sm">Loading your assessment…</span>
      </div>
    )
  }

  if (coach.resumable) {
    return <ResumePrompt onResume={coach.resume} onRestart={coach.discardSaved} />
  }

  /*
   * Show every question the user has already answered, not just those before
   * the cursor. `slice(0, index)` meant that editing an earlier answer made
   * every later one vanish from the transcript — the answers were still in
   * state, but the user saw their work disappear and had no way to tell it was
   * still there.
   */
  const history = coach.questions
    .map((question, index) => ({ question, index }))
    .filter(({ question, index }) => index < coach.index || Boolean(coach.answers[question.id]))

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <div className="flex items-start justify-between gap-4 pb-4">
        <div className="min-w-0">
          {/*
             * `2xl`, not `text-lg`. This is the page title and it rendered at
             * 18px while the coach question inside it renders at 20px — the h1
             * was the third-largest thing on its own screen, and 1.67x smaller
             * than the h1 `PageHeader` gives every other route. Tracking goes
             * to normal because DESIGN.md relaxes it by 20px.
             */}
            <Heading level={1} size="2xl">
              Career assessment
            </Heading>
          <p className="text-muted-foreground text-sm">
            A few questions, then we draft your CV from your answers.
          </p>
        </div>
        {/* The label is true only while writes are landing. If storage is full
            or blocked, "Save & exit" would send the user away from work that is
            about to vanish, so it stops offering the exit and says why. */}
        {coach.persisted ? (
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.dashboard}>Save &amp; exit</Link>
          </Button>
        ) : (
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.dashboard}>Exit without saving</Link>
          </Button>
        )}
      </div>

      {!coach.persisted ? (
        <Alert variant="warning" className="mb-4">
          <AlertTitle>Your progress isn’t being saved</AlertTitle>
          <AlertDescription>
            Your browser is blocking storage or is out of space, so leaving this page will lose
            your answers. Finishing now still works — it’s only leaving and coming back that
            won’t.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="pb-8">
        <CoachProgress index={coach.index} total={coach.total} />
      </div>

      <div className="space-y-6" role="log" aria-live="polite" aria-label="Coaching conversation">
        <CoachMessage prompt={coach.intro} />

        {history.map(({ question, index }) => {
          const answer = coach.answers[question.id]
          return (
            <div key={question.id} className="space-y-3">
              <CoachMessage prompt={question.prompt} reasoning={question.reasoning} />
              {answer ? (
                <UserAnswer skipped={answer.skipped} onEdit={() => coach.editAt(index)}>
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
        // Opaque enough to be its own surface — the transcript scrolls under
        // this composer, so at /65 the answer controls composited over
        // arbitrary message content.
        <div className="bg-background/95 supports-[backdrop-filter]:bg-background/88 sticky bottom-[var(--bottom-nav-height)] z-[var(--z-docked)] mt-6 border-t py-4 backdrop-blur md:bottom-0">
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
