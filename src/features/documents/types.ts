import type { CoverLetter } from '@/features/cover-letter/types'
import type { ResumeData } from '@/lib/validators/resume-schema'

export type DocumentKind = 'cv' | 'cover-letter'

export type DocumentStatus = 'draft' | 'ready' | 'sent'

export const CV_TEMPLATE_IDS = ['minimalist', 'designer', 'ats'] as const
export type CvTemplateId = (typeof CV_TEMPLATE_IDS)[number]

export interface CvTemplateMeta {
  id: CvTemplateId
  label: string
  /** One line on when to reach for it — the choice has real consequences. */
  description: string
  /** The trade-off, stated plainly rather than sold. */
  bestFor: string
}

/**
 * Three templates, three genuinely different jobs — not three skins.
 *
 * The honest framing matters here: a "designer" CV that gets shredded by an
 * applicant tracking system costs someone an interview, and most candidates
 * have no idea that happens. Each option says what it is good at AND what it
 * costs, so the choice is informed rather than aesthetic.
 */
export const CV_TEMPLATES: readonly CvTemplateMeta[] = [
  {
    id: 'minimalist',
    label: 'Minimalist',
    description: 'Quiet typographic hierarchy, generous space, nothing decorative.',
    bestFor: 'Most applications. Reads well to a human and parses cleanly.',
  },
  {
    id: 'designer',
    label: 'Designer',
    description: 'A two-column layout with a tinted sidebar for skills and contact.',
    bestFor: 'Portfolio-led and studio roles. Some older parsers mis-read columns.',
  },
  {
    id: 'ats',
    label: 'ATS',
    description: 'Single column, standard headings, no columns, tables or glyphs.',
    bestFor: 'Large employers and job boards that machine-screen before a human reads.',
  },
]

export interface DocumentSummary {
  id: string
  kind: DocumentKind
  /** "Frontend Engineer — Northwind" */
  title: string
  /** The role this document was tailored for. */
  role: string
  company?: string
  status: DocumentStatus
  updatedAt: string
  /** CVs only: the template this version was last rendered with. */
  template?: CvTemplateId
}

/** A summary plus the content needed to render the document. */
export interface DocumentRecord extends DocumentSummary {
  resume?: ResumeData
  coverLetter?: CoverLetter
}
