import { z } from 'zod'

export const experienceSchema = z.object({
  id: z.string(),
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  period: z.string(),
  /** One highlight per line; rendered as bullet points in the preview. */
  highlights: z.string(),
})

export const resumeSchema = z.object({
  fullName: z.string().min(1, 'Your name is required'),
  headline: z.string().min(1, 'A headline helps recruiters place you'),
  email: z.string().email('Enter a valid email').or(z.literal('')),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  summary: z.string(),
  experience: z.array(experienceSchema),
  skills: z.array(z.string()),
})

export type ResumeData = z.infer<typeof resumeSchema>
export type ExperienceItem = z.infer<typeof experienceSchema>
