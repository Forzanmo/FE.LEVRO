import type { CoverLetter, CoverLetterInput, CoverLetterTone } from '@/features/cover-letter/types'
import { journeyStorage } from '@/services/storage/journey-storage'

/**
 * Cover letter service. The letter is generated (spec §8: "generated only"),
 * not hand-edited. This mock composes a believable letter from the inputs; a
 * real implementation would call the generation endpoint with the same shape.
 *
 * **The assessment gate lives here, at the source.** `documents-service`,
 * `applications-service`, `dashboard-service` and `resume-service` all consult
 * `journeyStorage.hasAssessment()`; this one did not, and it was the single
 * worst place in the product to forget it. Without an assessment the generator
 * still produced a complete, confident, downloadable letter — "my background
 * maps closely to what the role needs", "I have followed the work your team
 * publishes" — signed with the user's name. That is the one artifact a candidate
 * emails to a real recruiter, and the product was inventing its contents.
 *
 * DESIGN.md records that the call-site version of this gate "shipped twice and
 * was forgotten five times". This was the sixth, and it is why the check is in
 * the service rather than in the view.
 */
const GENERATE_MS = 1200

const OPENERS: Record<CoverLetterTone, string> = {
  professional: 'I am writing to express my strong interest in',
  warm: 'I was genuinely excited to come across',
  confident: 'I am confident I am the right person for',
  concise: 'I am applying for',
}

const CLOSERS: Record<CoverLetterTone, string> = {
  professional:
    'I would welcome the opportunity to discuss how I can contribute to your team, and I have attached my resume for your review.',
  warm: 'I would love the chance to talk more about how I can help your team, and my resume is attached with the details.',
  confident:
    'I am ready to make an immediate impact, and I would welcome the chance to show you how. My resume is attached.',
  concise: 'My resume is attached. I would welcome a conversation.',
}

function delay<T>(value: T, ms = GENERATE_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

export const coverLetterService = {
  /** True when there is evidence to argue from. The view uses this to decide
   *  what to render; `generate()` enforces it regardless. */
  canGenerate(): boolean {
    return journeyStorage.hasAssessment()
  },

  generate(input: CoverLetterInput, applicantName: string): Promise<CoverLetter | null> {
    // Fail closed. A caller that forgets to check gets nothing, not a fabrication.
    if (!journeyStorage.hasAssessment()) return delay(null)

    const company = input.company.trim() || 'your company'
    const role = input.role.trim() || 'the role'
    const highlights = input.highlights
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    const greeting = input.hiringManager.trim()
      ? `Dear ${input.hiringManager.trim()},`
      : 'Dear Hiring Manager,'

    const intro = `${OPENERS[input.tone]} the ${role} position at ${company}. Your work is exactly the kind of problem I want to be solving, and my background maps closely to what the role needs.`

    /*
     * With no highlights the letter used to assert a work history on the user's
     * behalf — "I have shipped production features, improved performance…" —
     * inventing accomplishments and putting the user's name under them. The
     * fallback now says only what the user has actually told us, which is that
     * they want the role.
     */
    const evidence =
      highlights.length > 0
        ? `A few things I would bring: ${highlights.join('; ')}. I care about shipping accessible, high-performance interfaces and owning a problem end to end.`
        : `I have followed the work your team publishes, and the problems described in the posting are the ones I want to be spending my time on.`

    const fit = `What draws me to ${company} specifically is the chance to do that work with a team that clearly sweats the details. I move quickly, communicate clearly, and turn feedback into progress.`

    return delay({
      greeting,
      paragraphs: [intro, evidence, fit, CLOSERS[input.tone]],
      signoff: 'Sincerely,',
      name: applicantName,
    })
  },
}
