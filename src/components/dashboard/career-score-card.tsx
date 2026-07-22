import { ProgressRing } from '@/components/shared/progress-ring'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Text } from '@/components/ui/typography'
import type { CareerScore } from '@/features/dashboard/types'
import { cn } from '@/lib/utils'

/** Priority #1 dashboard widget: the Career Readiness Score, always explained. */
export function CareerScoreCard({ score }: { score: CareerScore }) {
  const positive = score.delta >= 0

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Career Readiness Score</CardTitle>
        <CardDescription>Your recruiter-readiness — with the reasoning behind every point.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="relative grid place-items-center">
            {/* Soft brand aura so the ring glows off the surface. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 m-auto size-52 rounded-full opacity-70 blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, color-mix(in oklab, var(--gradient-via) 28%, transparent), transparent 70%)',
              }}
            />
            <ProgressRing
              value={score.overall}
              size={184}
              strokeWidth={15}
              label="Career readiness score"
            >
              <div className="relative">
                <div className="font-heading text-6xl leading-none font-semibold tabular-nums">
                  {score.overall}
                </div>
                <Text
                  as="span"
                  size="xs"
                  tone="muted"
                  tracking="wide"
                  className="mt-1.5 block uppercase"
                >
                  out of 100
                </Text>
              </div>
            </ProgressRing>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
              // Never render a score dip in judging red — a calm amber keeps the
              // Warming-Score Rule intact on the most anxious widget.
              positive ? 'bg-success-muted text-success' : 'bg-warning-muted text-warning',
            )}
          >
            <Icon name={positive ? 'trending' : 'trending-down'} size="xs" />
            {positive ? '+' : ''}
            {score.delta} pts since last check
          </span>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {score.categories.map((category) => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="py-3 hover:no-underline">
                <span className="flex flex-1 flex-col gap-2 pr-3 text-left">
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium">{category.label}</span>
                    <span className="text-muted-foreground text-sm font-semibold tabular-nums">
                      {category.score}
                    </span>
                  </span>
                  {/* Decorative reinforcement — the label + score in the trigger
                      are already announced; hide the bar so the accordion button's
                      accessible name isn't polluted by a nested progressbar. */}
                  <Progress value={category.score} className="h-1.5" aria-hidden="true" />
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Text size="sm" tone="muted">
                  {category.reasoning}
                </Text>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
