import { z } from 'zod'

import { COVER_LETTER_TONE_VALUES } from '@/features/cover-letter/types'

/** Same reasoning as RESUME_LIMITS — this text is persisted and rendered. */
export const COVER_LETTER_LIMITS = {
  company: 140,
  role: 140,
  hiringManager: 100,
  highlights: 2000,
} as const

const capped = (max: number) => z.string().max(max, `Keep this under ${max} characters`)

export const coverLetterSchema = z.object({
  company: capped(COVER_LETTER_LIMITS.company).min(1, 'Company is required'),
  role: capped(COVER_LETTER_LIMITS.role).min(1, 'Role is required'),
  hiringManager: capped(COVER_LETTER_LIMITS.hiringManager),
  tone: z.enum(COVER_LETTER_TONE_VALUES),
  highlights: capped(COVER_LETTER_LIMITS.highlights),
})

export type CoverLetterFormValues = z.infer<typeof coverLetterSchema>
