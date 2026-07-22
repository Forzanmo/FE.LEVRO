import { z } from 'zod'

import { COVER_LETTER_TONE_VALUES } from '@/features/cover-letter/types'

export const coverLetterSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  hiringManager: z.string(),
  tone: z.enum(COVER_LETTER_TONE_VALUES),
  highlights: z.string(),
})

export type CoverLetterFormValues = z.infer<typeof coverLetterSchema>
