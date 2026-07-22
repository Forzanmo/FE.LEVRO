import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/typography'
import { ROUTES } from '@/lib/constants/routes'
import type { ApplicationsSummary } from '@/features/dashboard/types'
import { cn } from '@/lib/utils'

/** Priority #8 widget: applications funnel at a glance. */
export function ApplicationsCard({ summary }: { summary: ApplicationsSummary }) {
  const stats = [
    { label: 'Total', value: summary.total, tone: 'text-foreground' },
    { label: 'Interviewing', value: summary.interviewing, tone: 'text-info' },
    { label: 'Offers', value: summary.offers, tone: 'text-success' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Applications</CardTitle>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.applications}>
              View all
              <Icon name="chevron-right" size="xs" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="divide-border grid grid-cols-3 divide-x">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-0.5 px-2 text-center first:pl-0 last:pr-0">
              <div
                className={cn('font-heading text-3xl leading-none font-semibold tabular-nums', stat.tone)}
              >
                {stat.value}
              </div>
              <Text as="span" size="xs" tone="muted">
                {stat.label}
              </Text>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
