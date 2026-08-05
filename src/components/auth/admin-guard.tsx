'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useSession } from '@/providers/session-provider'
import { ROUTES } from '@/lib/constants/routes'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { status, user } = useSession()
  const router = useRouter()
  const denied = status === 'authenticated' && !user?.isAdmin

  useEffect(() => {
    if (denied) router.replace(ROUTES.dashboard)
  }, [denied, router])

  if (status !== 'authenticated' || !user?.isAdmin) return null
  return <>{children}</>
}
