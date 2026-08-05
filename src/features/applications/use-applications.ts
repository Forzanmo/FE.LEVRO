'use client'

import { useCallback, useEffect, useState } from 'react'

import { applicationsService } from '@/services/api/applications-service'

import type { Application } from './types'
import type { ApplicationFormValues } from '@/lib/validators/application-schema'

export interface UseApplications {
  applications: Application[]
  /** False until the list has been read on the client. Render a skeleton. */
  hydrated: boolean
  add: (values: ApplicationFormValues) => void
  remove: (id: string) => void
  restore: (application: Application) => void
}

/**
 * Mutators are `useCallback`-stable so downstream `columns`/handlers passed to
 * TanStack Table keep stable references (unstable columns cause a re-render
 * loop). `data` is a stable `useState` value for the same reason.
 *
 * The list is seeded after mount, not in the `useState` initializer. The
 * service now gates on `journeyStorage`, which reads localStorage and so always
 * answers "no assessment" on the server — seeding during render would make the
 * server paint an empty table and the client replace it with fourteen rows.
 */
export function useApplications(): UseApplications {
  const [applications, setApplications] = useState<Application[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Deferred a frame rather than set synchronously in the effect body, the
    // same pattern `useCoach` uses for its hydration read: a sync setState here
    // cascades an extra render, and `hydrated` gates a skeleton so nothing
    // flashes while we wait.
    const id = requestAnimationFrame(() => {
      setApplications(applicationsService.getApplications())
      setHydrated(true)
    })
    return () => cancelAnimationFrame(id)
  }, [])

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

  return { applications, hydrated, add, remove, restore }
}
