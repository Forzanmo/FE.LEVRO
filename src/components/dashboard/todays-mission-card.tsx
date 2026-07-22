import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import type { Mission } from '@/features/dashboard/types'
import { ROUTES } from '@/lib/constants/routes'

/**
 * The dashboard's momentum lead: the single highest-leverage next action.
 * A full-width horizontal banner (stacks on mobile) so "what do I do next"
 * leads over the raw score — momentum over metrics.
 */
export function TodaysMissionCard({ mission }: { mission: Mission }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="bg-gradient-brand absolute inset-x-0 top-0 h-0.5" aria-hidden="true" />
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <span className="bg-brand-muted text-brand grid size-11 shrink-0 place-items-center rounded-xl">
            <Icon name={mission.icon} size="md" />
          </span>
          <div className="space-y-1">
            <Text
              as="span"
              size="xs"
              tone="brand"
              weight="semibold"
              tracking="wide"
              className="uppercase"
            >
              Today&rsquo;s Mission
            </Text>
            <Heading level={2} size="xl">
              {mission.title}
            </Heading>
            <Text tone="muted" size="sm" className="max-w-prose">
              {mission.description}
            </Text>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:shrink-0 sm:items-end">
          <div className="text-muted-foreground flex items-center gap-4 text-xs">
            <span className="inline-flex items-center gap-1">
              <Icon name="zap" size="xs" tone="warning" />
              {mission.xp} XP
            </span>
            <span className="inline-flex items-center gap-1">
              <Icon name="clock" size="xs" />~{mission.estimatedMinutes} min
            </span>
          </div>
          <Button asChild variant="gradient" fullWidth className="sm:w-auto">
            <Link href={ROUTES.roadmap}>
              Start mission
              <Icon name="arrow-right" size="sm" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
