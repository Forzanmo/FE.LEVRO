import { SHEET_INK, SHEET_SURFACE } from '@/components/documents/document-sheet'
import { Heading, Text } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

/**
 * The page's one committed idea, and the section it was missing.
 *
 * Between the hero and the closing band there used to be roughly 2,900px
 * containing no artefact, no image and no change of colour — three text
 * sections in a row. Two independent reviews named that dead zone, and both
 * named the same cause: the only thing on this page a competitor could not
 * ship by Friday is the quoted CV line, and it appeared exactly once, inside
 * one card, in a 22rem column.
 *
 * So this section is not new decoration. It is that same idea made structural,
 * and it follows the SAME PERSON as the hero panel. Up there, the Marketing
 * Coordinator's "Budget ownership" reads Thin. Here is the mechanism that
 * changes it: what the coach asked, what she said, the line Levvro wrote from
 * it, and the verdict that line earns. One continuous story across the page
 * rather than five interchangeable blocks.
 *
 * That chain is the product. Nobody can copy it with a screenshot, because it
 * is not a screenshot — it is the argument.
 *
 * Everything here is inside the documented system: the shared document sheet,
 * the achievement/warning roles, hairlines. No new colour, radius or shadow.
 */

const ASKED = 'What’s the one thing holding you back most right now?'
const ANSWERED =
  'I ran our paid social for two quarters but I have no idea how to put that on a CV without sounding like I’m bragging.'
const WROTE =
  'Owned the paid-social budget across two quarters, cutting cost-per-lead 22% while holding spend flat.'

export function GapClosing() {
  return (
    /*
     * OPAQUE, and that is a contrast requirement rather than a style choice.
     *
     * Left transparent, this band sat over the fixed BrandBackdrop's navy tint
     * pool, and the composite came out at #ecf1f7 — which put the amber "Thin"
     * chip at 4.42:1, just under AA. It is the same lesson the sticky bars
     * taught twice: text over a decorative layer has a background nobody can
     * predict. On `background` the same chip measures 4.84:1.
     *
     * The chevron field is re-laid locally at the backdrop's own alpha, so
     * making the surface knowable does not cost the section its texture.
     */
    <section className={cn('bg-background border-border relative isolate border-y')}>
      <div
        aria-hidden="true"
        className="chevron-field pointer-events-none absolute inset-0 -z-10 text-[var(--brand-900)] opacity-[0.026] dark:text-white dark:opacity-[0.05]"
      />
      <div className="mx-auto w-full max-w-[var(--content-max-width)] px-5 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <div>
            <Heading level={2} size="display-sm">
              One gap, closing
            </Heading>
            <Text tone="muted" size="lg" measure="lead" className="mt-4">
              The same CV from the top of this page. Its weakest skill, and the four steps that turn
              it into something a recruiter can check.
            </Text>
          </div>

          {/*
           * An ordered list, because this genuinely is a sequence and the order
           * carries the information — the same reason the three steps above are
           * numbered and the feature list is not.
           *
           * The rail is the composition: a single hairline down the left with
           * the four moments hung off it, so the eye reads it as one continuous
           * movement rather than four cards. Cards would have made this the
           * fourth grid on the page.
           */}
          <ol className="border-border relative space-y-8 border-l pl-6 sm:pl-8">
            <li>
              <span className={cn('block text-xs font-medium', 'text-muted-foreground')}>
                Levvro asked
              </span>
              <Text as="p" size="lg" measure="prose" className="mt-1 text-pretty">
                {ASKED}
              </Text>
            </li>

            <li>
              <span className="text-muted-foreground block text-xs font-medium">She answered</span>
              <Text as="p" measure="prose" tone="muted" className="mt-1 text-pretty italic">
                “{ANSWERED}”
              </Text>
            </li>

            <li>
              <span className="text-muted-foreground block text-xs font-medium">
                Levvro wrote, and put it on the sheet
              </span>
              {/*
               * On the actual document surface, not in a styled quote. The
               * product's output is a piece of paper someone emails to a
               * recruiter, and showing it on anything else would be describing
               * the product instead of showing it.
               */}
              <div className={cn('mt-2 rounded-xl p-4 shadow-sm sm:p-5', SHEET_SURFACE)}>
                <p className={cn('text-xs font-semibold tracking-caps uppercase', SHEET_INK.muted)}>
                  Experience · Growth Assistant
                </p>
                <p className={cn('mt-2 text-sm leading-relaxed', SHEET_INK.body)}>{WROTE}</p>
              </div>
            </li>

            <li>
              <span className="text-muted-foreground block text-xs font-medium">
                Budget ownership now reads
              </span>
              {/*
               * The verdict flipping is the payoff, and it is the only place on
               * the page where two states of the same chip sit side by side —
               * which is what makes the change legible rather than asserted.
               */}
              <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="border-warning/45 text-warning rounded-full border px-2 py-0.5 text-xs font-medium line-through">
                  Thin
                </span>
                <span aria-hidden="true" className="text-muted-foreground">
                  &rarr;
                </span>
                <span className="border-achievement/40 text-achievement rounded-full border px-2 py-0.5 text-xs font-medium">
                  Evidenced
                </span>
                <Text as="span" size="sm" tone="muted">
                  because the line names a scope, a number and a period.
                </Text>
              </p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
