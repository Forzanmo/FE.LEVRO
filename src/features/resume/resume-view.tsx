'use client'

import { useState } from 'react'
import Link from 'next/link'

import { ResumeEditor } from '@/components/resume/resume-editor'
// The editor previews with the Minimalist template rather than its own
// renderer: two copies of the same document drift apart, and the preview must
// be the thing the user will actually get.
import { CvTemplate } from '@/components/documents/cv-templates'
import { SaveStatus } from '@/components/resume/save-status'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { useHasAssessment } from '@/hooks/use-has-assessment'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'
import type { CvTemplateId } from '@/features/documents/types'

import { useResume } from './use-resume'

export function ResumeView() {
  const { form, status, hydrated } = useResume()
  const hasAssessment = useHasAssessment()
  const data = form.watch()
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [template, setTemplate] = useState<CvTemplateId>('minimalist')
  // The coach is the intended path to a CV, but it is a recommendation, not a
  // gate: someone who already knows what they want to write can say so.
  const [startedBlank, setStartedBlank] = useState(false)

  const downloadPdf = () => {
    if (typeof window !== 'undefined') {
      window.open('/api/v1/product/resume/export.pdf', '_self')
    }
  }

  const loading = !hydrated || hasAssessment === null
  const preAssessment = !loading && hasAssessment === false && !startedBlank && !data.fullName

  return (
    <div className="space-y-5">
      <PageHeader
        title="Edit CV"
        /* "Edit on the left" describes an editor that isn't rendered yet in the
           pre-assessment state. */
        description={
          preAssessment
            ? 'Your CV is written from the assessment, then it’s yours to edit.'
            : 'Edit on the left — your preview updates live and saves automatically.'
        }
        actions={
          loading || preAssessment ? null : (
            <div className="flex items-center gap-3">
              <SaveStatus status={status} />
              <Button
                variant="outline"
                onClick={downloadPdf}
                leftIcon={<Icon name="download" size="sm" />}
              >
                Download PDF
              </Button>
            </div>
          )
        }
      />

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[32rem] rounded-xl" />
          <Skeleton className="hidden h-[32rem] rounded-xl lg:block" />
        </div>
      ) : preAssessment ? (
        /*
         * No assessment means no generated CV. Pre-filling the editor with the
         * seeded one would hand a stranger's two years at Northwind to a
         * brand-new visitor as though it were their own history.
         */
        <EmptyState
          icon="coach"
          title="Your CV gets written from your answers"
          description="Take the short assessment first — Levrro drafts the CV from what you say, so you edit real sentences instead of staring at an empty page."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href={ROUTES.coach}>
                  Start my assessment
                  <Icon name="arrow-right" size="sm" />
                </Link>
              </Button>
              <Button variant="ghost" onClick={() => setStartedBlank(true)}>
                Start from a blank CV
              </Button>
            </div>
          }
        />
      ) : (
        <>
          {/* Mobile: swap between editor and preview. Toggle buttons (group +
              aria-pressed), not a fake tab widget that would owe an
              unimplemented arrow-key contract. */}
          <div className="bg-muted flex rounded-lg p-1 lg:hidden" role="group" aria-label="CV view">
            {(['edit', 'preview'] as const).map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={tab === value}
                onClick={() => setTab(value)}
                className={cn(
                  'flex-1 rounded-md px-3 py-1.5 text-sm font-medium capitalize transition-colors',
                  'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                  tab === value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {value}
              </button>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className={cn(tab !== 'edit' && 'hidden lg:block')}>
              <ResumeEditor form={form} />
            </div>
            <div className={cn(tab !== 'preview' && 'hidden lg:block')}>
              <div className="lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
                <div className="mb-3 flex items-center justify-end gap-2">
                  <label htmlFor="cv-template" className="text-muted-foreground text-sm">
                    Template
                  </label>
                  <select
                    id="cv-template"
                    value={template}
                    onChange={(event) => setTemplate(event.target.value as CvTemplateId)}
                    className="border-input bg-background h-9 rounded-lg border px-3 text-sm"
                  >
                    <option value="minimalist">Minimalist</option>
                    <option value="designer">Designer</option>
                    <option value="ats">ATS-friendly</option>
                  </select>
                </div>
                <CvTemplate template={template} data={data} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
