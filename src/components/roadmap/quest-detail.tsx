'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon, type IconName } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import type { QuestNodeWithStatus, QuestStatus } from '@/features/roadmap/types'
import { cn } from '@/lib/utils'

const STATUS_META: Record<QuestStatus, { label: string; tone: string; icon: IconName }> = {
  completed: { label: 'Completed', tone: 'bg-success-muted text-success', icon: 'success' },
  available: { label: 'Available now', tone: 'bg-brand-muted text-brand', icon: 'zap' },
  locked: { label: 'Locked', tone: 'bg-muted text-muted-foreground', icon: 'lock' },
}

/** Inline detail for the selected quest (no modal — progressive by design). */
export function QuestDetail({
  node,
  requiresLabels,
  onComplete,
}: {
  node: QuestNodeWithStatus | null
  requiresLabels: string[]
  onComplete: (id: string) => void
}) {
  if (!node) {
    return (
      <Card>
        <CardContent className="text-muted-foreground flex min-h-[11rem] items-center justify-center text-center text-sm">
          Select a quest on the map to see what it takes.
        </CardContent>
      </Card>
    )
  }

  const meta = STATUS_META[node.status]

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={cn('grid size-10 shrink-0 place-items-center rounded-lg', meta.tone)}>
              <Icon name={node.icon} size="sm" />
            </span>
            <div className="space-y-1">
              <Heading level={2} size="lg">
                {node.title}
              </Heading>
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                  meta.tone,
                )}
              >
                <Icon name={meta.icon} size="xs" />
                {meta.label}
              </span>
            </div>
          </div>
          <span className="text-brand shrink-0 text-sm font-semibold tabular-nums">+{node.xp} XP</span>
        </div>

        <Text tone="muted" size="sm">
          {node.description}
        </Text>

        {node.status === 'locked' && requiresLabels.length > 0 ? (
          <div className="bg-muted/60 rounded-lg px-3 py-2 text-sm">
            <span className="text-muted-foreground">Unlocks after: </span>
            {requiresLabels.join(', ')}
          </div>
        ) : null}

        {node.status === 'available' ? (
          <Button
            variant="gradient"
            fullWidth
            onClick={() => onComplete(node.id)}
            leftIcon={<Icon name="check" size="sm" />}
          >
            Complete quest
          </Button>
        ) : node.status === 'completed' ? (
          <Button variant="outline" fullWidth disabled leftIcon={<Icon name="success" size="sm" />}>
            Completed
          </Button>
        ) : (
          <Button variant="outline" fullWidth disabled leftIcon={<Icon name="lock" size="sm" />}>
            Locked
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
