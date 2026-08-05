'use client'

import { useEffect, useMemo, useReducer } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useReducedMotion } from 'motion/react'
import { toast } from 'sonner'

import { coachService, type CoachSession } from '@/services/api/coach-service'

import type { AnswerValue, CoachAnswer, CoachQuestion } from './types'

export type CoachPhase = 'typing' | 'awaiting' | 'complete'

interface CoachState {
  index: number
  answers: Record<string, CoachAnswer>
  phase: CoachPhase
}

type CoachAction =
  | { type: 'HYDRATE'; answers: Record<string, CoachAnswer>; completed: boolean }
  | { type: 'REVEAL' }
  | { type: 'ANSWER'; answer: CoachAnswer }
  | { type: 'BACK' }
  | { type: 'EDIT'; index: number }
  | { type: 'RESTART' }

const TYPING_MS = 750
const coachKey = ['coach-assessment'] as const

function makeReducer(questions: CoachQuestion[]) {
  const total = questions.length
  return (state: CoachState, action: CoachAction): CoachState => {
    switch (action.type) {
      case 'HYDRATE': {
        const firstUnanswered = questions.findIndex((question) => !action.answers[question.id])
        return {
          answers: action.answers,
          index: firstUnanswered < 0 ? Math.max(0, total - 1) : firstUnanswered,
          phase: action.completed || (total > 0 && firstUnanswered < 0) ? 'complete' : 'typing',
        }
      }
      case 'REVEAL':
        return state.phase === 'typing' ? { ...state, phase: 'awaiting' } : state
      case 'ANSWER': {
        const answers = { ...state.answers, [action.answer.questionId]: action.answer }
        const next = state.index + 1
        if (next >= total) return { ...state, answers, phase: 'complete' }
        return {
          index: next,
          answers,
          phase: answers[questions[next].id] ? 'awaiting' : 'typing',
        }
      }
      case 'BACK':
        return state.index === 0 ? state : { ...state, index: state.index - 1, phase: 'awaiting' }
      case 'EDIT':
        return { ...state, index: action.index, phase: 'awaiting' }
      case 'RESTART':
        return { index: 0, answers: {}, phase: 'typing' }
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
  isLoading: boolean
  isError: boolean
  isSaving: boolean
  retry: () => void
  hydrated: boolean
  resumable: boolean
  persisted: boolean
  resume: () => void
  discardSaved: () => void
}

export function useCoach(): UseCoach {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: coachKey, queryFn: () => coachService.getAssessment() })
  const questions = useMemo(() => query.data?.questions ?? [], [query.data?.questions])
  const intro = query.data?.intro ?? ''
  const reducer = useMemo(() => makeReducer(questions), [questions])
  const [state, dispatch] = useReducer(reducer, { index: 0, answers: {}, phase: 'typing' })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (query.data) {
      dispatch({
        type: 'HYDRATE',
        answers: query.data.answers,
        completed: Boolean(query.data.completedAt),
      })
    }
  }, [query.data])

  useEffect(() => {
    if (state.phase !== 'typing' || questions.length === 0) return
    const timer = setTimeout(
      () => dispatch({ type: 'REVEAL' }),
      reduceMotion ? 0 : TYPING_MS,
    )
    return () => clearTimeout(timer)
  }, [state.phase, state.index, reduceMotion, questions.length])

  const answerMutation = useMutation({
    mutationFn: ({ answer, revision }: { answer: CoachAnswer; revision: number }) =>
      coachService.saveAnswer(answer, revision),
    onSuccess: (session, variables) => {
      queryClient.setQueryData<CoachSession>(coachKey, session)
      dispatch({ type: 'ANSWER', answer: variables.answer })
    },
    onError: () => toast.error('Could not save your answer'),
  })
  const restartMutation = useMutation({
    mutationFn: () => coachService.restart(),
    onSuccess: (session) => {
      queryClient.setQueryData<CoachSession>(coachKey, session)
      dispatch({ type: 'RESTART' })
    },
    onError: () => toast.error('Could not restart the assessment'),
  })

  const persist = (answer: CoachAnswer) => {
    if (!query.data || answerMutation.isPending) return
    answerMutation.mutate({ answer, revision: query.data.revision })
  }

  return {
    intro,
    questions,
    current: questions[state.index],
    answers: state.answers,
    phase: state.phase,
    index: state.index,
    total: questions.length,
    answeredCount: Object.values(state.answers).filter((answer) => !answer.skipped).length,
    submit: (value) => {
      const question = questions[state.index]
      if (question) persist({ questionId: question.id, value })
    },
    skip: () => {
      const question = questions[state.index]
      if (question) persist({ questionId: question.id, value: '', skipped: true })
    },
    back: () => dispatch({ type: 'BACK' }),
    editAt: (index) => dispatch({ type: 'EDIT', index }),
    restart: () => restartMutation.mutate(),
    isLoading: query.isPending,
    isError: query.isError,
    isSaving: answerMutation.isPending || restartMutation.isPending,
    retry: () => void query.refetch(),
    hydrated: !query.isPending,
    resumable: false,
    persisted: !query.isError,
    resume: () => undefined,
    discardSaved: () => restartMutation.mutate(),
  }
}
