import { generateCoverLetterApiV1ProductCoverLetterPost } from '@/api/generated'
import type { CoverLetter, CoverLetterInput } from '@/features/cover-letter/types'
import { unwrapApiResult } from '@/lib/api/http-client'
import '@/lib/api/runtime'

export const coverLetterService = {
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
