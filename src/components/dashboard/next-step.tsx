import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/typography'
import type { SkillsSummary } from '@/features/dashboard/types'
import { ROUTES } from '@/lib/constants/routes'

/**
 * The one action on the dashboard.
 *
 * The populated dashboard rendered sixteen data points and zero buttons: it
 * diagnosed and then abandoned. PRODUCT.md's principle is "momentum over
 * metrics — progress and the next step lead", and the roadmap that used to be
 * the next-step mechanism was deleted with nothing put in its place.
 *
 * This is deliberately ONE affordance, not a restored roadmap: the single
 * highest-priority gap, named, with the reasoning already attached, and the
 * place that closes it. It renders nothing when there is nothing to fix —
 * inventing a task so the slot stays full would be the busywork the product's
 * "never waste the user's time" principle rules out.
 */
export function NextStep({ skills }: { skills: SkillsSummary }) {
  // Same precedence the card sorts by: never-shown before thin.
  const gap =
    skills.skills.find((s) => s.strength === 'missing') ??
    skills.skills.find((s) => s.strength === 'partial')

  if (!gap) return null

  return (
    <section
      aria-labelledby="next-step-heading"
      className="bg-brand-muted/50 ring-foreground/10 flex flex-col gap-4 rounded-xl px-5 py-4 ring-1 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 gap-3">
        <span className="bg-brand text-primary-foreground mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg">
          <Icon name="target" size="sm" />
        </span>
        <div className="min-w-0">
          <h2 id="next-step-heading" className="text-sm font-semibold">
            Next step
          </h2>
          {/*
           * The skill name, then its own evidence sentence — no editorial lead
           * in between. A generated "System design isn't shown anywhere in your
           * documents." immediately followed by the real evidence ("Not present
           * in any document. Common in Frontend Engineer postings you saved.")
           * said the same thing twice, and the invented half was the weaker one.
           */}
          <Text size="sm" tone="muted" className="mt-0.5 text-pretty">
            <span className="text-foreground font-medium">{gap.label}</span> — {gap.evidence}
          </Text>
        </div>
      </div>

      <Button asChild className="shrink-0 max-sm:w-full">
        <Link href={ROUTES.resume}>
          Add evidence
          <Icon name="arrow-right" size="sm" />
        </Link>
      </Button>
    </section>
  )
}
