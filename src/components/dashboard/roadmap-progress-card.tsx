import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Text } from '@/components/ui/typography'
import type { RoadmapProgress } from '@/features/dashboard/types'
import { ROUTES } from '@/lib/constants/routes'

/** Momentum widget: how far along the roadmap you are, and the next step. */
export function RoadmapProgressCard({ roadmap }: { roadmap: RoadmapProgress }) {
  const pct = Math.round((roadmap.completed / Math.max(1, roadmap.total)) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Roadmap</CardTitle>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href={ROUTES.roadmap}>
              View all
              <Icon name="chevron-right" size="xs" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="font-heading text-2xl font-semibold tabular-nums">
            {roadmap.completed}
            <span className="text-muted-foreground text-base font-medium"> / {roadmap.total}</span>
          </span>
          <Text as="span" size="sm" tone="muted">
            {pct}% complete
          </Text>
        </div>
        <Progress value={pct} aria-label="Roadmap completion" />
        <Text size="sm" tone="muted">
          Next: <span className="text-foreground font-medium">{roadmap.nextQuest}</span>
        </Text>
      </CardContent>
    </Card>
  )
}
