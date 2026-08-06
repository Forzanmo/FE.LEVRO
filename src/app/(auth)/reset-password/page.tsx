import type { Metadata } from 'next'

import { ResetPasswordView } from '@/features/auth/password-reset-view'

export const metadata: Metadata = { title: 'Reset password' }

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  return <ResetPasswordView token={token ?? null} />
}
