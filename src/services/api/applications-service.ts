import {
  createApplicationApiV1ApplicationsPost,
  deleteApplicationApiV1ApplicationsApplicationIdDelete,
  listApplicationsApiV1ApplicationsGet,
} from '@/api/generated'
import type { ApplicationResponse } from '@/api/generated'
import type { Application } from '@/features/applications/types'
import type { AppStatus } from '@/features/applications/status'
import type { ApplicationFormValues } from '@/lib/validators/application-schema'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

const STATE_TO_STATUS: Record<ApplicationResponse['state'], AppStatus> = {
  draft: 'applied',
  interviewing: 'screening',
  ready_to_generate: 'interview',
  review: 'interview',
  exported: 'offer',
}

function toApplication(application: ApplicationResponse): Application {
  return {
    id: application.id,
    company: application.organization || 'Personal application',
    role: application.title,
    status: STATE_TO_STATUS[application.state],
    appliedAt: application.created_at,
    location: application.application_type,
    source: application.state.replaceAll('_', ' '),
  }
}

export const applicationsService = {
  async getApplications(): Promise<Application[]> {
    const result = unwrapApiResult(await listApplicationsApiV1ApplicationsGet())
    return result.map(toApplication)
  },

  async create(values: ApplicationFormValues): Promise<Application> {
    const result = unwrapApiResult(
      await createApplicationApiV1ApplicationsPost({
        body: {
          application_type: 'job',
          organization: values.company,
          title: values.role,
        },
      }),
    )
    return toApplication(result)
  },

  async remove(id: string): Promise<void> {
    unwrapApiResult(
      await deleteApplicationApiV1ApplicationsApplicationIdDelete({
        path: { application_id: id },
      }),
    )
  },

  async restore(application: Application): Promise<Application> {
    return applicationsService.create({
      company: application.company,
      role: application.role,
      status: application.status,
      location: application.location,
      source: application.source,
    })
  },
}
