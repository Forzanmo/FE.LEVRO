import {
  getCoachApiV1ProductCoachGet,
  restartCoachApiV1ProductCoachDelete,
  saveCoachAnswerApiV1ProductCoachAnswerPut,
} from '@/api/generated'
import type { CoachAssessmentResponse } from '@/api/generated'
import type { Assessment, CoachAnswer } from '@/features/coach/types'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

export interface CoachSession extends Assessment {
  answers: Record<string, CoachAnswer>
  revision: number
  completedAt: string | null
}

export const COACH_QUESTION_COUNT = 13

function mapSession(data: CoachAssessmentResponse): CoachSession {
  return {
    intro: data.intro,
    questions: data.questions.map((question) => ({
      id: question.id,
      type: question.type,
      prompt: question.prompt,
      reasoning: question.reasoning,
      placeholder: question.placeholder ?? undefined,
      options: question.options ?? undefined,
      optional: question.optional,
    })),
    answers: Object.fromEntries(
      Object.entries(data.answers).map(([key, answer]) => [
        key,
        {
          questionId: answer.question_id,
          value: answer.value,
          skipped: answer.skipped,
        },
      ]),
    ),
    revision: data.revision,
    completedAt: data.completed_at,
  }
}

export const coachService = {
  async getAssessment(): Promise<CoachSession> {
    return mapSession(unwrapApiResult(await getCoachApiV1ProductCoachGet()))
  },

  async saveAnswer(answer: CoachAnswer, expectedRevision: number): Promise<CoachSession> {
    return mapSession(
      unwrapApiResult(
        await saveCoachAnswerApiV1ProductCoachAnswerPut({
          body: {
            question_id: answer.questionId,
            value: answer.value,
            skipped: answer.skipped,
            expected_revision: expectedRevision,
          },
        }),
      ),
    )
  },

  async restart(): Promise<CoachSession> {
    return mapSession(unwrapApiResult(await restartCoachApiV1ProductCoachDelete()))
  },
}
