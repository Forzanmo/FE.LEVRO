import { Card, CardContent } from '@/components/ui/card'
import { Icon, type IconName } from '@/components/ui/icon'
import { Text } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export type StatTone = 'brand' | 'success' | 'warning' | 'info' | 'neutral'

const toneSurface: Record<StatTone, string> = {
  // The brand stat is the row's hero. A deep-teal gradient (theme-independent
  // ramp values, not the flipping --brand role) keeps the white icon above the
  // 3:1 non-text-contrast bar in BOTH themes — the teal→gold gradient's gold end
  // dropped white icons below 3:1 (WCAG 1.4.11).
  brand: 'bg-gradient-brand-deep text-white shadow-sm ring-1 ring-inset ring-white/15',
  success: 'bg-success-muted text-success',
  warning: 'bg-warning-muted text-warning',
  info: 'bg-info-muted text-info',
  neutral: 'bg-muted text-muted-foreground',
}

export interface StatCardProps {
  label: string
  value: React.ReactNode
  icon?: IconName
  tone?: StatTone
  delta?: { value: string; trend: 'up' | 'down' | 'neutral' }
  className?: string
}

export function StatCard({ label, value, icon, tone = 'brand', delta, className }: StatCardProps) {
  return (
    <Card
      className={cn(
        'transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md',
        className,
      )}
    >
      <CardContent className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <Text as="span" size="xs" tone="muted" weight="medium">
            {label}
          </Text>
          <div className="font-heading text-3xl leading-none font-semibold tracking-tight tabular-nums">
            {value}
          </div>
          {delta ? (
            <span
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium',
                delta.trend === 'up' && 'bg-success-muted text-success',
                delta.trend === 'down' && 'bg-destructive-muted text-destructive',
                delta.trend === 'neutral' && 'text-muted-foreground',
              )}
            >
              {delta.trend !== 'neutral' ? (
                <Icon name={delta.trend === 'up' ? 'trending' : 'arrow-right'} size="xs" />
              ) : null}
              {delta.value}
            </span>
          ) : null}
        </div>
        {icon ? (
          <span
            className={cn(
              'grid size-10 shrink-0 place-items-center rounded-xl',
              toneSurface[tone],
            )}
          >
            <Icon name={icon} size="sm" />
          </span>
        ) : null}
      </CardContent>
    </Card>
  )
}
