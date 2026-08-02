import Link from 'next/link'

import { Logo } from '@/components/layout'
import { BrandMark } from '@/components/layout/brand-mark'
import { AssessmentPanel } from '@/components/marketing/assessment-panel'
import { GapClosing } from '@/components/marketing/gap-closing'
import { MobileNav, type MarketingNavLink } from '@/components/marketing/mobile-nav'
import { BrandBackdrop } from '@/components/shared/brand-backdrop'
import { SkipLink } from '@/components/shared/skip-link'
import { Reveal } from '@/components/shared/reveal'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

/*
 * Section order follows the question a stranger asks next, not the order the
 * marketing team wrote the copy in: what is this (hero) → how does it work
 * (mechanism) → why believe you (trust) → what exactly do I get (spec) → start.
 *
 * "What you get" used to come before "How it works", which listed four
 * capabilities to someone who did not yet know what the product does.
 */

const NAV_LINKS: readonly MarketingNavLink[] = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'What you get', href: '#features' },
]

/**
 * The number of questions the assessment asks.
 *
 * Hardcoded rather than imported from `coach-service`, which would pull the
 * whole ASSESSMENT dataset into the landing page bundle to read one integer —
 * on the page that dropped a 31KB font for eight glyphs.
 *
 * The service's own comment records that a hardcoded count went stale once
 * before ("Eight questions" while the assessment asked seven). The guard
 * against that is not an import, it is `e2e/marketing-mobile.spec.ts`, which
 * asserts this number against `COACH_QUESTION_COUNT` and fails the moment a
 * question is added or removed.
 */
const QUESTION_COUNT = 7

const HOW_IT_WORKS: { title: string; body: string }[] = [
  {
    title: 'Tell us where you are',
    /*
     * Leads with the reassurance and quotes the real first question.
     *
     * "No forms, no guessing, no judgment" is the sentence this audience most
     * needs and it used to be the third clause, in muted grey, below the fold,
     * inside a horizontal scroller — the least prominent copy in its own
     * section. And the fear behind "a coaching conversation" is that it is a job
     * interview in disguise; the actual first question is reassuringly ordinary,
     * so showing it is worth more than describing it. It is verbatim from
     * `coach-service.ts`.
     */
    body: `No forms, no guessing, no judgment. ${QUESTION_COUNT} questions, one at a time — it opens with “Where are you in your career right now?” — and each one explains why it is asked.`,
  },
  {
    title: 'See what your CV proves',
    body: 'Your skills mapped against the role you want, each one marked as evidenced, thin, or absent — with the reason it reads that way.',
  },
  {
    title: 'Send the version that proves it',
    body: 'Levvro writes the CV and the matching cover letter, in the template that suits where you are applying. Every version stays saved and reusable.',
  },
]

/*
 * These answer objections. They used to assert virtues.
 *
 * The band previously read: every verdict shows its reasoning (the panel
 * demonstrates that three folds up), an ATS template, free to start (the hero
 * microcopy already says it), built for juniors and career shifters (the hero
 * eyebrow already says it verbatim). Two of four were repeats and one was a
 * claim the page had already proved — so the row spent its whole width on
 * things a reader had either seen or did not doubt.
 *
 * What an anxious reader actually wants to know before clicking is how long
 * this takes, what it will ask them, and whether they can get out. Every line
 * below is checkable in the code: the count, the first question verbatim, and
 * the skip/back/edit capability the coach's own intro promises.
 */
const REASSURANCES: { label: string; href?: string }[] = [
  { label: `${QUESTION_COUNT} questions, one at a time` },
  { label: 'Skip, go back, or edit any answer' },
  { label: 'Your CV and your data — read how we handle both', href: ROUTES.privacy },
  { label: 'An ATS template, because most CVs are machine-read first' },
]

const FEATURES: { title: string; body: string }[] = [
  {
    title: 'AI Coach',
    body: 'One question at a time — it always explains why it is asking, and never wastes your time. Your answers become the evidence everything else is built from.',
  },
  {
    title: 'Skills, proven or not',
    body: 'Every skill your target role asks for, marked against what your documents actually show.',
  },
  {
    title: 'Three CV templates',
    body: 'Minimalist, Designer, and ATS — with the trade-offs stated, so the choice is informed.',
  },
  {
    title: 'One document library',
    body: 'Every CV and cover letter you have written, kept with the role it was written for, ready to reuse.',
  },
]

/*
 * The "Product" column used to be four deep links into authenticated routes, so
 * every one of them bounced a logged-out visitor — the only people who read a
 * marketing footer — to the sign-in screen. It now points at the sections of
 * this page that actually explain the product, and offers one honest way in.
 */
const FOOTER_SECTIONS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'What you get', href: '#features' },
      { label: 'Sign in', href: ROUTES.signIn },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: `mailto:${siteConfig.contactEmail}` },
      { label: 'Privacy', href: ROUTES.privacy },
      { label: 'Terms', href: ROUTES.terms },
    ],
  },
]

const SHELL = 'mx-auto w-full max-w-[var(--content-max-width)] px-5 sm:px-6 lg:px-8'

/**
 * The header belongs to the drenched fold, so it is the same theme-invariant
 * navy — not a light bar sitting on top of a dark hero, which read as a seam and
 * undercut the commitment.
 *
 * It stays OPAQUE. A translucent sticky bar composites over whatever happens to
 * be scrolling beneath it, and that cannot be made accessible: at the previous
 * `/50` the near-black "Sign in" label landed on the dark CTA band at ~1.3:1.
 * Being its own fixed surface means its contrast is knowable.
 *
 * Each child is told explicitly how to render on the navy, rather than a blanket
 * descendant override on the container — see the note on `Logo`'s `tone` prop
 * for why that shortcut is a trap.
 */
function MarketingHeader() {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-white/10 bg-brand-surface">
      <div className={cn(SHELL, 'flex h-16 items-center justify-between gap-3')}>
        <Logo tone="onBrand" />

        {/* Two links, and only from md up. Below that they move into the sheet
            rather than shrinking into a row of cramped targets. */}
        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="focus-visible:ring-brand-surface-accent inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-white/80 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden md:block [&_button:hover]:bg-white/10 [&_button]:text-white">
            <ThemeToggle />
          </div>
          {/*
           * A LINK, not a second button.
           *
           * A ghost "Sign in" and a filled "Get started" sat 8px apart and both
           * resolved to `/sign-in`, presenting new-versus-returning — the only
           * distinction a first-time visitor cares about — as a choice that does
           * not exist. `mobile-nav.tsx` identifies this exact pattern, explains
           * why it is dishonest and fixes it inside the sheet; the header three
           * lines away still shipped it. One button, one quieter link.
           */}
          <Link
            href={ROUTES.signIn}
            className="focus-visible:ring-brand-surface-accent hidden h-9 items-center rounded-lg px-2 text-sm text-white/80 underline-offset-4 outline-none transition-colors hover:text-white hover:underline focus-visible:ring-2 md:inline-flex"
          >
            Sign in
          </Link>
          {/* The one action that never moves, at every width. `h-11` below `sm`:
              the sheet architecture exists to avoid sub-44px targets, and this
              was the one control it keeps outside the sheet, at 32px. */}
          <Button
            asChild
            size="sm"
            className="text-brand-900 h-11 bg-white px-4 hover:bg-white/90 sm:h-8"
          >
            <Link href={ROUTES.signIn}>Get started</Link>
          </Button>
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  )
}

export default function HomePage() {
  return (
    <div className="relative flex min-h-svh flex-col">
      <SkipLink />
      {/* The page's texture layer for everything below the drenched fold. */}
      <BrandBackdrop />

      <MarketingHeader />

      <main id="main-content" className="flex-1">
        {/*
         * The hero fold is DRENCHED, and it is the page's one committed move.
         *
         * The band is theme-INVARIANT navy, like the CTA band: a hero that
         * inverts between themes cannot commit to a colour, and the whole point
         * of Committed is that the colour carries the brand.
         *
         * Its background is built in layers rather than washed: the navy base,
         * one light source from the upper right, the mark used as an oversized
         * watermark, and the chevron field rising over all of it. Every layer is
         * either the brand's own geometry or a single directional light — there
         * is no blurred blob anywhere on this page, because a blurred blob is
         * the one background every generated landing page already has.
         */}
        <section className="relative isolate overflow-hidden bg-brand-surface text-white">
          {/* Layer 2 — one light, from the upper right, and the floor falling
              away into deeper navy at the lower left. One source, one direction. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(58% 46% at 82% 2%,' +
                ' color-mix(in oklab, var(--accent-500) 22%, transparent), transparent 72%),' +
                'radial-gradient(70% 60% at 6% 104%,' +
                ' color-mix(in oklab, var(--brand-950) 85%, transparent), transparent 72%)',
            }}
          />

          {/* Layer 3a — the mark itself, oversized and cropped by the fold's own
              edge. A watermark of the logo, which is what a brand puts here, and
              not an abstract shape floating for atmosphere. */}
          <BrandMark
            tone="onBrand"
            className="pointer-events-none absolute -right-16 -bottom-24 -z-10 w-[26rem] opacity-[0.05] sm:-right-20 sm:w-[34rem] lg:-right-24 lg:w-[44rem]"
          />

          {/* Layer 3b + 4 — the chevron field, rising. */}
          <div
            aria-hidden="true"
            className="chevron-field chevron-drift pointer-events-none absolute inset-x-0 -inset-y-6 -z-10 text-white opacity-[0.055]"
          />

          <div
            className={cn(
              SHELL,
              'grid items-center gap-12 pt-12 pb-16',
              'sm:pt-16 sm:pb-20',
              /*
               * Asymmetric on purpose: the copy column takes the remainder, the
               * panel gets a fixed measure, and the two are not equal halves.
               *
               * Two steps, not one. At a single 30rem the measured columns were
               * 416/480 at 1024 and 512/480 at 1120 — the product shot was
               * WIDER than the headline it was supposed to support, on the most
               * common laptop width there is, and the intended asymmetry only
               * arrived at 1280. The copy leads at every width now.
               */
              'lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-12 lg:pt-24 lg:pb-28',
              'xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] xl:gap-16',
            )}
          >
            {/*
             * `min-w-0` on both grid children, and it is load-bearing.
             *
             * A grid item defaults to `min-width: auto`, so its track cannot
             * shrink below the item's min-content width. The panel contains
             * nowrap text, which makes its min-content the full width of the
             * longest un-breakable row — 350px. At a 320px viewport that made
             * the whole single-column hero track 350px wide, and because the
             * section is `overflow-hidden` there was no scrollbar to notice: the
             * headline and body copy were simply clipped off the right edge,
             * silently, on the narrowest phones. The identical bug is recorded
             * on the dashboard's skills card.
             */}
            <div className="hero-stagger min-w-0">
              {/*
               * Not the accent. "For juniors and career shifters" is an audience
               * label, not something the reader has earned, and DESIGN.md's
               * Teal-Is-Earned Rule is only worth anything if the flagship page
               * keeps it. Teal above the fold now appears exactly where evidence
               * does — the meter and the verdict chips — and in the wordmark.
               */}
              <p className="text-brand-surface-muted text-sm font-medium sm:text-base">
                For juniors and career shifters
              </p>

              {/*
               * Leading and tracking are relaxed from the size's own values
               * (1.08 / −0.02em) because this one is white on deep navy. Light
               * type on a dark ground reads lighter and tighter than the same
               * type on paper, and at 15.5:1 halation makes it worse rather
               * than better — the compensation belongs on all three axes, so
               * the weight steps up too. `Text` carries its own version of this
               * in `tone="onBrand"`; a heading cannot, because its leading is
               * per-size and a tone variant would clobber every step at once.
               */}
              <Heading
                level={1}
                size="display-lg"
                tone="inherit"
                className="mt-4 max-w-[16ch] leading-[1.14] font-bold tracking-[-0.014em]"
              >
                Know exactly what your CV proves.
              </Heading>

              {/*
               * `tone="onBrand"` carries the light-on-dark compensation; this
               * paragraph was setting its colour through `className` instead and
               * so received none of it — measured byte-identical to the same
               * 18px Geist on the light sections below. It is the paragraph
               * carrying the product's whole promise, and it was the one of four
               * committed-surface text runs that the fix missed.
               *
               * The colour override still wins over the tone's `text-white`
               * because it comes later through `cn`.
               */}
              <Text
                as="p"
                size="lg"
                measure="lead"
                tone="onBrand"
                className="text-brand-surface-muted mt-5 text-pretty"
              >
                Levvro reads it the way a recruiter does — then shows you every skill it proves,
                every skill it doesn&rsquo;t, and the line that decided each one.
              </Text>

              {/*
               * Mobile: the primary action is full width and 48px tall, sitting
               * directly under the thumb. Desktop: the pair sits inline. Not the
               * same buttons at two sizes — a different arrangement for a
               * different way of holding the device.
               */}
              <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="xl"
                  fullWidth
                  className="text-brand-900 bg-white shadow-lg hover:bg-white/90 sm:w-auto"
                >
                  <Link href={ROUTES.signIn}>
                    See what mine proves
                    <Icon name="arrow-right" size="sm" />
                  </Link>
                </Button>
                {/*
                 * The hairline stays at every width. It was `sm:ring-0` on the
                 * theory that position alone marks the secondary action on
                 * desktop — but at 1440 that leaves 16px of white text sitting
                 * 257px away from the primary with no edge of any kind, which
                 * reads as a caption, not a control. A 25% white ring is still
                 * unmistakably the lesser of the two.
                 */}
                <Button
                  asChild
                  size="xl"
                  variant="ghost"
                  fullWidth
                  className="text-white ring-1 ring-white/25 ring-inset hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  <Link href="#how-it-works">How it works</Link>
                </Button>
              </div>

              {/* Leads with the answer to "what am I about to be put through",
                  which is the question at the moment of clicking. Cost was
                  answered twice on this page and duration not at all. */}
              <p className="text-brand-surface-muted mt-6 text-sm">
                {QUESTION_COUNT} questions · Free to start · No credit card
              </p>
            </div>

            {/* Nudged down so the two columns do not sit on one baseline — the
                asymmetry is the composition, not an accident of the grid. */}
            <AssessmentPanel className="min-w-0 lg:mt-10" />
          </div>
        </section>

        {/*
         * How it works — a genuine ordered sequence, so it is built as one.
         *
         * Desktop reads it as three stations on a rail. Mobile reads it as a
         * swipeable deck: cards at 82% width so the next one is always visibly
         * peeking, which is what tells a thumb there is more without a row of
         * dots explaining it. Same DOM, same order, same semantics — one <ol>
         * that changes how it lays out, not two copies of the content.
         */}
        <section id="how-it-works" className={cn(SHELL, 'scroll-mt-20 py-20 sm:py-24 lg:py-28')}>
          {/*
           * No `Reveal` on section headings any more.
           *
           * Six sections all rising on scroll with the same 18px translate is
           * the saturated default, not choreography — it makes every section
           * equally important, which is the definition of flat. The one stagger
           * left on the page is the three steps below, because a list revealing
           * its own items in order is motion that means something.
           */}
          <div className="max-w-2xl">
            <Heading level={2} size="display-md">
              From uncertain to interviewing, in three steps
            </Heading>
            <Text tone="muted" size="lg" measure="lead" className="mt-4">
              No black box. Every step shows its reasoning, so you always know where you stand and
              what to do next.
            </Text>
          </div>

          <div className="deck-scope relative mt-12 md:mt-14">
            {/* The rail. Desktop only: on a horizontal deck a connecting line
                between cards would run through the gaps and read as a seam. */}
            <div
              aria-hidden="true"
              // Ends at the centre of the third marker rather than running the
              // full width: ~500px of rail past step 3 with nothing on it
              // implied a fourth step that does not exist.
              className="bg-border absolute top-[1.4375rem] left-0 hidden h-px md:right-[calc(33.333%-1.4375rem)] md:block"
            />
            {/*
             * `tabIndex={0}` + a label, because a scrollable region with no
             * focusable descendant is unreachable by keyboard — axe's
             * `scrollable-region-focusable`, and a genuine dead end: none of
             * these three cards contains a link, so without this there is no way
             * to read steps 2 and 3 without a pointer.
             *
             * It is applied unconditionally rather than only below `md`. The
             * cost on desktop is one extra tab stop on a labelled list; the cost
             * of getting it wrong on mobile is content nobody can reach.
             */}
            <ol
              tabIndex={0}
              aria-label="How it works, in three steps"
              className={cn(
                'deck-scroller -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2',
                // `snap-start` snaps to the scroll container's PADDING box, which
                // cancels the `px-5` and parked card 1 at x=0 while the heading
                // above it sat at x=20 — the page's single left edge visibly
                // breaking on the first screen after the hero. `scroll-padding`
                // is the one inset the snapport does respect.
                'scroll-pl-5 md:scroll-pl-0',
                '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
                'focus-visible:ring-ring rounded-lg outline-none focus-visible:ring-2',
                'md:mx-0 md:grid md:grid-cols-3 md:gap-10 md:overflow-visible md:px-0 md:pb-0',
              )}
            >
              {HOW_IT_WORKS.map((step, i) => (
                // `as="li"` — an <ol> may only contain <li>, so the animation
                // wrapper has to BE the list item rather than sit around it.
                <Reveal
                  key={step.title}
                  delay={i * 0.08}
                  as="li"
                  className="w-[82%] shrink-0 snap-start md:w-auto"
                >
                  <div className="flex h-full flex-col gap-5 md:gap-6">
                    <span className="bg-background ring-brand text-brand grid size-11.5 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums ring-2">
                      {i + 1}
                    </span>
                    <div className="space-y-2">
                      <Heading level={3} size="xl">
                        {step.title}
                      </Heading>
                      <Text tone="muted" measure="prose">
                        {step.body}
                      </Text>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>

            {/*
             * How far through the deck you have swiped. Scroll-driven from the
             * scroller's own position — no listener, no observer, no JS at all.
             * Mobile only: above `md` the three steps are a grid and there is
             * nothing to be partway through.
             *
             * Enhancement, not affordance. The cards are 82% wide so the next
             * one always peeks, which is what says "there is more"; this says
             * "how much more". Browsers without scroll timelines render nothing
             * rather than a bar parked at a third, which would be an indicator
             * that lies.
             */}
            <div
              aria-hidden="true"
              className="deck-progress bg-border mx-5 mt-1 h-0.5 overflow-hidden rounded-full"
            >
              <span className="deck-progress-bar bg-brand block h-full w-full rounded-full" />
            </div>
          </div>
        </section>

        {/* The page's one committed idea — see the note in the component. */}
        <GapClosing />

        {/*
         * Trust — four honest promises on a mist band.
         *
         * A band rather than four cards: these are statements, not features, and
         * boxing a statement makes it look like a product tile. The alternating
         * surface is the identity's own rhythm (white breathes, mist separates)
         * and it does the work a row of borders would otherwise have to.
         */}
        <section className="bg-muted/60 border-border border-y">
          <div className={cn(SHELL, 'py-10 sm:py-12')}>
            <div>
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                {REASSURANCES.map((item) => (
                  <li key={item.label} className="flex items-start gap-2.5">
                    {/* Navy, not teal. Four accent ticks on a band of ordinary
                        promises was the single largest source of pre-earned
                        teal on the page. */}
                    <Icon
                      name="success"
                      size="sm"
                      className="text-brand mt-0.5 shrink-0"
                      aria-hidden
                    />
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-block min-h-6 rounded-sm text-sm text-pretty underline-offset-4 outline-none transition-colors hover:underline focus-visible:ring-2"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <Text as="span" size="sm" tone="muted" className="text-pretty">
                        {item.label}
                      </Text>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/*
         * What you get — an editorial specimen list, deliberately NOT a card grid.
         *
         * This section and "how it works" used to be two consecutive icon +
         * heading + text grids. Individually each was defensible; stacked, they
         * were the default AI-SaaS page rendered in a new colour. Each now takes
         * a different form, chosen by what the content actually is: this is a set
         * of parallel capabilities, so it reads as a specification list —
         * hairlines, a held-still section heading, no chrome competing with the
         * words.
         */}
        <section id="features" className={cn(SHELL, 'scroll-mt-20 py-20 sm:py-24 lg:py-28')}>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-14">
            <div className="lg:sticky lg:top-28">
              {/* display-sm, not -md: in a narrow column the larger step wraps
                  to five lines and reads cramped rather than confident. */}
              <Heading level={2} size="display-sm">
                Four parts, and what each is for
              </Heading>
              {/*
               * The old heading was "Everything you need to become
               * recruiter-ready" over "Evidence-driven, never overwhelming.
               * Each screen has one clear goal." — the modal section heading in
               * this category, above a sentence of internal design-doc language
               * on a consumer page. A scared 22-year-old does not care how many
               * goals your screens have.
               */}
              <Text tone="muted" size="lg" measure="lead" className="mt-4">
                Each one answers a question you will actually ask. None of them is a template
                gallery.
              </Text>
            </div>

            <dl className="border-border divide-border divide-y border-t">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="grid gap-2 py-6 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-6"
                >
                  <dt>
                    <Heading level={3} size="lg">
                      {feature.title}
                    </Heading>
                  </dt>
                  <dd>
                    <Text tone="muted" measure="prose">
                      {feature.body}
                    </Text>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA band — the second committed brand surface, carrying the same
            layer stack as the hero so the page closes where it opened. */}
        <section className={cn(SHELL, 'pb-16 sm:pb-20')}>
          {/*
           * No `shadow-brand-glow` here. A teal halo around a near-black band
           * on a near-black page is the design system's own crypto/neon
           * *Don't*, applied to itself — and in dark mode it made the closing
           * CTA the brightest object on the page, out-shouting the committed
           * hero it was supposed to answer. The glow stays where it earns its
           * place: the primary button on hover.
           */}
          <div className="bg-brand-surface relative isolate overflow-hidden rounded-3xl px-6 py-12 text-center text-white sm:px-10 sm:py-14">
            {/*
             * `brand-surface`, and the hero's own light layer — not
             * `bg-gradient-brand-deep`.
             *
             * The two "committed brand surfaces" on this page were two
             * different navies: the hero at L 13.85 lit from the top right,
             * this band starting at L 29.74 — 2.15x the lightness — lit from
             * the top left. DESIGN.md's Committed-Surface Rule exists verbatim
             * to stop that ("three surfaces each having their own was how 'the
             * brand colour' ended up with three different values"), and the
             * comment here claimed "the same layer stack as the hero" while
             * carrying a different colour, a different gradient type and a
             * mirrored light. Now it is the same surface, lit the same way, so
             * the page genuinely closes where it opened.
             */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(58% 46% at 82% 2%,' +
                  ' color-mix(in oklab, var(--accent-500) 22%, transparent), transparent 72%)',
              }}
            />
            <div
              aria-hidden="true"
              className="chevron-field pointer-events-none absolute inset-0 -z-10 text-white opacity-[0.05]"
            />
            {/* Moving highlight sweep across the brand surface. */}
            <span aria-hidden="true" className="brand-sheen" />
            {/* Same light-on-dark compensation as the hero headline. */}
            <Heading
              level={2}
              size="display-md"
              tone="onBrand"
              className="relative mx-auto max-w-[20ch] leading-[1.18] font-bold tracking-[-0.008em]"
            >
              Stop guessing what recruiters see
            </Heading>
            {/* Full white, not white/85 — at 85% this measured 3.53:1 against
                  the band's lighter end while the sheen sweeps across it. */}
            <Text size="lg" tone="onBrand" className="relative mx-auto mt-4 max-w-xl text-pretty">
              Start with the assessment. You will see which skills your documents evidence before
              you rewrite a single line.
            </Text>
            <div className="relative mt-8 flex justify-center">
              <Button
                asChild
                size="xl"
                // `text-brand` is theme-reactive (pale steel in dark) and would
                // measure ~1.5:1 on this white pill. The brand RAMP is declared
                // once in :root, so brand-900 stays deep navy in both themes.
                className="text-brand-900 w-full bg-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-white/90 sm:w-auto"
              >
                {/* The same words as the hero's primary. A visitor scrolling
                      5,900px should recognise the door, not count new ones. */}
                <Link href={ROUTES.signIn}>
                  See what mine proves
                  <Icon name="arrow-right" size="sm" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-border border-t">
        <div
          className={cn(
            SHELL,
            'grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(2,1fr)]',
          )}
        >
          <div className="space-y-3">
            {/* `w-fit`: the link had no width constraint in its grid column and
                measured 487x36 at 1440 — a pointer region over empty space. */}
            <Logo className="w-fit" />
            <Text tone="muted" size="sm" className="max-w-xs">
              {siteConfig.description}
            </Text>
          </div>
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-3">
              <Text as="span" size="sm" weight="semibold">
                {section.title}
              </Text>
              {/* `min-h-6` on the link box, not the list item: these are
                  standalone navigation links, so WCAG 2.2 SC 2.5.8's
                  inline-text exception does not apply and an 18px-tall target
                  is a real failure. */}
              <ul className="space-y-0.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-8 items-center rounded-sm text-sm outline-none transition-colors focus-visible:ring-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-border border-t">
          <div
            className={cn(
              SHELL,
              'text-muted-foreground flex flex-col items-center justify-between gap-2 py-6 text-sm sm:flex-row',
            )}
          >
            <span>
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </span>
            <span>{siteConfig.tagline}</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
