import {
  confirmExtractionApiV1ApplicationsApplicationIdExtractionConfirmPost,
  createGenerationJobApiV1ApplicationsApplicationIdGenerationJobsPost,
  currentQuestionApiV1ApplicationsApplicationIdConversationCurrentGet,
  getApplicationApiV1ApplicationsApplicationIdGet,
  getExtractionApiV1ApplicationsApplicationIdExtractionGet,
  getJobApiV1JobsJobIdGet,
  getOpportunityApiV1ApplicationsApplicationIdOpportunityGet,
  listDocumentsApiV1ApplicationsApplicationIdDocumentsGet,
  putOpportunityApiV1ApplicationsApplicationIdOpportunityPut,
  saveAnswerApiV1ApplicationsApplicationIdAnswersQuestionIdPut,
  uploadCvApiV1ApplicationsApplicationIdCvUploadPost,
} from '@/api/generated'
import type {
  AnswerUpdate,
  CvExtractionResponse,
  OpportunityResponse,
  OpportunityUpsert,
} from '@/api/generated'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

interface Result<T> {
  data?: T
  response?: Response
}

function optional<T>(result: Result<T>): T | null {
  if (result.data !== undefined) return result.data
  if (result.response?.status === 404) return null
  return unwrapApiResult(result)
}

export const applicationWorkflowService = {
  async getWorkspace(applicationId: string) {
    const [applicationResult, opportunityResult, extractionResult, conversationResult, documentsResult] =
      await Promise.all([
        getApplicationApiV1ApplicationsApplicationIdGet({ path: { application_id: applicationId } }),
        getOpportunityApiV1ApplicationsApplicationIdOpportunityGet({ path: { application_id: applicationId } }),
        getExtractionApiV1ApplicationsApplicationIdExtractionGet({ path: { application_id: applicationId } }),
        currentQuestionApiV1ApplicationsApplicationIdConversationCurrentGet({ path: { application_id: applicationId } }),
        listDocumentsApiV1ApplicationsApplicationIdDocumentsGet({ path: { application_id: applicationId } }),
      ])

    return {
      application: unwrapApiResult(applicationResult),
      opportunity: optional(opportunityResult),
      extraction: optional(extractionResult),
      conversation: unwrapApiResult(conversationResult),
      documents: unwrapApiResult(documentsResult),
    }
  },

  async saveOpportunity(applicationId: string, body: OpportunityUpsert): Promise<OpportunityResponse> {
    return unwrapApiResult(
      await putOpportunityApiV1ApplicationsApplicationIdOpportunityPut({
        path: { application_id: applicationId },
        body,
      }),
    )
  },

  async uploadCv(applicationId: string, cv: File): Promise<CvExtractionResponse> {
    unwrapApiResult(
      await uploadCvApiV1ApplicationsApplicationIdCvUploadPost({
        path: { application_id: applicationId },
        body: { cv },
      }),
    )
    return unwrapApiResult(
      await getExtractionApiV1ApplicationsApplicationIdExtractionGet({
        path: { application_id: applicationId },
      }),
    )
  },

  async confirmExtraction(applicationId: string, extraction: CvExtractionResponse) {
    return unwrapApiResult(
      await confirmExtractionApiV1ApplicationsApplicationIdExtractionConfirmPost({
        path: { application_id: applicationId },
        body: {
          data: extraction.candidate_data,
          expected_revision: extraction.revision,
        },
      }),
    )
  },

  async saveAnswer(applicationId: string, questionId: string, body: AnswerUpdate) {
    return unwrapApiResult(
      await saveAnswerApiV1ApplicationsApplicationIdAnswersQuestionIdPut({
        path: { application_id: applicationId, question_id: questionId },
        body,
      }),
    )
  },

  async startGeneration(applicationId: string) {
    return unwrapApiResult(
      await createGenerationJobApiV1ApplicationsApplicationIdGenerationJobsPost({
        path: { application_id: applicationId },
        headers: { 'Idempotency-Key': crypto.randomUUID() },
      }),
    )
  },

  async getJob(jobId: string) {
    return unwrapApiResult(await getJobApiV1JobsJobIdGet({ path: { job_id: jobId } }))
  },
}
