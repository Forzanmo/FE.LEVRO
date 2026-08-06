import {
  createVersionApiV1AdminQuestionSetVersionsPost,
  getAiUsageSummaryApiV1AdminOperationsAiUsageGet,
  getEmailDeliverySummaryApiV1AdminOperationsEmailDeliveryGet,
  getProductFunnelSummaryApiV1AdminOperationsProductFunnelGet,
  getUserJourneyApiV1AdminOperationsUsersUserIdJourneyGet,
  getVersionApiV1AdminQuestionSetVersionsVersionIdGet,
  listVersionsApiV1AdminQuestionSetVersionsGet,
  listUsersApiV1AdminOperationsUsersGet,
  publishVersionApiV1AdminQuestionSetVersionsVersionIdPublishPost,
  replaceQuestionsApiV1AdminQuestionSetVersionsVersionIdQuestionsPut,
} from '@/api/generated'
import type { AdminQuestionInput, QuestionSetCreate } from '@/api/generated'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

export const adminService = {
  async getOverview(days = 30) {
    const [versions, aiUsage, emailDelivery, productFunnel] = await Promise.all([
      listVersionsApiV1AdminQuestionSetVersionsGet(),
      getAiUsageSummaryApiV1AdminOperationsAiUsageGet({ query: { days } }),
      getEmailDeliverySummaryApiV1AdminOperationsEmailDeliveryGet({ query: { days } }),
      getProductFunnelSummaryApiV1AdminOperationsProductFunnelGet({ query: { days } }),
    ])
    return {
      versions: unwrapApiResult(versions),
      aiUsage: unwrapApiResult(aiUsage),
      emailDelivery: unwrapApiResult(emailDelivery),
      productFunnel: unwrapApiResult(productFunnel),
    }
  },

  async listUsers() {
    return unwrapApiResult(await listUsersApiV1AdminOperationsUsersGet({ query: { limit: 100 } }))
  },

  async getUserJourney(userId: string) {
    return unwrapApiResult(
      await getUserJourneyApiV1AdminOperationsUsersUserIdJourneyGet({ path: { user_id: userId } }),
    )
  },

  async createVersion(body: QuestionSetCreate) {
    return unwrapApiResult(await createVersionApiV1AdminQuestionSetVersionsPost({ body }))
  },

  async getVersion(versionId: string) {
    return unwrapApiResult(
      await getVersionApiV1AdminQuestionSetVersionsVersionIdGet({ path: { version_id: versionId } }),
    )
  },

  async replaceQuestions(versionId: string, expectedRevision: number, questions: AdminQuestionInput[]) {
    return unwrapApiResult(
      await replaceQuestionsApiV1AdminQuestionSetVersionsVersionIdQuestionsPut({
        path: { version_id: versionId },
        body: { expected_revision: expectedRevision, questions },
      }),
    )
  },

  async publishVersion(versionId: string) {
    return unwrapApiResult(
      await publishVersionApiV1AdminQuestionSetVersionsVersionIdPublishPost({ path: { version_id: versionId } }),
    )
  },
}
