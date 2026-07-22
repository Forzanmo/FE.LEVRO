import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import type { HeatmapDay } from '@/features/dashboard/types'
import { cn } from '@/lib/utils'

// Intensity as a color-mix of --brand (which flips dark↔light per theme), so
// "more active = more prominent" reads correctly on both surfaces. Level 0 is a
// neutral empty cell.
const LEVEL_BG = [
  'bg-muted',
  'bg-[color-mix(in_oklab,var(--brand)_28%,transparent)]',
  'bg-[color-mix(in_oklab,var(--brand)_50%,transparent)]',
  'bg-[color-mix(in_oklab,var(--brand)_74%,transparent)]',
  'bg-brand',
] as const

/** Activity heatmap: 13 weeks of daily engagement, anchored by the current streak. */
export function ActivityHeatmapCard({
  days,
  streakDays,
}: {
  days: HeatmapDay[]
  streakDays: number
}) {
  const activeDays = days.filter((d) => d.level > 0).length

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Activity</CardTitle>
        <CardAction>
          <span className="bg-warning-muted text-warning inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
            <Icon name="streak" size="xs" />
            {streakDays}-day streak
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="overflow-x-auto pb-1">
          <div
            className="grid grid-flow-col grid-rows-[repeat(7,0.75rem)] gap-1"
            role="img"
            aria-label={`${activeDays} active days in the last 13 weeks. Current streak: ${streakDays} days.`}
          >
            {days.map((d) => (
              <span
                key={d.date}
                aria-hidden="true"
                title={`${d.date} — ${d.level === 0 ? 'no activity' : `activity level ${d.level} of 4`}`}
                className={cn('size-3 rounded-[3px]', LEVEL_BG[d.level])}
              />
            ))}
          </div>
        </div>
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>
            <span className="text-foreground font-medium tabular-nums">{activeDays}</span> active days
          </span>
          <span className="inline-flex items-center gap-1">
            Less
            {[0, 1, 2, 3, 4].map((l) => (
              <span key={l} className={cn('size-3 rounded-[3px]', LEVEL_BG[l])} />
            ))}
            More
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
