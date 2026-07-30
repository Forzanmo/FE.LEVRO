'use client'

import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { useReducedMotion } from 'motion/react'

import { coachService } from '@/services/api/coach-service'
import { coachStorage } from '@/services/storage/coach-storage'
import { journeyStorage } from '@/services/storage/journey-storage'

import type { AnswerValue, CoachAnswer, CoachQuestion } from './types'

export type CoachPhase = 'typing' | 'awaiting' | 'complete'

interface CoachState {
  index: number
  answers: Record<string, CoachAnswer>
  phase: CoachPhase
}

type CoachAction =
  | { type: 'REVEAL' }
  | { type: 'ANSWER'; value: AnswerValue }
  | { type: 'SKIP' }
  | { type: 'BACK' }
  | { type: 'EDIT'; index: number }
  | { type: 'RESTART' }
  | { type: 'RESUME'; index: number; answers: Record<string, CoachAnswer> }

const TYPING_MS = 750

function makeReducer(questions: CoachQuestion[]) {
  const total = questions.length

  const record = (state: CoachState, answer: CoachAnswer): CoachState => {
    const answers = { ...state.answers, [answer.questionId]: answer }
    const next = state.index + 1
    if (next >= total) return { ...state, answers, phase: 'complete' }
    // Re-visiting an already-answered question skips the "typing" beat.
    const nextAnswered = Boolean(answers[questions[next].id])
    return { index: next, answers, phase: nextAnswered ? 'awaiting' : 'typing' }
  }

  return (state: CoachState, action: CoachAction): CoachState => {
    switch (action.type) {
      case 'REVEAL':
        return state.phase === 'typing' ? { ...state, phase: 'awaiting' } : state
      case 'ANSWER':
        return record(state, { questionId: questions[state.index].id, value: action.value })
      case 'SKIP':
        return record(state, {
          questionId: questions[state.index].id,
          value: '',
          skipped: true,
        })
      case 'BACK':
        return state.index === 0 ? state : { ...state, index: state.index - 1, phase: 'awaiting' }
      case 'EDIT':
        return { ...state, index: action.index, phase: 'awaiting' }
      case 'RESTART':
        return { index: 0, answers: {}, phase: 'typing' }
      case 'RESUME':
        return {
          index: action.index,
          answers: action.answers,
          // A resumed question is already written, so skip the "typing" beat.
          phase: 'awaiting',
        }
      default:
        return state
    }
  }
}

export interface UseCoach {
  intro: string
  questions: CoachQuestion[]
  current: CoachQuestion | undefined
  answers: Record<string, CoachAnswer>
  phase: CoachPhase
  index: number
  total: number
  answeredCount: number
  submit: (value: AnswerValue) => void
  skip: () => void
  back: () => void
  editAt: (index: number) => void
  restart: () => void
  /** False until persisted state has been read; the view waits on this. */
  hydrated: boolean
  /** A saved session was found and has not yet been resumed or discarded. */
  resumable: boolean
  resume: () => void
  discardSaved: () => void
  /** False once a write has failed — the view must stop promising "Save & exit". */
  persisted: boolean
}

export function useCoach(): UseCoach {
  const { intro, questions } = useMemo(() => coachService.getAssessment(), [])
  const reducer = useMemo(() => makeReducer(questions), [questions])
  const reduceMotion = useReducedMotion()

  const [state, dispatch] = useReducer(reducer, { index: 0, answers: {}, phase: 'typing' })

  const questionIds = useMemo(() => questions.map((q) => q.id), [questions])

  /*
   * Saved work is offered, never silently applied. Dropping a returning user
   * back into question 5 with no explanation is its own kind of disorientation;
   * they get to choose resume or start over. Read once on mount — reading in the
   * reducer initialiser would run during SSR, where localStorage does not exist.
   */
  const [saved, setSaved] = useState<{
    index: number
    answers: Record<string, CoachAnswer>
  } | null>(null)
  const [resolved, setResolved] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [persisted, setPersisted] = useState(true)

  useEffect(() => {
    /*
     * Deferred a frame rather than set synchronously in the effect body: a sync
     * setState here cascades an extra render. `hydrated` gates the view until
     * this resolves, so a returning user never sees question 1 flash past
     * before the resume prompt replaces it.
     */
    const id = requestAnimationFrame(() => {
      const found = coachStorage.load(questionIds)
      if (found && Object.keys(found.answers).length > 0) {
        setSaved({ index: found.index, answers: found.answers })
      } else {
        setResolved(true)
      }
      setHydrated(true)
    })
    return () => cancelAnimationFrame(id)
  }, [questionIds])

  // Persist every change. The assessment is long and users leave mid-flow.
  useEffect(() => {
    if (state.phase === 'complete') {
      coachStorage.clear()
      journeyStorage.markAssessmentComplete()
      return
    }
    if (Object.keys(state.answers).length === 0) return

    // "Save & exit" is rendered next to this. If the write fails the button is
    // lying, so the failure has to reach the UI rather than stop here.
    if (coachStorage.save({ index: state.index, answers: state.answers, questionIds })) return

    // Deferred a frame, like the hydration read above: the happy path pays
    // nothing, and the failure path avoids a synchronous cascading render.
    const id = requestAnimationFrame(() => setPersisted(false))
    return () => cancelAnimationFrame(id)
  }, [state.index, state.answers, state.phase, questionIds])

  // Simulate the coach composing before each new question is revealed.
  useEffect(() => {
    if (state.phase !== 'typing') return
    const delay = reduceMotion ? 0 : TYPING_MS
    const timer = setTimeout(() => dispatch({ type: 'REVEAL' }), delay)
    return () => clearTimeout(timer)
  }, [state.phase, state.index, reduceMotion])

  const answeredCount = Object.values(state.answers).filter((a) => !a.skipped).length

  const resume = useCallback(() => {
    if (!saved) return
    dispatch({ type: 'RESUME', index: saved.index, answers: saved.answers })
    setSaved(null)
    setResolved(true)
  }, [saved])

  const discardSaved = useCallback(() => {
    coachStorage.clear()
    setSaved(null)
    setResolved(true)
    dispatch({ type: 'RESTART' })
  }, [])

  return {
    intro,
    questions,
    current: questions[state.index],
    answers: state.answers,
    phase: state.phase,
    index: state.index,
    total: questions.length,
    answeredCount,
    submit: (value) => dispatch({ type: 'ANSWER', value }),
    skip: () => dispatch({ type: 'SKIP' }),
    back: () => dispatch({ type: 'BACK' }),
    editAt: (index) => dispatch({ type: 'EDIT', index }),
    restart: () => {
      coachStorage.clear()
      dispatch({ type: 'RESTART' })
    },
    hydrated,
    persisted,
    resumable: saved !== null && !resolved,
    resume,
    discardSaved,
  }
}
