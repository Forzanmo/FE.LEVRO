import { z } from 'zod'

import { APPLICATION_STATUSES } from '@/features/applications/status'

export const applicationFormSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(APPLICATION_STATUSES),
  location: z.string(),
  source: z.string(),
})

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>
