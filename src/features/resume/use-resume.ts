'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { resumeService } from '@/services/api/resume-service'
import { resumeStorage } from '@/services/storage/resume-storage'
import { resumeSchema, type ResumeData } from '@/lib/validators/resume-schema'

export type SaveStatus = 'idle' | 'saving' | 'saved'

const AUTOSAVE_DELAY = 700

/**
 * Resume form + autosave. Seeds from the generated resume on the server (stable
 * for hydration), hydrates any saved draft on mount, then debounce-persists
 * every change through the storage service, exposing a save status.
 */
export function useResume() {
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resumeService.getSeed(),
    mode: 'onBlur',
  })

  const [status, setStatus] = useState<SaveStatus>('idle')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load a previously saved draft once, after hydration.
  useEffect(() => {
    const saved = resumeStorage.load()
    if (saved) form.reset(saved)
  }, [form])

  // Debounced autosave on any change.
  useEffect(() => {
    // RHF's watch() isn't memoization-safe by the compiler's rules; benign here.
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((data) => {
      setStatus('saving')
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        resumeStorage.save(data as ResumeData)
        setStatus('saved')
      }, AUTOSAVE_DELAY)
    })
    return () => {
      subscription.unsubscribe()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [form])

  return { form, status }
}
