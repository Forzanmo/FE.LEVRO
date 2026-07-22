'use client'

import { useEffect, useMemo, useReducer } from 'react'
import { useReducedMotion } from 'motion/react'

import { coachService } from '@/services/api/coach-service'

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
}

export function useCoach(): UseCoach {
  const { intro, questions } = useMemo(() => coachService.getAssessment(), [])
  const reducer = useMemo(() => makeReducer(questions), [questions])
  const reduceMotion = useReducedMotion()

  const [state, dispatch] = useReducer(reducer, { index: 0, answers: {}, phase: 'typing' })

  // Simulate the coach composing before each new question is revealed.
  useEffect(() => {
    if (state.phase !== 'typing') return
    const delay = reduceMotion ? 0 : TYPING_MS
    const timer = setTimeout(() => dispatch({ type: 'REVEAL' }), delay)
    return () => clearTimeout(timer)
  }, [state.phase, state.index, reduceMotion])

  const answeredCount = Object.values(state.answers).filter((a) => !a.skipped).length

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
    restart: () => dispatch({ type: 'RESTART' }),
  }
}
