import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Text } from '@/components/ui/typography'
import type { RoadmapStats } from '@/features/roadmap/types'

/** Overall roadmap progress — level, XP and completion. Restrained, not gamey. */
export function RoadmapHeader({ stats }: { stats: RoadmapStats }) {
  return (
    <div className="bg-card ring-foreground/10 space-y-3 rounded-xl p-5 ring-1">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="bg-brand-muted text-brand grid size-11 shrink-0 place-items-center rounded-xl">
            <Icon name="roadmap" size="md" />
          </span>
          <div>
            <Text as="span" size="sm" tone="muted">
              Level {stats.level}
            </Text>
            <div className="font-heading text-lg font-semibold">
              {stats.completedCount} of {stats.total} quests complete
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-brand font-heading text-2xl font-semibold tabular-nums">
            {stats.earnedXp}
          </div>
          <Text as="span" size="xs" tone="muted">
            of {stats.totalXp} XP
          </Text>
        </div>
      </div>
      <Progress value={stats.progress} aria-label="Overall roadmap progress" />
    </div>
  )
}
