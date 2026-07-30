import { Text } from '@/components/ui/typography'
import { STATUS_META, type AppStatus } from '@/features/applications/status'
import type { Application } from '@/features/applications/types'
import { cn } from '@/lib/utils'

/**
 * The pipeline at a glance: one segmented bar, every application accounted for.
 *
 * This was four identical stat cards in a `lg:grid-cols-4` row — a big mono
 * numeral, a label, a proportion bar, ×4. That is the hero-metric template, and
 * DESIGN.md records the achievements screen being deleted for exactly this shape
 * ("a hero-metric row above a twelve-tile identical grid"). Four aggregates
 * printed larger than the fourteen real applications underneath them also
 * inverts PRODUCT.md's "momentum over metrics — raw numbers serve that story
 * rather than becoming the point".
 *
 * It was also wrong. `PIPELINE_STAGES` excludes `rejected` while the proportion
 * bars divided by `applications.length`, which includes it — so the four counts
 * never summed to the rows in the table beneath, the bars could never reach
 * 100%, and a user's rejections silently vanished from their own summary. For a
 * product whose thesis is evidence over assertion, quietly deleting the bad
 * number is the wrong instinct: a rejection is the most real thing on this page.
 *
 * So: one object instead of four, `rejected` included as the terminal segment,
 * and the total stated outright so the arithmetic is checkable at a glance.
 */

/** Funnel order, closed last. Every status appears exactly once. */
const FUNNEL: AppStatus[] = ['applied', 'screening', 'interview', 'offer', 'rejected']

const STAGE_BAR: Record<AppStatus, string> = {
  applied: 'bg-muted-foreground/45',
  screening: 'bg-info',
  interview: 'bg-brand',
  offer: 'bg-success',
  rejected: 'bg-muted-foreground/25',
}

const STAGE_DOT: Record<AppStatus, string> = {
  applied: 'bg-muted-foreground/45',
  screening: 'bg-info',
  interview: 'bg-brand',
  offer: 'bg-success',
  rejected: 'bg-muted-foreground/25',
}

export function PipelineSummary({ applications }: { applications: Application[] }) {
  const total = applications.length
  const counts = FUNNEL.map((stage) => ({
    stage,
    count: applications.filter((a) => a.status === stage).length,
  }))
  const present = counts.filter((c) => c.count > 0)

  if (!total) return null

  /* One sentence carrying the whole picture, for anyone who cannot see the bar. */
  const summary = `${total} application${total === 1 ? '' : 's'}: ${counts
    .map(({ stage, count }) => `${count} ${STATUS_META[stage].label.toLowerCase()}`)
    .join(', ')}`

  return (
    <section aria-label="Pipeline summary" className="space-y-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <Text as="h2" size="sm" tone="muted">
          Your pipeline
        </Text>
        <Text as="span" size="sm" tone="muted">
          <span className="text-foreground font-mono font-semibold tabular-nums">{total}</span>{' '}
          {total === 1 ? 'application' : 'applications'} in total
        </Text>
      </div>

      {/*
        `role="img"` with the full read-out: the segments carry no text, and
        their meaning is otherwise only in colour. The chips below repeat every
        number in words, so nothing here depends on distinguishing teal from
        emerald.
      */}
      <div
        role="img"
        aria-label={summary}
        className="bg-muted flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full"
      >
        {present.map(({ stage, count }) => (
          <div
            key={stage}
            className={cn('h-full transition-[flex-grow] duration-500', STAGE_BAR[stage])}
            style={{ flexGrow: count }}
          />
        ))}
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
        {counts.map(({ stage, count }) => (
          <li key={stage} className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className={cn('size-2 shrink-0 rounded-full', STAGE_DOT[stage])}
            />
            <Text as="span" size="sm" tone={count ? 'default' : 'muted'}>
              <span className="font-mono font-semibold tabular-nums">{count}</span>{' '}
              <span className={cn(!count && 'opacity-80')}>{STATUS_META[stage].label}</span>
            </Text>
          </li>
        ))}
      </ul>
    </section>
  )
}
