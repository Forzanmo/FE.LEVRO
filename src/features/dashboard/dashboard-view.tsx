'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import { ApplicationsCard } from '@/components/dashboard/applications-card'
import { FirstRunPanel } from '@/components/dashboard/first-run-panel'
import { NextStep } from '@/components/dashboard/next-step'
import { RecentActivityCard } from '@/components/dashboard/recent-activity-card'
import { RecentDocumentsCard } from '@/components/dashboard/recent-documents-card'
import { SkillsCoverageCard } from '@/components/dashboard/skills-coverage-card'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/lib/constants/routes'
import { useSession } from '@/providers/session-provider'
import { journeyStorage } from '@/services/storage/journey-storage'

import { useDashboardOverview } from './use-dashboard'

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Skeleton className="h-[26rem] rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    </div>
  )
}

export function DashboardView() {
  const { data, isPending, isError, refetch } = useDashboardOverview()
  // The name comes from the session, not the query. `dashboardService` reads
  // localStorage synchronously, so on a cold load it resolved before the
  // session provider had written — rendering "…, there" beside an avatar
  // already showing the real initials, and only correcting on reload.
  const { user } = useSession()
  const name = user?.name ?? data?.userName ?? ''

  /*
   * The dashboard now closes the first-run window itself. That used to be the
   * score reveal's job, and with the reveal gone the flag would never have been
   * set — leaving every visit looking like a first visit.
   */
  useEffect(() => {
    if (data?.isFirstRun) journeyStorage.markDashboardSeen()
  }, [data?.isFirstRun])

  const greeting = !data
    ? 'Your dashboard'
    : !data.hasAssessment
      ? name
        ? `Let’s get started, ${name}`
        : 'Let’s get started'
      : data.isFirstRun
        ? `Your plan is ready${name ? `, ${name}` : ''}`
        : `Welcome back${name ? `, ${name}` : ''}`

  return (
    <div className="space-y-6">
      <PageHeader
        title={greeting}
        /* Before the assessment there are no documents, so the standing
           description described a page the user is not looking at. */
        description={
          data && !data.hasAssessment
            ? 'A short conversation first, then a clear picture of where you stand.'
            : 'What your documents prove today — and what’s still missing.'
        }
        actions={
          <>
            {/* A streak only exists once it has been earned.
                Visible on mobile too: it was `hidden sm:inline-flex`, so the
                single piece of earned-momentum reassurance in the product was
                absent on the device most job-seekers actually use. */}
            {data && data.streakDays > 0 ? (
              <span className="bg-achievement-muted text-achievement inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium">
                <Icon name="streak" size="sm" />
                {data.streakDays}-day streak
              </span>
            ) : null}
            {data?.hasAssessment ? (
              <Button asChild variant="ghost">
                <Link href={ROUTES.documents}>
                  <Icon name="resume" size="sm" />
                  All documents
                </Link>
              </Button>
            ) : null}
          </>
        }
      />

      {isError ? (
        <EmptyState
          icon="warning"
          title="Couldn’t load your dashboard"
          description="This is usually a brief connection hiccup — your work is safe. Try again in a moment."
          action={
            <Button onClick={() => refetch()} leftIcon={<Icon name="refresh" size="sm" />}>
              Try again
            </Button>
          }
        />
      ) : isPending ? (
        <DashboardSkeleton />
      ) : !data.hasAssessment ? (
        /*
         * Before the assessment there is no skills picture to show. Serving the
         * seeded one would tell a brand-new visitor what their strengths are
         * before they have said a word — the confidence trick PRODUCT.md rules
         * out.
         */
        <FirstRunPanel />
      ) : (
        <div className="space-y-6">
          {/* One action, above the read-out it comes from. */}
          <NextStep skills={data.skills} />

          {/* `min-w-0` on both grid items. Grid children default to
              `min-width: auto`, so the single mobile column was sized to the
              widest card's min-content (379px) instead of the 358px available —
              which is why every card overflowed by the same 5px at 390. */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Skills lead: what the documents prove, and what they don't. */}
            <div className="min-w-0 space-y-6 lg:col-span-2">
              <SkillsCoverageCard skills={data.skills} />
              <RecentActivityCard items={data.activity} />
            </div>
            <div className="min-w-0 space-y-6">
              <RecentDocumentsCard documents={data.documents} />
              <ApplicationsCard summary={data.applications} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
