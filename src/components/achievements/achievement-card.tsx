import { Card, CardContent } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Heading, Text } from '@/components/ui/typography'
import type { Achievement } from '@/features/achievements/types'
import { cn } from '@/lib/utils'

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const earned = achievement.status === 'earned'
  const locked = achievement.status === 'locked'

  return (
    <Card className={cn('h-full transition-shadow hover:shadow-md', locked && 'opacity-70')}>
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn(
              'grid size-12 shrink-0 place-items-center rounded-xl',
              earned
                ? 'bg-primary shadow-brand-glow text-primary-foreground'
                : locked
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-brand-muted text-brand',
            )}
          >
            <Icon
              name={locked ? 'lock' : achievement.icon}
              size="md"
              variant={earned ? 'filled' : 'outline'}
            />
          </span>
          {earned ? (
            <span className="bg-success-muted text-success inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium">
              <Icon name="success" size="xs" />
              Earned
            </span>
          ) : (
            <span className="text-muted-foreground text-xs font-medium tabular-nums">
              +{achievement.xp} XP
            </span>
          )}
        </div>

        <div className="flex-1 space-y-1">
          <Heading level={3} size="base">
            {achievement.title}
          </Heading>
          <Text tone="muted" size="sm">
            {achievement.description}
          </Text>
        </div>

        {achievement.status === 'in-progress' && achievement.progress ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium tabular-nums">
                {achievement.progress.current}/{achievement.progress.target}
              </span>
            </div>
            <Progress
              value={(achievement.progress.current / achievement.progress.target) * 100}
              aria-label={`${achievement.title} progress`}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
