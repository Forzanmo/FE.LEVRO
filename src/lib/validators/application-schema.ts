import { z } from 'zod'

import { APPLICATION_STATUSES } from '@/features/applications/status'

/** Same reasoning as RESUME_LIMITS — every row is persisted and rendered. */
export const APPLICATION_LIMITS = {
  company: 140,
  role: 140,
  location: 120,
  source: 80,
} as const

const capped = (max: number) => z.string().max(max, `Keep this under ${max} characters`)

export const applicationFormSchema = z.object({
  applicationType: z.enum(['job', 'internship', 'scholarship']),
  company: capped(APPLICATION_LIMITS.company).min(1, 'Company is required'),
  role: capped(APPLICATION_LIMITS.role).min(1, 'Role is required'),
  status: z.enum(APPLICATION_STATUSES),
  location: capped(APPLICATION_LIMITS.location),
  source: capped(APPLICATION_LIMITS.source),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>
