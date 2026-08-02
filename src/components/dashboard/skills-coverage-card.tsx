import Link from 'next/link'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/typography'
import type { SkillStrength, SkillsSummary } from '@/features/dashboard/types'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

/**
 * The dashboard's lead: how well the user's skills are evidenced for the role
 * they are chasing.
 *
 * This replaced a single Career Readiness Score. A number told the user where
 * they ranked; this tells them what is actually missing from their documents,
 * which is the thing they can act on. Every row carries its reasoning — a
 * strength label on its own is a verdict, and the product's whole stance is
 * evidence over assertion.
 */

/**
 * Meaning is carried by the text chip; the dot is reinforcement, never the only
 * signal — so this reads correctly to someone who cannot distinguish the hues.
 * No icon field: an icon beside a label that already says "Well evidenced" is
 * redundant chrome, and the row has to stay scannable at 5+ skills.
 *
 * These are OUTLINED, and that is load-bearing. The rule predates the navy
 * identity, when the earned colour was gold and sat a pixel away from `warning`
 * amber — a filled amber "Thin" pill and a filled gold "5-day streak" pill on
 * the same dashboard were visually the same object meaning opposite things. The
 * distinction is shape, not hue: filled = earned, outlined = status. That
 * survives dark mode, and it survives not being able to tell the two hues apart
 * at all, which is why it is kept now that the earned colour is teal.
 *
 * `strong` is `achievement`, not `success`. A skill your CV finally evidences is
 * an earned state, which is exactly what `achievement` means; `success` means an
 * operation completed (saved, sent). They were the same thing only while
 * `achievement` was a colour nobody used.
 */
const STRENGTH_META: Record<SkillStrength, { label: string; dot: string; chip: string }> = {
  strong: {
    label: 'Well evidenced',
    dot: 'bg-achievement',
    chip: 'border-achievement/40 text-achievement',
  },
  partial: {
    label: 'Thin',
    dot: 'bg-warning',
    chip: 'border-warning/45 text-warning',
  },
  missing: {
    label: 'Not shown',
    dot: 'bg-muted-foreground/45',
    chip: 'border-border text-muted-foreground',
  },
}

/** Skills the user can act on, in the order the card already sorts them. */
export const GAP_STRENGTHS: SkillStrength[] = ['missing', 'partial']

const ORDER: SkillStrength[] = ['missing', 'partial', 'strong']

export function SkillsCoverageCard({ skills }: { skills: SkillsSummary }) {
  // Gaps first. The reason to open this card is to find what to fix, and
  // burying the missing skills under the strong ones inverts that.
  const rows = [...skills.skills].sort(
    (a, b) => ORDER.indexOf(a.strength) - ORDER.indexOf(b.strength),
  )
  const strong = skills.skills.filter((s) => s.strength === 'strong').length

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Skills for {skills.targetRole}</CardTitle>
        <CardDescription>
          What your CV and cover letters currently prove — {strong} of {skills.skills.length} well
          evidenced.
        </CardDescription>

        {/*
         * The same segmented meter the marketing hero shows.
         *
         * The landing page's example panel renders this exact object for this
         * exact number, and then the product a visitor signed up for stated the
         * same thing as a clause at the end of a sentence. Delivering the shape
         * that was promised is worth more here than any new ornament: this is
         * the "where do I stand" moment the whole product is organised around,
         * and it was the only card on the dashboard without a visual answer.
         *
         * Segmented, not continuous, for the reason the marketing panel is —
         * the quantity is a count of discrete skills, and a smooth bar would
         * imply a precision the assessment does not claim.
         */}
        <div
          className="mt-3 flex gap-1"
          role="img"
          aria-label={`${strong} of ${skills.skills.length} skills well evidenced`}
        >
          {skills.skills.map((skill, i) => (
            <span
              key={skill.id}
              className={cn(
                'meter-segment h-1.5 flex-1 rounded-full',
                i < strong ? 'bg-achievement' : 'bg-progress-track',
              )}
              style={{ animationDelay: `${i * 55}ms` }}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {rows.map((skill) => {
            const meta = STRENGTH_META[skill.strength]
            return (
              <AccordionItem key={skill.id} value={skill.id}>
                <AccordionTrigger className="py-3.5 hover:no-underline">
                  {/* `min-w-0` belongs on THIS flex child, not only on the inner
                      span. Without it the trigger keeps `min-width: auto`, so
                      the card's min-content width was 377px against a 358px
                      track and /dashboard was the one route with horizontal
                      overflow at 390px. */}
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-3 pr-3 text-left">
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={cn('size-2 shrink-0 rounded-full', meta.dot)}
                      />
                      {/* Wraps rather than truncates. At 390px the chip takes
                          ~110px, leaving too little for "React & component
                          architecture" — and the skill name is the row. */}
                      <span className="line-clamp-2 text-sm font-medium">{skill.label}</span>
                    </span>
                    <span
                      className={cn(
                        'shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium',
                        meta.chip,
                      )}
                    >
                      {meta.label}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <Text size="sm" tone="muted" measure="prose">
                    {skill.evidence}
                  </Text>
                  {/*
                   * The row used to stop at the diagnosis. Telling an anxious
                   * job-seeker "System design — Not shown" and giving them
                   * nowhere to go is the Memory Bridge: they have to hold the
                   * verdict, leave, pick one of eight destinations, and work out
                   * what to write. The remedy belongs where the problem is named.
                   */}
                  {GAP_STRENGTHS.includes(skill.strength) ? (
                    <Button asChild variant="outline" size="sm" className="mt-3">
                      <Link href={ROUTES.resume}>
                        Add evidence to your CV
                        <Icon name="arrow-right" size="xs" />
                      </Link>
                    </Button>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </CardContent>
    </Card>
  )
}
