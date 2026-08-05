import {
  createExportJobApiV1DocumentsDocumentIdExportJobsPost,
  downloadExportApiV1ExportsExportIdDownloadGet,
  getDocumentApiV1DocumentsDocumentIdGet,
  getJobApiV1JobsJobIdGet,
  updatePresentationApiV1DocumentsDocumentIdPresentationPatch,
  updateSectionApiV1DocumentsDocumentIdSectionsSectionIdPatch,
} from '@/api/generated'
import type { DocumentResponse, DocumentStatement, PresentationUpdate } from '@/api/generated'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

export const documentsService = {
  async get(documentId: string): Promise<DocumentResponse> {
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
