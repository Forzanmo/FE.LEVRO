import Link from 'next/link'

import { Logo } from '@/components/layout'
import { BrandMark } from '@/components/layout/brand-mark'
import { AssessmentPanel } from '@/components/marketing/assessment-panel'
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

const HOW_IT_WORKS: { title: string; body: string }[] = [
  {
    title: 'Tell us where you are',
    body: 'A short coaching conversation — one question at a time, always explaining why it asks. No forms, no guessing, no judgment.',
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

// Honest promises about the product — not fabricated testimonials or outcome stats.
const REASSURANCES: string[] = [
  'Every verdict shows its reasoning',
  'An ATS template, because most CVs are machine-read first',
  'Free to start — no credit card',
  'Built for juniors and career shifters',
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
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-white hover:bg-white/10 hover:text-white md:inline-flex"
          >
            <Link href={ROUTES.signIn}>Sign in</Link>
          </Button>
          {/* The one action that never moves, at every width. */}
          <Button asChild size="sm" className="text-brand-900 bg-white hover:bg-white/90">
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
              // Asymmetric on purpose: the copy column takes the remainder, the
              // panel gets a fixed measure, and the two are not equal halves.
              'lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-16 lg:pt-24 lg:pb-28',
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
              <p className="text-brand-surface-accent text-sm font-medium sm:text-base">
                For juniors and career shifters
              </p>

              <Heading level={1} size="display-lg" tone="inherit" className="mt-4 max-w-[16ch]">
                Know exactly what your CV proves.
              </Heading>

              <Text
                as="p"
                size="lg"
                measure="lead"
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
                 * The hairline exists only below `sm`. On desktop this sits
                 * beside a solid white button and reads as the secondary action
                 * from position alone. Full-width and centred on a phone, with
                 * no edge at all, it read as a caption under the primary button
                 * rather than as something tappable — the ring restores the
                 * affordance without giving it the weight of a second CTA.
                 */}
                <Button
                  asChild
                  size="xl"
                  variant="ghost"
                  fullWidth
                  className="text-white ring-1 ring-white/25 ring-inset hover:bg-white/10 hover:text-white sm:w-auto sm:ring-0"
                >
                  <Link href="#how-it-works">How it works</Link>
                </Button>
              </div>

              <p className="text-brand-surface-muted mt-6 text-sm">
                Free to start · No credit card · ATS-safe template included
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
          <Reveal className="max-w-2xl">
            <Heading level={2} size="display-md">
              From uncertain to interviewing, in three steps
            </Heading>
            <Text tone="muted" size="lg" measure="lead" className="mt-4">
              No black box. Every step shows its reasoning, so you always know where you stand and
              what to do next.
            </Text>
          </Reveal>

          <div className="relative mt-12 md:mt-14">
            {/* The rail. Desktop only: on a horizontal deck a connecting line
                between cards would run through the gaps and read as a seam. */}
            <div
              aria-hidden="true"
              className="bg-border absolute top-[1.4375rem] right-0 left-0 hidden h-px md:block"
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
                '-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2',
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
          </div>
        </section>

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
            <Reveal>
              <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                {REASSURANCES.map((label) => (
                  <li key={label} className="flex items-start gap-2.5">
                    <Icon
                      name="success"
                      size="sm"
                      className="text-achievement mt-0.5 shrink-0"
                      aria-hidden
                    />
                    <Text as="span" size="sm" tone="muted" className="text-pretty">
                      {label}
                    </Text>
                  </li>
                ))}
              </ul>
            </Reveal>
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
          <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-16">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                {/* display-sm, not -md: in a 24rem column the larger step wraps
                    to five lines and reads cramped rather than confident. */}
                <Heading level={2} size="display-sm">
                  Everything you need to become recruiter-ready
                </Heading>
                <Text tone="muted" size="lg" measure="lead" className="mt-4">
                  Evidence-driven, never overwhelming. Each screen has one clear goal.
                </Text>
              </div>
            </Reveal>

            {/* The Reveal wraps the whole list, not each row: a wrapper div
                between <dl> and its <dt>/<dd> pairs is invalid HTML. */}
            <Reveal>
              <dl className="border-border divide-border divide-y border-t">
                {FEATURES.map((feature) => (
                  <div
                    key={feature.title}
                    className="grid gap-2 py-7 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-8"
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
            </Reveal>
          </div>
        </section>

        {/* CTA band — the second committed brand surface, carrying the same
            layer stack as the hero so the page closes where it opened. */}
        <section className={cn(SHELL, 'pb-16 sm:pb-20')}>
          <Reveal>
            <div className="bg-gradient-brand-deep shadow-brand-glow relative isolate overflow-hidden rounded-3xl px-6 py-14 text-center text-white sm:px-10 sm:py-16">
              <div
                aria-hidden="true"
                className="chevron-field pointer-events-none absolute inset-0 -z-10 text-white opacity-[0.05]"
              />
              {/* Moving highlight sweep across the brand surface. */}
              <span aria-hidden="true" className="brand-sheen" />
              <Heading
                level={2}
                size="display-md"
                tone="onBrand"
                className="relative mx-auto max-w-[20ch]"
              >
                Find out what your CV proves
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
                  <Link href={ROUTES.signIn}>
                    Start your assessment
                    <Icon name="arrow-right" size="sm" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-border border-t">
        <div className={cn(SHELL, 'grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(2,1fr)]')}>
          <div className="space-y-3">
            <Logo />
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
