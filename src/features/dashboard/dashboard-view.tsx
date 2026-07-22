'use client'

import Link from 'next/link'

import { ActivityHeatmapCard } from '@/components/dashboard/activity-heatmap-card'
import { ApplicationsCard } from '@/components/dashboard/applications-card'
import { CareerScoreCard } from '@/components/dashboard/career-score-card'
import { RecentActivityCard } from '@/components/dashboard/recent-activity-card'
import { RoadmapProgressCard } from '@/components/dashboard/roadmap-progress-card'
import { TodaysMissionCard } from '@/components/dashboard/todays-mission-card'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/lib/constants/routes'

import { useDashboardOverview } from './use-dashboard'

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-[32rem] rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-44 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function DashboardView() {
  const { data, isPending, isError, refetch } = useDashboardOverview()

  return (
    <div className="space-y-6">
      <PageHeader
        title={data ? `Welcome back, ${data.userName}` : 'Welcome back'}
        description="Here’s your path to getting hired — one focused step at a time."
        actions={
          <>
            {data ? (
              <span className="bg-warning-muted text-warning hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium sm:inline-flex">
                <Icon name="streak" size="sm" />
                {data.streakDays}-day streak
              </span>
            ) : null}
            <Button asChild variant="ghost">
              <Link href={ROUTES.coach}>
                <Icon name="coach" size="sm" />
                Continue AI Coach
              </Link>
            </Button>
          </>
        }
      />

      {isError ? (
        <EmptyState
          icon="warning"
          title="Couldn’t load your dashboard"
          description="This is usually a brief connection hiccup — your progress is safe. Try again in a moment."
          action={
            <Button onClick={() => refetch()} leftIcon={<Icon name="refresh" size="sm" />}>
              Try again
            </Button>
          }
        />
      ) : isPending ? (
        <DashboardSkeleton />
      ) : (
        <>
          {/* Momentum leads: the one focused next step, above the raw score. */}
          <TodaysMissionCard mission={data.mission} />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <CareerScoreCard score={data.score} />
              <ActivityHeatmapCard days={data.heatmap} streakDays={data.streakDays} />
              <RecentActivityCard items={data.activity} />
            </div>
            <div className="space-y-6">
              <RoadmapProgressCard roadmap={data.roadmap} />
              <ApplicationsCard summary={data.applications} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
