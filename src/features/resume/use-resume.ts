'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { resumeService } from '@/services/api/resume-service'
import { resumeStorage } from '@/services/storage/resume-storage'
import { journeyStorage } from '@/services/storage/journey-storage'
import { resumeSchema, type ResumeData } from '@/lib/validators/resume-schema'

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'

const AUTOSAVE_DELAY = 700

/**
 * Resume form + autosave. Starts blank (stable for hydration), then after mount
 * loads whichever CV the user actually has, then debounce-persists every change
 * through the storage service, exposing a save status.
 */
export function useResume() {
  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resumeService.getEmpty(),
    mode: 'onBlur',
  })

  const [status, setStatus] = useState<SaveStatus>('idle')
  const [hydrated, setHydrated] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  /*
   * Precedence: a saved draft always wins, then the generated CV, then blank.
   *
   * The generated CV is the assessment's output, so offering it to someone who
   * has not taken the assessment presents an invented employment history as
   * theirs — the same confidence trick the dashboard was fixed for. Both reads
   * need localStorage, so both have to happen here rather than in
   * `defaultValues`.
   */
  useEffect(() => {
    const saved = resumeStorage.load()
    if (saved) form.reset(saved)
    else if (journeyStorage.hasAssessment()) form.reset(resumeService.getSeed())
    setHydrated(true)
  }, [form])

  // Debounced autosave on any change.
  useEffect(() => {
    // RHF's watch() isn't memoization-safe by the compiler's rules; benign here.
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = form.watch((data) => {
      setStatus('saving')
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        // Report what actually happened. Reporting 'saved' unconditionally is
        // how a full quota turned into a user losing their CV while the header
        // told them it was safe.
        setStatus(resumeStorage.save(data as ResumeData) ? 'saved' : 'error')
      }, AUTOSAVE_DELAY)
    })
    return () => {
      subscription.unsubscribe()
      if (timer.current) clearTimeout(timer.current)
    }
  }, [form])

  return { form, status, hydrated }
}
