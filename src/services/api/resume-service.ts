import { getResumeApiV1ProductResumeGet, saveResumeApiV1ProductResumePut } from '@/api/generated'
import type { ResumeData as ApiResumeData, ResumeResponse } from '@/api/generated'
import type { ResumeData } from '@/lib/validators/resume-schema'
import { unwrapApiResult } from '@/lib/api/http-client'
import { authenticatedFetch } from '@/lib/api/runtime'

export interface ResumeSession {
  data: ResumeData
  revision: number
}

function fromApi(response: ResumeResponse): ResumeSession {
  return {
    revision: response.revision,
    data: {
      fullName: response.data.full_name,
      headline: response.data.headline,
      email: response.data.email,
      phone: response.data.phone,
      location: response.data.location,
      website: response.data.website,
      summary: response.data.summary,
      experience: response.data.experience,
      skills: response.data.skills,
      education: response.data.education ?? [],
      projects: response.data.projects ?? [],
      achievements: response.data.achievements ?? [],
    },
  }
}

function toApi(data: ResumeData): ApiResumeData {
  return {
    full_name: data.fullName,
    headline: data.headline,
    email: data.email,
    phone: data.phone,
    location: data.location,
    website: data.website,
    summary: data.summary,
    experience: data.experience,
    skills: data.skills,
    education: data.education,
    projects: data.projects,
    achievements: data.achievements,
  }
}

export const resumeService = {
  async get(): Promise<ResumeSession> {
    // Backfill facts from the latest chat before loading the editable draft.
    // A user without a chat simply receives the normal blank/profile draft.
    await authenticatedFetch('/api/v1/chat/resume-draft', { method: 'POST' }).catch(() => null)
    return fromApi(unwrapApiResult(await getResumeApiV1ProductResumeGet()))
  },

  async save(data: ResumeData, expectedRevision: number): Promise<ResumeSession> {
    return fromApi(
      unwrapApiResult(
        await saveResumeApiV1ProductResumePut({
          body: { data: toApi(data), expected_revision: expectedRevision },
        }),
      ),
    )
  },
}
