'use client'

import { useState } from 'react'
import Link from 'next/link'

import { CvTemplate } from '@/components/documents/cv-templates'
import { DocumentStatusBadge } from '@/components/documents/document-status-badge'
import { CoverLetterPreview } from '@/components/cover-letter/cover-letter-preview'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { ChoiceGroup } from '@/components/ui/choice-group'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { Heading, Text } from '@/components/ui/typography'
import { formatRelativeTime } from '@/lib/formatters'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

import { KIND_META } from './status'
import { CV_TEMPLATES, type CvTemplateId } from './types'
import { useDocument } from './use-documents'

/**
 * Template switcher.
 *
 * Built as a radiogroup rather than tabs: tabs imply panels of *different*
 * content, and these are three renderings of the same content. Each option
 * carries what it is good at and what it costs, because picking "Designer" for
 * a machine-screened application is a decision with consequences the candidate
 * would otherwise never see.
 */
const TEMPLATE_OPTIONS = CV_TEMPLATES.map((t) => ({
  value: t.id,
  label: `${t.label} — ${t.description} ${t.bestFor}`,
}))

function TemplatePicker({
  value,
  onChange,
}: {
  value: CvTemplateId
  onChange: (id: CvTemplateId) => void
}) {
  return (
    <ChoiceGroup
      legend="Template"
      hideLegend={false}
      options={TEMPLATE_OPTIONS}
      value={value}
      onChange={(v) => onChange(v as CvTemplateId)}
      className="grid gap-2 sm:grid-cols-3"
    >
      {(option, { selected }) => {
        const tpl = CV_TEMPLATES.find((t) => t.id === option.value)!
        return (
          <span
            className={cn(
              'block h-full rounded-xl border p-3.5 transition-colors',
              'group-has-[:focus-visible]/choice:ring-ring group-has-[:focus-visible]/choice:ring-2',
              selected ? 'border-brand bg-brand-muted' : 'border-border hover:bg-muted',
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{tpl.label}</span>
              {selected ? <Icon name="success" size="xs" tone="brand" /> : null}
            </span>
            <Text size="xs" tone="muted" className="mt-1 block">
              {tpl.description}
            </Text>
            <Text size="xs" tone="muted" className="mt-1.5 block font-medium">
              {tpl.bestFor}
            </Text>
          </span>
        )
      }}
    </ChoiceGroup>
  )
}

export function DocumentDetailView({ id }: { id: string }) {
  const { data, isPending, isError, refetch } = useDocument(id)
  const [template, setTemplate] = useState<CvTemplateId | null>(null)

  /*
   * Every branch keeps the back link and an <h1>. Returning the EmptyState bare
   * left its <h2> as the page's first heading, which skips a level in the
   * document outline — the same `heading-order` defect the old achievements cards
   * had. The escape route back to the library also has to survive a failure:
   * that is exactly when the user needs it.
   */
  const backLink = (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link href={ROUTES.documents}>
          <Icon name="arrow-left" size="sm" />
          All documents
        </Link>
      </Button>
    </div>
  )

  if (isError || (!isPending && !data)) {
    return (
      <div className="space-y-6">
        {backLink}
        <Heading level={1} size="2xl" className="sr-only">
          Document
        </Heading>
        <EmptyState
          icon="warning"
          title="We couldn’t open this document"
          description="It may have been removed, or this is a brief connection hiccup. Your other documents are unaffected."
          action={
            <Button onClick={() => refetch()} leftIcon={<Icon name="refresh" size="sm" />}>
              Try again
            </Button>
          }
        />
      </div>
    )
  }

  if (isPending || !data) {
    return (
      <div className="space-y-6">
        {backLink}
        <div role="status" aria-live="polite" className="space-y-6">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-[36rem] rounded-xl" />
          <span className="sr-only">Loading document…</span>
        </div>
      </div>
    )
  }

  const kind = KIND_META[data.kind]
  const active = template ?? data.template ?? 'minimalist'
  const isCv = data.kind === 'cv'

  return (
    <div className="space-y-6">
      {backLink}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Heading level={1} size="2xl">
              {data.title}
            </Heading>
            <DocumentStatusBadge status={data.status} />
          </div>
          <Text size="sm" tone="muted" className="mt-1">
            {kind.label} · edited {formatRelativeTime(data.updatedAt)}
          </Text>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={isCv ? ROUTES.resume : ROUTES.coverLetter}>
              <Icon name="edit" size="sm" />
              Edit
            </Link>
          </Button>
          <Button onClick={() => window.print()}>
            <Icon name="download" size="sm" />
            Download PDF
          </Button>
        </div>
      </div>

      {isCv ? <TemplatePicker value={active} onChange={setTemplate} /> : null}

      <div className="bg-muted/40 rounded-xl p-4 sm:p-8">
        {isCv && data.resume ? (
          <CvTemplate template={active} data={data.resume} />
        ) : data.coverLetter ? (
          <CoverLetterPreview letter={data.coverLetter} isGenerating={false} />
        ) : (
          <Text tone="muted">This document has no content yet.</Text>
        )}
      </div>
    </div>
  )
}
