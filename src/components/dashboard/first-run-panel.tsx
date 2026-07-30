import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Icon, type IconName } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import { ROUTES } from '@/lib/constants/routes'

/**
 * The dashboard before the assessment.
 *
 * This was a single dashed `EmptyState` box in an otherwise blank 1440×900
 * page, with about 70% of the viewport empty beneath it. For the audience
 * PRODUCT.md describes — anxious, first-time, deciding whether to trust this
 * with their career — emptiness reads as abandonment, and "Start my assessment"
 * with no indication of what it asks, how long it takes, or what comes out is a
 * lot to ask on faith.
 *
 * So it answers those three questions before asking for the click. It is one
 * panel, not a grid of feature cards: there is a single decision on this
 * screen, and the layout should say so.
 */
const OUTCOMES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'target',
    title: 'Which skills your CV proves',
    body: 'And which it only claims — each one with the line of evidence behind the verdict.',
  },
  {
    icon: 'resume',
    title: 'A CV drafted from your answers',
    body: 'Your own history in your own words, not a template with your name dropped in.',
  },
  {
    icon: 'cover-letter',
    title: 'Cover letters from the same evidence',
    body: 'Written per role, arguing from the things you actually told the coach.',
  },
]

export function FirstRunPanel() {
  return (
    <section className="bg-card ring-foreground/10 overflow-hidden rounded-xl ring-1">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-12 lg:p-10">
        <div className="flex flex-col justify-center">
          <span className="bg-brand-muted text-brand grid size-11 place-items-center rounded-xl">
            <Icon name="coach" size="md" />
          </span>

          <Heading level={2} size="2xl" className="mt-4">
            Start with a short conversation
          </Heading>

          <Text tone="muted" measure="lead" className="mt-2 text-pretty">
            Eight questions, one at a time — about the role you want and what you’ve actually
            done. The coach explains why it’s asking each one, and you can skip anything or stop
            and come back.
          </Text>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Button asChild size="lg">
              <Link href={ROUTES.coach}>
                Start my assessment
                <Icon name="arrow-right" size="sm" />
              </Link>
            </Button>
            <span className="text-muted-foreground inline-flex items-center gap-1.5 text-sm">
              <Icon name="clock" size="xs" />
              About 5 minutes
            </span>
          </div>
        </div>

        {/*
         * Plain rows, not cards. Three tiles inside this panel would be the
         * nested-card violation DESIGN.md bans outright, and the identical-card
         * grid the slop test flags — for content that is a list.
         */}
        <div className="lg:border-border lg:border-l lg:pl-12">
          <Text as="h3" size="sm" weight="medium" className="text-muted-foreground">
            What you get
          </Text>
          <ul className="mt-4 space-y-5">
            {OUTCOMES.map((outcome) => (
              <li key={outcome.title} className="flex gap-3">
                <span className="bg-muted text-muted-foreground mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg">
                  <Icon name={outcome.icon} size="sm" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{outcome.title}</span>
                  <Text tone="muted" size="sm" className="mt-0.5">
                    {outcome.body}
                  </Text>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
