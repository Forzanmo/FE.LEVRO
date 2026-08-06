import { createClientProductEventApiV1AnalyticsEventsPost } from '@/api/generated'
import type { ClientProductEventCreate } from '@/api/generated'
import { unwrapApiResult } from '@/lib/api/http-client'

async function record(body: ClientProductEventCreate): Promise<void> {
  const result = await createClientProductEventApiV1AnalyticsEventsPost({ body })
  if (result.error !== undefined || !result.response?.ok) unwrapApiResult(result)
}

export const analyticsService = {
  editorOpened(applicationId: string, documentId: string): Promise<void> {
    return record({
      event_name: 'editor_opened',
      application_id: applicationId,
      document_id: documentId,
    })
  },

  applicationAbandoned(
    applicationId: string,
    step: Exclude<ClientProductEventCreate['step'], null | undefined>,
  ): Promise<void> {
    return record({
      event_name: 'application_abandoned',
      application_id: applicationId,
      step,
    })
  },
}
