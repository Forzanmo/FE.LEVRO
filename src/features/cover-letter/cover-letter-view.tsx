'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import Link from 'next/link'

import { CoverLetterForm } from '@/components/cover-letter/cover-letter-form'
import { CoverLetterPreview } from '@/components/cover-letter/cover-letter-preview'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useHasAssessment } from '@/hooks/use-has-assessment'
import { useSession } from '@/providers/session-provider'
import { coverLetterService } from '@/services/api/cover-letter-service'
import { ROUTES } from '@/lib/constants/routes'
import { coverLetterSchema, type CoverLetterFormValues } from '@/lib/validators/cover-letter-schema'

import type { CoverLetter } from './types'

const DEFAULTS: CoverLetterFormValues = {
  company: '',
  role: '',
  hiringManager: '',
  tone: 'professional',
  highlights: '',
}

export function CoverLetterView() {
  const { user } = useSession()
  const hasAssessment = useHasAssessment()
  const form = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: DEFAULTS,
  })
  const [letter, setLetter] = useState<CoverLetter | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const onGenerate = form.handleSubmit(async (values) => {
    setIsGenerating(true)
    const result = await coverLetterService.generate(values, user?.name ?? 'Your Name')
    // `null` means the service refused for want of an assessment. Say so rather
    // than leaving the preview silently empty.
    if (!result) {
      toast.error('Take the assessment first — a letter needs evidence to argue from.')
    }
    setLetter(result)
    setIsGenerating(false)
  })

  const copy = async () => {
    if (!letter) return
    const text = `${letter.greeting}\n\n${letter.paragraphs.join('\n\n')}\n\n${letter.signoff}\n${letter.name}`
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Cover letter copied')
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  const download = () => {
    if (typeof window !== 'undefined') window.print()
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Cover Letter"
        description={
          hasAssessment === false
            ? 'Your cover letter argues from what you told the coach, tailored to one role.'
            : 'Generate a tailored cover letter for a specific role.'
        }
        actions={
          letter ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={copy} leftIcon={<Icon name="copy" size="sm" />}>
                Copy
              </Button>
              <Button
                variant="outline"
                onClick={download}
                leftIcon={<Icon name="download" size="sm" />}
              >
                Download PDF
              </Button>
            </div>
          ) : undefined
        }
      />

      {hasAssessment === null ? (
        <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
          <Skeleton className="h-[28rem] rounded-xl" />
          <Skeleton className="hidden h-[28rem] rounded-xl lg:block" />
        </div>
      ) : hasAssessment === false ? (
        /*
         * The form is not rendered at all before the assessment.
         *
         * Showing it disabled, or showing it and refusing on submit, still
         * invites an anxious user to fill in a company and a role and then tells
         * them no. The honest version never offers the trade: this letter is an
         * argument from evidence, and the evidence does not exist yet.
         */
        <EmptyState
          icon="coach"
          title="A cover letter needs something to argue from"
          description="Levvro writes it from what you told the coach — the projects, the skills, the role you're aiming at — so it makes your case with specifics instead of the same four paragraphs everyone else sends."
          action={
            <Button asChild size="lg">
              <Link href={ROUTES.coach}>
                Start my assessment
                <Icon name="arrow-right" size="sm" />
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
          <div>
            <CoverLetterForm form={form} onGenerate={onGenerate} isGenerating={isGenerating} />
          </div>
          <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
            <CoverLetterPreview letter={letter} isGenerating={isGenerating} />
          </div>
        </div>
      )}
    </div>
  )
}
