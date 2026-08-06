'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { CoverLetterForm } from '@/components/cover-letter/cover-letter-form'
import { CoverLetterPreview } from '@/components/cover-letter/cover-letter-preview'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { coverLetterService } from '@/services/api/cover-letter-service'
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
  const form = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: DEFAULTS,
  })
  const [letter, setLetter] = useState<CoverLetter | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const onGenerate = form.handleSubmit(async (values) => {
    setIsGenerating(true)
    const result = await coverLetterService.generate(values)
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
          'Generate a tailored cover letter from your own evidence. The coach is optional and can enrich it with saved context.'
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

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
          <div>
            <CoverLetterForm form={form} onGenerate={onGenerate} isGenerating={isGenerating} />
          </div>
          <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:self-start">
            <CoverLetterPreview letter={letter} isGenerating={isGenerating} />
            </div>
      </div>
    </div>
  )
}
