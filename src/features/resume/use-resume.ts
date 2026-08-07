'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { resumeSchema, type ResumeData } from '@/lib/validators/resume-schema'
import { resumeService, type ResumeSession } from '@/services/api/resume-service'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const AUTOSAVE_DELAY = 700
const resumeKey = ['resume-draft'] as const
const EMPTY_RESUME: ResumeData = {
  fullName: '',
  headline: '',
  email: '',
  phone: '',
  location: '',
  website: '',
  summary: '',
  experience: [],
  skills: [],
  education: [],
  projects: [],
  achievements: [],
}

export function useResume() {
  const queryClient = useQueryClient()
  const query = useQuery({ queryKey: resumeKey, queryFn: () => resumeService.get() })
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: EMPTY_RESUME,
    mode: 'onBlur',
  })
  const [status, setStatus] = useState<SaveStatus>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const revision = useRef(0)
  const hydrated = useRef(false)

  useEffect(() => {
    if (!query.data) return
    revision.current = query.data.revision
    if (hydrated.current) return
    form.reset(query.data.data)
    hydrated.current = true
  }, [form, query.data])

  useEffect(() => {
    // React Hook Form's subscription API is intentionally not compiler-memoized.
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((value) => {
      if (!hydrated.current) return
      setStatus('saving')
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(async () => {
        try {
          const next = await resumeService.save(value as ResumeData, revision.current)
          revision.current = next.revision
          queryClient.setQueryData<ResumeSession>(resumeKey, next)
          setStatus('saved')
        } catch {
          setStatus('error')
          toast.error('Could not save your resume')
        }
      }, AUTOSAVE_DELAY)
    })
    return () => {
      subscription.unsubscribe()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [form, queryClient])

  return {
    form,
    status,
    isLoading: query.isPending,
    hydrated: !query.isPending,
    isError: query.isError,
    retry: () => void query.refetch(),
  }
}
