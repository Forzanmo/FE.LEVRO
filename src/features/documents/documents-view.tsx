'use client'

import Link from 'next/link'

import { DocumentStatusBadge } from '@/components/documents/document-status-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { Text } from '@/components/ui/typography'
import { useHasAssessment } from '@/hooks/use-has-assessment'
import { formatRelativeTime } from '@/lib/formatters'
import { ROUTES } from '@/lib/constants/routes'

import { KIND_META } from './status'
import type { DocumentSummary } from './types'
import { useDocuments } from './use-documents'

/**
 * The document library.
 *
 * A list, not a card grid: these are files with dates and states, and the
 * things a job-seeker actually scans for are "which role was this for" and
 * "when did I last touch it". A grid of equal tiles would bury both.
 */
function DocumentRow({ doc }: { doc: DocumentSummary }) {
  const kind = KIND_META[doc.kind]

  return (
    <li>
      <Link
        href={`${ROUTES.documents}/${doc.id}`}
        className="hover:bg-muted/60 focus-visible:ring-ring group flex items-center gap-4 rounded-xl px-3 py-3.5 outline-none transition-colors focus-visible:ring-2 sm:px-4"
      >
        <span className="bg-muted text-muted-foreground grid size-10 shrink-0 place-items-center rounded-lg">
          <Icon name={kind.icon} size="sm" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {/* Wraps rather than truncates: the company is at the end of the
                title and is what distinguishes two CVs for two roles. */}
            <span className="line-clamp-2 text-sm font-medium">{doc.title}</span>
            <DocumentStatusBadge status={doc.status} className="shrink-0" />
          </span>
          <span className="text-muted-foreground mt-0.5 block text-xs">
            {kind.label} · edited {formatRelativeTime(doc.updatedAt)}
          </span>
        </span>

        <Icon
          name="chevron-right"
          size="sm"
          className="text-muted-foreground group-hover:text-foreground shrink-0 transition-colors"
        />
      </Link>
    </li>
  )
}

export function DocumentsView() {
  const { data, isPending, isError, refetch } = useDocuments()
  const hasAssessment = useHasAssessment()

  const cvs = data?.filter((d) => d.kind === 'cv') ?? []
  const letters = data?.filter((d) => d.kind === 'cover-letter') ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description={
          hasAssessment === false
            ? 'Your CVs and cover letters will collect here, each kept with the role it was written for.'
            : 'Every CV and cover letter you’ve made, and the roles they were written for.'
        }
        /*
         * No "New CV" before the assessment. It points at an editor that has
         * nothing to seed from, and it competed as a second primary button
         * against the "Start my assessment" the empty state is asking for —
         * two primary actions, one of them a dead end.
         */
        /*
         * Both document kinds are creatable from here, and that is a
         * reachability fix, not a convenience. The mobile bottom bar is capped
         * at five destinations and Cover Letter is not one of them, so on the
         * device most job-seekers actually use, /cover-letter had exactly one
         * inbound link in the whole app — from an existing cover letter. You
         * could edit one but never write your first. A cover letter is half of
         * what the landing page promises.
         */
        actions={
          hasAssessment === false ? null : (
            <div className="flex flex-wrap items-center gap-2">
              <Button asChild>
                <Link href={ROUTES.resume}>
                  <Icon name="add" size="sm" />
                  New CV
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href={ROUTES.coverLetter}>
                  <Icon name="add" size="sm" />
                  New cover letter
                </Link>
              </Button>
            </div>
          )
        }
      />

      {isError ? (
        <EmptyState
          icon="warning"
          title="Couldn’t load your documents"
          description="This is usually a brief connection hiccup — nothing has been lost. Try again in a moment."
          action={
            <Button onClick={() => refetch()} leftIcon={<Icon name="refresh" size="sm" />}>
              Try again
            </Button>
          }
        />
      ) : isPending ? (
        <div className="space-y-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      ) : !data.length ? (
        /*
         * Two different empty states wearing one shape. Before the assessment
         * there is nothing to build a document from, so pointing at the editor
         * would send the user to a blank page; after it, the editor is exactly
         * where they should go.
         */
        hasAssessment === false ? (
          <EmptyState
            icon="coach"
            title="Your documents start with a conversation"
            description="Levvro drafts your CV and cover letters from what you tell the coach, so each one argues from real evidence rather than a template."
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
          <EmptyState
            icon="resume"
            title="No documents yet"
            description="Your CVs and cover letters will collect here as you tailor them for each role, so you can reuse the one that fits."
            action={
              <Button asChild>
                <Link href={ROUTES.resume}>Build your first CV</Link>
              </Button>
            }
          />
        )
      ) : (
        <div className="space-y-8">
          <section>
            {/* Not `uppercase`: it rendered "CVs" as "CVS", which reads as the
                pharmacy chain. This is the DESIGN.md label role — 0.875rem,
                weight 500 — which is legible without the transform. */}
            <h2 className="text-muted-foreground mb-1 px-3 text-sm font-medium sm:px-4">
              CVs
            </h2>
            {cvs.length ? (
              <ul className="divide-border/70 divide-y">
                {cvs.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))}
              </ul>
            ) : (
              <Text size="sm" tone="muted" className="px-3 py-3 sm:px-4">
                No CVs yet.
              </Text>
            )}
          </section>

          <section>
            {/* Not `uppercase`: it rendered "CVs" as "CVS", which reads as the
                pharmacy chain. This is the DESIGN.md label role — 0.875rem,
                weight 500 — which is legible without the transform. */}
            <h2 className="text-muted-foreground mb-1 px-3 text-sm font-medium sm:px-4">
              Cover letters
            </h2>
            {letters.length ? (
              <ul className="divide-border/70 divide-y">
                {letters.map((doc) => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))}
              </ul>
            ) : (
              /* An empty section that only states its own emptiness wastes the
                 one moment the user is looking straight at the gap. */
              <div className="px-3 py-3 sm:px-4">
                <Text size="sm" tone="muted">
                  No cover letters yet — they’re written from the same evidence as
                  your CV, tailored to one role.
                </Text>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link href={ROUTES.coverLetter}>
                    Write a cover letter
                    <Icon name="arrow-right" size="xs" />
                  </Link>
                </Button>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  )
}
