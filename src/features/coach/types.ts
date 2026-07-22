export type QuestionType = 'text' | 'single' | 'multi'

export interface QuestionOption {
  value: string
  label: string
}

export interface CoachQuestion {
  id: string
  type: QuestionType
  prompt: string
  /** Evidence-driven: why this question matters. Always shown on demand. */
  reasoning: string
  placeholder?: string
  options?: QuestionOption[]
  /** Whether the user may skip this question. */
  optional?: boolean
}

export type AnswerValue = string | string[]

export interface CoachAnswer {
  questionId: string
  value: AnswerValue
  skipped?: boolean
}

export interface Assessment {
  intro: string
  questions: CoachQuestion[]
}
