'use client'

import { useCallback, useState } from 'react'

import { applicationsService } from '@/services/api/applications-service'

import type { Application } from './types'
import type { ApplicationFormValues } from '@/lib/validators/application-schema'

export interface UseApplications {
  applications: Application[]
  add: (values: ApplicationFormValues) => void
  remove: (id: string) => void
  restore: (application: Application) => void
}

/**
 * Mutators are `useCallback`-stable so downstream `columns`/handlers passed to
 * TanStack Table keep stable references (unstable columns cause a re-render
 * loop). `data` is a stable `useState` value for the same reason.
 */
export function useApplications(): UseApplications {
  const [applications, setApplications] = useState<Application[]>(() =>
    applicationsService.getApplications(),
  )

  const add = useCallback((values: ApplicationFormValues) => {
    const application: Application = {
      id: crypto.randomUUID(),
      appliedAt: new Date().toISOString(),
      ...values,
    }
    setApplications((prev) => [application, ...prev])
  }, [])

  const remove = useCallback((id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const restore = useCallback((application: Application) => {
    setApplications((prev) =>
      prev.some((a) => a.id === application.id) ? prev : [application, ...prev],
    )
  }, [])

  return { applications, add, remove, restore }
}
