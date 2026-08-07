import { z } from 'zod'

/**
 * Length caps for every free-text field on the CV.
 *
 * These exist because the editor autosaves the whole document into localStorage
 * on every keystroke. Unbounded, one pasted page of text is a quota failure, and
 * an unbounded `skills` array is one chip per entry rendered straight into the
 * DOM — the two ways this screen can be made to fall over without anyone doing
 * anything malicious.
 *
 * They are deliberately generous: a 2,000-character summary is already three
 * times longer than a summary should be, so no honest CV meets the wall.
 * Exported so the inputs can carry the same numbers as `maxLength` — the field
 * stops accepting text at the cap, rather than letting someone type a paragraph
 * that validation then rejects underneath them.
 */
export const RESUME_LIMITS = {
  fullName: 100,
  headline: 140,
  /** RFC 5321's maximum forward-path length. */
  email: 254,
  phone: 40,
  location: 120,
  website: 300,
  summary: 2000,
  role: 140,
  company: 140,
  period: 60,
  highlights: 2000,
  skill: 60,
  skills: 60,
  evidence: 20000,
  evidenceItems: 100,
  experience: 25,
} as const

const capped = (max: number) => z.string().max(max, `Keep this under ${max} characters`)

export const experienceSchema = z.object({
  id: z.string(),
  role: capped(RESUME_LIMITS.role).min(1, 'Role is required'),
  company: capped(RESUME_LIMITS.company).min(1, 'Company is required'),
  period: capped(RESUME_LIMITS.period),
  /** One highlight per line; rendered as bullet points in the preview. */
  highlights: capped(RESUME_LIMITS.highlights),
})

export const resumeSchema = z.object({
  fullName: capped(RESUME_LIMITS.fullName).min(1, 'Your name is required'),
  headline: capped(RESUME_LIMITS.headline).min(1, 'A headline helps recruiters place you'),
  // `z.email()`, not the deprecated `z.string().email()` (zod 4).
  email: z.email('Enter a valid email').max(RESUME_LIMITS.email).or(z.literal('')),
  phone: capped(RESUME_LIMITS.phone),
  location: capped(RESUME_LIMITS.location),
  website: capped(RESUME_LIMITS.website),
  summary: capped(RESUME_LIMITS.summary),
  experience: z.array(experienceSchema).max(RESUME_LIMITS.experience),
  skills: z.array(capped(RESUME_LIMITS.skill)).max(RESUME_LIMITS.skills),
  education: z.array(capped(RESUME_LIMITS.evidence)).max(RESUME_LIMITS.evidenceItems),
  projects: z.array(capped(RESUME_LIMITS.evidence)).max(RESUME_LIMITS.evidenceItems),
  achievements: z.array(capped(RESUME_LIMITS.evidence)).max(RESUME_LIMITS.evidenceItems),
})

export type ResumeData = z.infer<typeof resumeSchema>
export type ExperienceItem = z.infer<typeof experienceSchema>

/**
 * Trim a stored document down to the caps above.
 *
 * Validation on load must never be able to throw a CV away. `resumeStorage`
 * discards anything that fails `safeParse`, so introducing length rules without
 * this would mean a draft written before the caps existed — someone's actual
 * employment history — silently vanishing on their next visit. Clamping first
 * makes the worst case a trimmed field the user can see and fix, instead of a
 * blank editor and no explanation.
 */
export function clampResume(input: unknown): unknown {
  if (!input || typeof input !== 'object') return input
  const raw = input as Record<string, unknown>
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : v)

  return {
    ...raw,
    fullName: str(raw.fullName, RESUME_LIMITS.fullName),
    headline: str(raw.headline, RESUME_LIMITS.headline),
    email: str(raw.email, RESUME_LIMITS.email),
    phone: str(raw.phone, RESUME_LIMITS.phone),
    location: str(raw.location, RESUME_LIMITS.location),
    website: str(raw.website, RESUME_LIMITS.website),
    summary: str(raw.summary, RESUME_LIMITS.summary),
    experience: Array.isArray(raw.experience)
      ? raw.experience.slice(0, RESUME_LIMITS.experience).map((item) => {
          if (!item || typeof item !== 'object') return item
          const exp = item as Record<string, unknown>
          return {
            ...exp,
            role: str(exp.role, RESUME_LIMITS.role),
            company: str(exp.company, RESUME_LIMITS.company),
            period: str(exp.period, RESUME_LIMITS.period),
            highlights: str(exp.highlights, RESUME_LIMITS.highlights),
          }
        })
      : raw.experience,
    skills: Array.isArray(raw.skills)
      ? raw.skills.slice(0, RESUME_LIMITS.skills).map((s) => str(s, RESUME_LIMITS.skill))
      : raw.skills,
    education: Array.isArray(raw.education)
      ? raw.education.slice(0, RESUME_LIMITS.evidenceItems).map((item) => str(item, RESUME_LIMITS.evidence))
      : [],
    projects: Array.isArray(raw.projects)
      ? raw.projects.slice(0, RESUME_LIMITS.evidenceItems).map((item) => str(item, RESUME_LIMITS.evidence))
      : [],
    achievements: Array.isArray(raw.achievements)
      ? raw.achievements.slice(0, RESUME_LIMITS.evidenceItems).map((item) => str(item, RESUME_LIMITS.evidence))
      : [],
  }
}
