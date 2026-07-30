import { journeyStorage } from '@/services/storage/journey-storage'

import type { DocumentRecord, DocumentSummary } from '@/features/documents/types'

/**
 * Documents service. All CV / cover-letter reads flow through here, so swapping
 * the fixture for a real endpoint is a one-function change.
 *
 * Every read is gated on `journeyStorage.hasAssessment()`. Nothing here exists
 * before the assessment does, and the gate lives in the service rather than at
 * the call sites because the call-site version was forgotten five times: the
 * dashboard checked it and `/documents`, `/resume`, `/applications` and
 * `/achievements` all went on serving a stranger's employment history to a
 * brand-new visitor.
 */

const MOCK_LATENCY_MS = 450

function delay<T>(value: T, ms = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

const BASE_RESUME = {
  fullName: 'Alex Rivera',
  headline: 'Frontend Engineer',
  email: 'alex.rivera@example.com',
  phone: '+44 7700 900123',
  location: 'Manchester, UK',
  website: 'alexrivera.dev',
  summary:
    'Frontend engineer with two years across product teams, focused on accessible interfaces and measurable outcomes. Comfortable owning a feature from design review to release.',
  experience: [
    {
      id: 'e1',
      role: 'Frontend Engineer',
      company: 'Northwind',
      period: '2024 — present',
      highlights:
        'Rebuilt the checkout flow, cutting drop-off by 18%.\nIntroduced a component library now used by three teams.\nBrought the marketing site to WCAG AA.',
    },
    {
      id: 'e2',
      role: 'Junior Developer',
      company: 'Product Studio',
      period: '2023 — 2024',
      highlights:
        'Shipped the customer dashboard with a two-person team.\nCut median page load from 4.1s to 1.6s.',
    },
  ],
  skills: ['React', 'TypeScript', 'Testing Library', 'Accessibility', 'Node.js', 'Figma'],
}

function buildDocuments(): DocumentRecord[] {
  const now = Date.now()
  const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString()

  return [
    {
      id: 'cv-northwind',
      kind: 'cv',
      title: 'Frontend Engineer — Northwind',
      role: 'Frontend Engineer',
      company: 'Northwind',
      status: 'ready',
      updatedAt: hoursAgo(3),
      template: 'minimalist',
      resume: BASE_RESUME,
    },
    {
      id: 'cl-northwind',
      kind: 'cover-letter',
      title: 'Cover letter — Northwind',
      role: 'Frontend Engineer',
      company: 'Northwind',
      status: 'sent',
      updatedAt: hoursAgo(4),
      coverLetter: {
        greeting: 'Dear Hiring Team,',
        paragraphs: [
          'I’m writing about the Frontend Engineer role at Northwind. I spent the last year rebuilding a checkout flow end to end, and the part I enjoyed most was the bit most people skip — sitting with the drop-off data until the interface change was obvious.',
          'Your job posting mentions design-system ownership. At Northwind I introduced a component library that three teams now build on, which meant the accessibility work happened once rather than in every feature.',
          'I’d welcome the chance to talk about what you’re building.',
        ],
        signoff: 'Best regards,',
        name: 'Alex Rivera',
      },
    },
    {
      id: 'cv-product-studio',
      kind: 'cv',
      title: 'Junior Developer — Product Studio',
      role: 'Junior Developer',
      company: 'Product Studio',
      status: 'sent',
      updatedAt: hoursAgo(72),
      template: 'ats',
      resume: { ...BASE_RESUME, headline: 'Junior Developer' },
    },
    {
      id: 'cv-general',
      kind: 'cv',
      title: 'General CV',
      role: 'Frontend Engineer',
      status: 'draft',
      updatedAt: hoursAgo(120),
      template: 'designer',
      resume: BASE_RESUME,
    },
  ]
}

export const documentsService = {
  list(): Promise<DocumentSummary[]> {
    if (!journeyStorage.hasAssessment()) return delay([])

    // Explicit projection rather than destructuring the content fields into
    // unused bindings: `no-unused-vars` counts those, and lint runs at
    // --max-warnings 0. It also keeps the wire shape obvious.
    return delay(
      buildDocuments().map(
        ({ id, kind, title, role, company, status, updatedAt, template }): DocumentSummary => ({
          id,
          kind,
          title,
          role,
          company,
          status,
          updatedAt,
          template,
        }),
      ),
    )
  },

  get(id: string): Promise<DocumentRecord | null> {
    // A direct link to a document that cannot exist yet resolves to "not
    // found", which is what it is — not to a fixture.
    if (!journeyStorage.hasAssessment()) return delay(null)

    return delay(buildDocuments().find((d) => d.id === id) ?? null)
  },
}
