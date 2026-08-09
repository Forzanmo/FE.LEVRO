import type { Metadata } from 'next'

import { SignInView } from '@/features/auth/sign-in-view'

export const metadata: Metadata = {
  title: 'Create account or sign in',
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>
}) {
  const { mode } = await searchParams
  return <SignInView initialMode={mode === 'register' ? 'register' : 'sign-in'} />
}
