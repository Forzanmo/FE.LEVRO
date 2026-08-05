import {
  createExportJobApiV1DocumentsDocumentIdExportJobsPost,
  downloadExportApiV1ExportsExportIdDownloadGet,
  getDocumentApiV1DocumentsDocumentIdGet,
  getJobApiV1JobsJobIdGet,
  updatePresentationApiV1DocumentsDocumentIdPresentationPatch,
  updateSectionApiV1DocumentsDocumentIdSectionsSectionIdPatch,
} from '@/api/generated'
import type { DocumentResponse, DocumentStatement, PresentationUpdate } from '@/api/generated'
import { journeyStorage } from '@/services/storage/journey-storage'
import type { DocumentRecord, DocumentSummary } from '@/features/documents/types'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

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

function buildDemoDocuments(): DocumentRecord[] {
  const now = Date.now()
  const hoursAgo = (hours: number) => new Date(now - hours * 3_600_000).toISOString()

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
  ]
}

export const documentsService = {
  list(): Promise<DocumentSummary[]> {
    if (!journeyStorage.hasAssessment()) return delay([])
    return delay(
      buildDemoDocuments().map(
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
    if (!journeyStorage.hasAssessment()) return delay(null)
    return delay(buildDemoDocuments().find((document) => document.id === id) ?? null)
  },

  async getGenerated(documentId: string): Promise<DocumentResponse> {
    return unwrapApiResult(
      await getDocumentApiV1DocumentsDocumentIdGet({ path: { document_id: documentId } }),
    )
  },

  async updateSection(
    documentId: string,
    sectionId: string,
    expectedRevision: number,
    statements: DocumentStatement[],
  ): Promise<DocumentResponse> {
    return unwrapApiResult(
      await updateSectionApiV1DocumentsDocumentIdSectionsSectionIdPatch({
        path: { document_id: documentId, section_id: sectionId },
        body: { expected_revision: expectedRevision, statements },
      }),
    )
  },

  async updatePresentation(
    documentId: string,
    body: PresentationUpdate,
  ): Promise<DocumentResponse> {
    return unwrapApiResult(
      await updatePresentationApiV1DocumentsDocumentIdPresentationPatch({
        path: { document_id: documentId },
        body,
      }),
    )
  },

  async startExport(documentId: string) {
    return unwrapApiResult(
      await createExportJobApiV1DocumentsDocumentIdExportJobsPost({
        path: { document_id: documentId },
        headers: { 'Idempotency-Key': crypto.randomUUID() },
      }),
    )
  },

  async getJob(jobId: string) {
    return unwrapApiResult(await getJobApiV1JobsJobIdGet({ path: { job_id: jobId } }))
  },

  async download(exportId: string): Promise<Blob> {
    const result = await downloadExportApiV1ExportsExportIdDownloadGet({
        path: { export_id: exportId },
        parseAs: 'blob',
      })
    return unwrapApiResult<Blob>(result as { data?: Blob; error?: unknown; response?: Response })
  },
}
