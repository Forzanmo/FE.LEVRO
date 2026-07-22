import { Text } from '@/components/ui/typography'
import { PIPELINE_STAGES, STATUS_META, type AppStatus } from '@/features/applications/status'
import type { Application } from '@/features/applications/types'
import { cn } from '@/lib/utils'

const STAGE_BAR: Record<AppStatus, string> = {
  applied: 'bg-muted-foreground/50',
  screening: 'bg-info',
  interview: 'bg-brand',
  offer: 'bg-success',
  rejected: 'bg-destructive',
}

/** Pipeline funnel — counts per stage with a proportion bar. Product data, not decoration. */
export function PipelineSummary({ applications }: { applications: Application[] }) {
  const total = applications.length

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {PIPELINE_STAGES.map((stage) => {
        const count = applications.filter((a) => a.status === stage).length
        return (
          <div key={stage} className="bg-card ring-foreground/10 rounded-xl p-4 ring-1">
            <Text as="span" size="sm" tone="muted">
              {STATUS_META[stage].label}
            </Text>
            <div className="font-heading mt-1 text-2xl font-semibold tabular-nums">{count}</div>
            <div className="bg-muted mt-2 h-1 overflow-hidden rounded-full">
              <div
                className={cn('h-full rounded-full transition-all duration-500', STAGE_BAR[stage])}
                style={{ width: total ? `${(count / total) * 100}%` : '0%' }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
