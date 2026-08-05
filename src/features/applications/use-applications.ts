'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { applicationsService } from '@/services/api/applications-service'

import type { Application } from './types'
import type { ApplicationFormValues } from '@/lib/validators/application-schema'

const applicationsKey = ['applications'] as const

export interface UseApplications {
  applications: Application[]
  isLoading: boolean
  hydrated: boolean
  error: Error | null
  add: (values: ApplicationFormValues) => void
  remove: (id: string) => void
  restore: (application: Application) => void
}

export function useApplications(): UseApplications {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: applicationsKey,
    queryFn: applicationsService.getApplications,
  })

  const refresh = () => queryClient.invalidateQueries({ queryKey: applicationsKey })

  const createMutation = useMutation({
    mutationFn: applicationsService.create,
    onSuccess: () => {
      void refresh()
      toast.success('Application added')
    },
    onError: (error: Error) => toast.error('Could not add application', { description: error.message }),
  })

  const deleteMutation = useMutation({
    mutationFn: applicationsService.remove,
    onSuccess: () => void refresh(),
    onError: (error: Error) => toast.error('Could not remove application', { description: error.message }),
  })

  const restoreMutation = useMutation({
    mutationFn: applicationsService.restore,
    onSuccess: () => {
      void refresh()
      toast.success('Application restored')
    },
    onError: (error: Error) => toast.error('Could not restore application', { description: error.message }),
  })

  return {
    applications: query.data ?? [],
    isLoading: query.isLoading,
    hydrated: !query.isLoading,
    error: query.error,
    add: (values) => createMutation.mutate(values),
    remove: (id) => deleteMutation.mutate(id),
    restore: (application) => restoreMutation.mutate(application),
  }
}
