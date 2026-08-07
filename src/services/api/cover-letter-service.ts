import { generateCoverLetterApiV1ProductCoverLetterPost } from '@/api/generated'
import type { CoverLetter, CoverLetterInput } from '@/features/cover-letter/types'
import { unwrapApiResult } from '@/lib/api/http-client'
import { authenticatedFetch } from '@/lib/api/runtime'

export const coverLetterService = {
  async getDraftInput(): Promise<CoverLetterInput> {
    const response = await authenticatedFetch('/api/v1/chat/cover-letter-input')
    const body = (await response.json()) as {
      company?: string
      role?: string
      hiring_manager?: string
      tone?: CoverLetterInput['tone']
      highlights?: string
      error?: { message?: string }
    }
    if (!response.ok) throw new Error(body.error?.message ?? 'Could not load chat evidence.')
    return {
      company: body.company ?? '',
      role: body.role ?? '',
      hiringManager: body.hiring_manager ?? '',
      tone: body.tone ?? 'professional',
      highlights: body.highlights ?? '',
    }
  },
  async generate(input: CoverLetterInput): Promise<CoverLetter> {
    const response = unwrapApiResult(
      await generateCoverLetterApiV1ProductCoverLetterPost({
        body: {
          company: input.company,
          role: input.role,
          hiring_manager: input.hiringManager,
          tone: input.tone,
          highlights: input.highlights,
        },
      }),
    )
    return response.content
  },
}
