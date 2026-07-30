import Link from 'next/link'

import { Logo } from '@/components/layout'
import { SHEET_INK, SHEET_SURFACE } from '@/components/documents/document-sheet'
import { AuroraBackdrop } from '@/components/shared/aurora-backdrop'
import { Reveal } from '@/components/shared/reveal'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

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
  'Evidence over hype — every verdict shows its reasoning',
  'An ATS template, because most CVs are machine-read first',
  'Free to start — no credit card required',
  'Built for juniors and career-shifters',
]

/** The hero sheet's verdict rows — two proven, one visibly absent. */
const HERO_SKILLS: { label: string; proven: boolean }[] = [
  { label: 'React & component architecture', proven: true },
  { label: 'TypeScript', proven: true },
  { label: 'System design', proven: false },
]

/*
 * The "Product" column used to be four deep links into authenticated routes, so
 * every one of them bounced a logged-out visitor — the only people who read a
 * marketing footer — to the sign-in screen. It now points at the sections of
 * this page that actually explain the product, and offers one honest way in.
 *
 * "Edit CV", not "Resume": `navigation.ts` renamed the artifact on purpose and
 * this was the last place still using the other noun.
 */
const FOOTER_SECTIONS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'What you get', href: '#features' },
      { label: 'How it works', href: '#how-it-works' },
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

/*
 * The header belongs to the drenched fold, so it is the same theme-invariant
 * deep teal — not a light bar sitting on top of a dark hero, which read as a
 * seam and undercut the commitment.
 *
 * It stays OPAQUE. A translucent sticky bar composites over whatever happens to
 * be scrolling beneath it, and that cannot be made accessible: at the previous
 * `/50` the near-black "Sign in" label landed on the dark CTA band at ~1.3:1.
 * Being its own fixed surface means its contrast is knowable.
 *
 * Each child is told explicitly how to render on the dark surface, rather than
 * a blanket descendant override on the container — see the note on `Logo`'s
 * `tone` prop for why that shortcut is a trap.
 */
function MarketingHeader() {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-white/10 bg-brand-surface">
      <div className="mx-auto flex h-16 w-full max-w-[var(--content-max-width)] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo tone="onBrand" />
        <div className="flex items-center gap-2">
          <div className="[&_button]:text-white [&_button:hover]:bg-white/10">
            <ThemeToggle />
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-white hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            <Link href={ROUTES.signIn}>Sign in</Link>
          </Button>
          <Button asChild size="sm" className="text-brand-800 bg-white hover:bg-white/90">
            <Link href={ROUTES.signIn}>Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

/**
 * Hero product preview — the real skills read-out, on paper.
 *
 * Deliberately a document, not a dashboard widget: the product's output IS a
 * CV, so the preview shows the artifact the visitor will actually get, with the
 * skills verdict pinned to it. On the drenched fold it reads as a sheet of
 * paper lying on a dark desk, which is the one image the whole page is selling.
 */
function HeroPreview() {
  return (
    <div className="relative">
      {/* Warm pool of light behind the sheet — the golden-hour lamp. */}
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[3rem] opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(60% 50% at 60% 35%, color-mix(in oklab, var(--accent-500) 34%, transparent), transparent 70%)',
        }}
      />
      {/* Same sheet definition as the real CV templates — this is a product shot,
          so it has to be the actual surface, not a lookalike. `shadow-xl`, not
          `shadow-2xl`: DESIGN.md's elevation scale stops at xl. */}
      <div className={cn('relative rounded-2xl p-6 shadow-xl sm:p-7', SHEET_SURFACE)}>
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="font-heading text-lg font-semibold tracking-tight">Alex Rivera</p>
            <p className={cn('text-sm font-medium', SHEET_INK.accent)}>Frontend Engineer</p>
          </div>
          <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', SHEET_INK.chip)}>
            Minimalist
          </span>
        </div>

        <div className={cn('mt-5 space-y-2.5 border-t pt-5', SHEET_INK.hairline)}>
          <p className={cn('text-xs font-semibold tracking-wider uppercase', SHEET_INK.muted)}>
            What this CV proves
          </p>
          {HERO_SKILLS.map((skill) => (
            <div key={skill.label} className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className={cn(
                  'size-2 shrink-0 rounded-full',
                  skill.proven ? 'bg-[var(--success-500)]' : 'bg-[var(--neutral-300)]',
                )}
              />
              <span className={cn('flex-1 text-sm', SHEET_INK.body)}>{skill.label}</span>
              <span
                className={cn(
                  'text-xs font-medium',
                  skill.proven ? 'text-[var(--success-700)]' : SHEET_INK.muted,
                )}
              >
                {skill.proven ? 'Evidenced' : 'Not shown'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="relative flex min-h-svh flex-col">
      {/* Decorative brand backdrop — CSS gradient wash + drifting glows, no WebGL. */}
      <AuroraBackdrop />

      <MarketingHeader />

      <main className="flex-1">
        {/*
         * The hero fold is DRENCHED, and it is the page's one committed move.
         *
         * Previously this was a centred near-white fold: the identity's second
         * colour appeared above it only in a 32px logo chip, and the beat
         * sequence (pill badge → highlighted headline → twin CTAs → centred
         * preview card) was the modal AI-career-tool hero. Two changes fix that
         * together — the surface becomes the brand instead of being washed with
         * 5% of it, and the composition goes asymmetric so the eye lands on
         * copy and artifact rather than on a centred column.
         *
         * The band is theme-INVARIANT deep teal, like the CTA band: a hero that
         * inverts between themes cannot commit to a colour, and the whole point
         * of Committed is that the colour carries the brand. Gold appears here
         * as the lamp behind the CV sheet and on the "not shown" verdict — the
         * golden-hour room DESIGN.md describes, made literal.
         */}
        <section className="relative isolate overflow-hidden bg-brand-surface text-white">
          {/* Warm rake of light from the upper right — one source, one direction. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(70% 60% at 78% 8%, color-mix(in oklab, var(--accent-500) 26%, transparent), transparent 68%),' +
                'radial-gradient(55% 55% at 8% 92%, color-mix(in oklab, var(--brand-500) 30%, transparent), transparent 70%)',
            }}
          />
          {/* Fine grid, barely there — the desk surface, not a tech motif. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />

          <div className="mx-auto grid w-full max-w-[var(--content-max-width)] items-center gap-12 px-4 pt-16 pb-20 sm:px-6 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16 lg:px-8 lg:pt-28 lg:pb-28">
            <div className="hero-stagger">
              <p className="text-sm font-medium text-brand-surface-accent">
                For juniors and career shifters
              </p>

              <Heading level={1} size="display-lg" tone="inherit" className="mt-4 max-w-[20ch]">
                Your CV says less about you than you think.
              </Heading>

              <Text as="p" size="xl" measure="lead" className="mt-5 text-pretty text-brand-surface-muted">
                {siteConfig.name} reads it the way a recruiter does, shows you which skills it
                actually proves, and writes the version that proves the rest.
              </Text>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="xl"
                  className="text-brand-800 bg-white shadow-lg hover:bg-white/90"
                >
                  <Link href={ROUTES.signIn}>
                    See what mine proves
                    <Icon name="arrow-right" size="sm" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="xl"
                  variant="ghost"
                  className="text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="#how-it-works">
                    <Icon name="play" size="sm" />
                    How it works
                  </Link>
                </Button>
              </div>

              <p className="mt-5 text-sm text-brand-surface-muted">
                Free to start · No credit card required
              </p>
            </div>

            <HeroPreview />
          </div>
        </section>

        {/*
         * Features — an editorial specimen list, deliberately NOT a card grid.
         *
         * This section, "how it works", and the reassurances used to be three
         * consecutive icon + heading + text grids. Individually each was
         * defensible; stacked, they were the default AI-SaaS page rendered in
         * teal. Each of the three now takes a different form, and the form is
         * chosen by what the content actually is: this is a set of parallel
         * capabilities, so it reads as a specification list — hairlines, a
         * held-still section heading, and no decorative chrome competing with
         * the words.
         */}
        <section
          id="features"
          className="mx-auto w-full max-w-[var(--content-max-width)] scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
        >
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

        {/*
         * How it works — a genuine ordered sequence, so it is built as one: an
         * <ol> on a connecting rail, with the numbers carried by the rail
         * itself. Numbers are earned here (the order is the information), which
         * is exactly the case where they are voice rather than scaffolding.
         */}
        <section
          id="how-it-works"
          className="mx-auto w-full max-w-[var(--content-max-width)] scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8"
        >
          <Reveal className="max-w-2xl">
            <Heading level={2} size="display-md">
              From uncertain to interviewing, in three steps
            </Heading>
            <Text tone="muted" size="lg" measure="lead" className="mt-4">
              No black box. Every step shows its reasoning, so you always know where you stand and
              what to do next.
            </Text>
          </Reveal>

          <div className="relative mt-14">
            {/* The rail: vertical on mobile, horizontal across the markers on desktop. */}
            <div
              aria-hidden="true"
              className="bg-border absolute top-2 bottom-2 left-[1.4375rem] w-px md:top-[1.4375rem] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-auto"
            />
            <ol className="relative grid gap-10 md:grid-cols-3 md:gap-10">
              {HOW_IT_WORKS.map((s, i) => (
                // `as="li"` — an <ol> may only contain <li>, so the animation
                // wrapper has to BE the list item rather than sit around it.
                <Reveal key={s.title} delay={i * 0.08} as="li">
                  <div className="flex gap-5 md:flex-col md:gap-6">
                    <span className="bg-background ring-brand text-brand font-mono grid size-11.5 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums ring-2">
                      {i + 1}
                    </span>
                    <div className="space-y-2">
                      <Heading level={3} size="xl">
                        {s.title}
                      </Heading>
                      <Text tone="muted" measure="prose">
                        {s.body}
                      </Text>
                    </div>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>

          {/*
           * Reassurance — a quiet rule-separated band. It was a fourth icon
           * grid in a card; these are four short honest promises, and they read
           * better as a line of statements than as boxes pretending to be
           * features.
           */}
          <Reveal className="mt-16">
            <ul className="border-border flex flex-wrap justify-center gap-x-8 gap-y-3 border-t pt-8">
              {REASSURANCES.map((label) => (
                <li key={label}>
                  <Text as="span" size="sm" tone="muted">
                    {label}
                  </Text>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* CTA band — one committed brand surface (solid gradient, animated sheen) */}
        <section className="mx-auto w-full max-w-[var(--content-max-width)] px-4 py-8 sm:px-6 lg:px-8">
          <Reveal>
            <div className="bg-gradient-brand-deep shadow-brand-glow relative overflow-hidden rounded-3xl px-6 py-14 text-center text-white">
              {/* Moving highlight sweep across the brand surface. */}
              <span aria-hidden="true" className="brand-sheen" />
              <Heading
                level={2}
                size="display-md"
                tone="onBrand"
                className="relative mx-auto max-w-2xl"
              >
                Ready to feel confident walking into your next interview?
              </Heading>
              {/* Full white, not white/85 — at 85% this measured 3.53:1 against
                  the band's lighter end while the sheen sweeps across it. */}
              <Text size="lg" tone="onBrand" className="relative mx-auto mt-3 max-w-xl">
                Start your assessment now and get a measurable plan in minutes.
              </Text>
              <div className="relative mt-7 flex justify-center">
                <Button
                  asChild
                  size="xl"
                  // `text-brand` is theme-reactive (aqua in dark) and measured
                  // 1.50:1 on this white pill. The brand RAMP is declared once
                  // in :root, so brand-800 stays dark teal in both themes.
                  className="text-brand-800 bg-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-white/90"
                >
                  <Link href={ROUTES.signIn}>
                    Start Your Career Journey
                    <Icon name="arrow-right" size="sm" />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* Large SaaS footer */}
      <footer className="border-t">
        <div className="mx-auto grid w-full max-w-[var(--content-max-width)] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.5fr_repeat(2,1fr)] lg:px-8">
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
                  is a real failure. `space-y-0.5` keeps the visual rhythm the
                  old `space-y-2` had before the boxes grew. */}
              <ul className="space-y-0.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex min-h-6 items-center rounded-sm text-sm outline-none transition-colors focus-visible:ring-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t">
          <div className="text-muted-foreground mx-auto flex w-full max-w-[var(--content-max-width)] flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row sm:px-6 lg:px-8">
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
