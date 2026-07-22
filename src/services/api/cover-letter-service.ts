import type { CoverLetter, CoverLetterInput, CoverLetterTone } from '@/features/cover-letter/types'

/**
 * Cover letter service. The letter is generated (spec §8: "generated only"),
 * not hand-edited. This mock composes a believable letter from the inputs; a
 * real implementation would call the generation endpoint with the same shape.
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
  generate(input: CoverLetterInput, applicantName: string): Promise<CoverLetter> {
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

    const evidence =
      highlights.length > 0
        ? `A few things I would bring: ${highlights.join('; ')}. I care about shipping accessible, high-performance interfaces and owning a problem end to end.`
        : `In my recent work I have shipped production features, improved performance, and raised the accessibility bar on the products I have touched — always owning the problem end to end.`

    const fit = `What draws me to ${company} specifically is the chance to do that work with a team that clearly sweats the details. I move quickly, communicate clearly, and turn feedback into progress.`

    return delay({
      greeting,
      paragraphs: [intro, evidence, fit, CLOSERS[input.tone]],
      signoff: 'Sincerely,',
      name: applicantName,
    })
  },
}
