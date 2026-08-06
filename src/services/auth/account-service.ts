import {
  confirmPasswordResetApiV1AuthPasswordResetConfirmPost,
  deleteAccountApiV1AuthMeDelete,
  requestPasswordResetApiV1AuthPasswordResetRequestPost,
} from '@/api/generated'
import { unwrapApiResult } from '@/lib/api/http-client'
import { setAccessToken } from '@/lib/api/runtime'

function ensureNoContent(result: { error?: unknown; response?: Response }): void {
  if (result.error !== undefined) unwrapApiResult(result)
  if (!result.response?.ok) unwrapApiResult(result)
}

export const accountService = {
  async requestPasswordReset(email: string): Promise<string> {
    const response = unwrapApiResult(
      await requestPasswordResetApiV1AuthPasswordResetRequestPost({ body: { email } }),
    )
    return response.message
  },

  async confirmPasswordReset(token: string, newPassword: string): Promise<void> {
    const result = await confirmPasswordResetApiV1AuthPasswordResetConfirmPost({
      body: { token, new_password: newPassword },
    })
    ensureNoContent(result)
    setAccessToken(null)
  },

  async deleteAccount(password: string): Promise<void> {
    const result = await deleteAccountApiV1AuthMeDelete({ body: { password } })
    ensureNoContent(result)
    setAccessToken(null)
  },
}
