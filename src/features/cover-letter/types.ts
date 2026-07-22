export const COVER_LETTER_TONE_VALUES = ['professional', 'warm', 'confident', 'concise'] as const

export type CoverLetterTone = (typeof COVER_LETTER_TONE_VALUES)[number]

export const COVER_LETTER_TONES: { value: CoverLetterTone; label: string }[] = [
  { value: 'professional', label: 'Professional' },
  { value: 'warm', label: 'Warm' },
  { value: 'confident', label: 'Confident' },
  { value: 'concise', label: 'Concise' },
]

export interface CoverLetterInput {
  company: string
  role: string
  hiringManager: string
  tone: CoverLetterTone
  highlights: string
}

export interface CoverLetter {
  greeting: string
  paragraphs: string[]
  signoff: string
  name: string
}
