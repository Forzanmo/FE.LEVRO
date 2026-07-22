'use client'

import { useMemo, useState } from 'react'

import { AchievementCard } from '@/components/achievements/achievement-card'
import { EmptyState } from '@/components/shared/empty-state'
import { PageHeader } from '@/components/shared/page-header'
import { StatCard } from '@/components/shared/stat-card'
import { achievementsService } from '@/services/api/achievements-service'
import type { AchievementStatus } from './types'
import { cn } from '@/lib/utils'

const FILTERS: { value: 'all' | AchievementStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'earned', label: 'Earned' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'locked', label: 'Locked' },
]

export function AchievementsView() {
  const achievements = useMemo(() => achievementsService.getAchievements(), [])
  const [filter, setFilter] = useState<'all' | AchievementStatus>('all')

  const earned = achievements.filter((a) => a.status === 'earned')
  const inProgress = achievements.filter((a) => a.status === 'in-progress')
  const earnedXp = earned.reduce((sum, a) => sum + a.xp, 0)

  const shown = filter === 'all' ? achievements : achievements.filter((a) => a.status === filter)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Achievements"
        description="Milestones you’ve unlocked on the way to getting hired."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Unlocked"
          value={`${earned.length}/${achievements.length}`}
          icon="achievements"
          tone="brand"
        />
        <StatCard label="XP earned" value={earnedXp} icon="zap" tone="warning" />
        <StatCard label="In progress" value={inProgress.length} icon="trending" tone="info" />
      </div>

      {/* Toggle filters, not a tab widget: a button group with aria-pressed —
          correct semantics without owing the tablist arrow-key contract. */}
      <div className="bg-muted flex w-fit rounded-lg p-1" role="group" aria-label="Filter achievements">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
              filter === f.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((achievement) => (
            <AchievementCard key={achievement.id} achievement={achievement} />
          ))}
        </div>
      ) : (
        <EmptyState icon="achievements" title="Nothing here yet" description="Keep going — this category is waiting for you." />
      )}
    </div>
  )
}
