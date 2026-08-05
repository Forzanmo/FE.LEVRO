'use client'

import { useState } from 'react'

import { ResumeEditor } from '@/components/resume/resume-editor'
import { ResumePreview } from '@/components/resume/resume-preview'
import { SaveStatus } from '@/components/resume/save-status'
import { PageHeader } from '@/components/shared/page-header'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

import { useResume } from './use-resume'

export function ResumeView() {
  const { form, status, isLoading, isError, retry } = useResume()
  const data = form.watch()
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')

  const downloadPdf = () => {
    if (typeof window !== 'undefined') window.print()
  }

  if (isLoading) return <Skeleton className="h-[38rem] rounded-xl" />
  if (isError) {
    return (
      <EmptyState
        icon="warning"
        title="Couldn’t load your resume"
        description="Your draft is safe. Try loading it again."
        action={<Button onClick={retry} leftIcon={<Icon name="refresh" size="sm" />}>Try again</Button>}
      />
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Resume"
        description="Edit on the left — your preview updates live and saves automatically."
        actions={
          <div className="flex items-center gap-3">
            <SaveStatus status={status} />
            <Button variant="outline" onClick={downloadPdf} leftIcon={<Icon name="download" size="sm" />}>
              Download PDF
            </Button>
          </div>
        }
      />

      {/* Mobile: swap between editor and preview. Toggle buttons (group +
          aria-pressed, matching the achievements filter), not a fake tab widget
          that would owe an unimplemented arrow-key contract. */}
      <div className="bg-muted flex rounded-lg p-1 lg:hidden" role="group" aria-label="Resume view">
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
            <ResumePreview data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}
