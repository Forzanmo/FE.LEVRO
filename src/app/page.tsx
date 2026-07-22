import Link from 'next/link'

import { Logo } from '@/components/layout'
import { AuroraBackdrop } from '@/components/shared/aurora-backdrop'
import { ProgressRing } from '@/components/shared/progress-ring'
import { Reveal } from '@/components/shared/reveal'
import { ThemeToggle } from '@/components/shared/theme-toggle'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Icon, type IconName } from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import { Heading, Text } from '@/components/ui/typography'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

const FEATURES: { icon: IconName; title: string; body: string }[] = [
  {
    icon: 'coach',
    title: 'AI Coach',
    body: 'One question at a time — it always explains its reasoning and never wastes your time. The assessment that builds your whole plan.',
  },
  {
    icon: 'target',
    title: 'Career Readiness Score',
    body: 'A single measurable score, with evidence behind every point.',
  },
  {
    icon: 'resume',
    title: 'Resume & Cover Letter',
    body: 'Recruiter-ready assets, refined with a live preview.',
  },
  {
    icon: 'roadmap',
    title: 'Quest Roadmap',
    body: 'Your gaps become a step-by-step path you will actually finish — completed quests stay visible so progress compounds.',
  },
]

const HOW_IT_WORKS: { icon: IconName; step: string; title: string; body: string }[] = [
  {
    icon: 'coach',
    step: 'Step 1',
    title: 'Assess where you really stand',
    body: 'A short AI coaching conversation — one question at a time — becomes a transparent Career Readiness Score, with the reasoning behind every point. No guessing, no judgment.',
  },
  {
    icon: 'roadmap',
    step: 'Step 2',
    title: 'Follow a plan built for you',
    body: 'Your gaps become a personalized, step-by-step roadmap you will actually finish. Completed steps stay visible, so momentum compounds.',
  },
  {
    icon: 'achievements',
    step: 'Step 3',
    title: 'Walk in interview-ready',
    body: 'At the right moment, Levvro produces recruiter-ready assets — resume and cover letter — so you apply with confidence and start landing interviews.',
  },
]

// Honest promises about the product — not fabricated testimonials or outcome stats.
const REASSURANCES: { icon: IconName; label: string }[] = [
  { icon: 'target', label: 'Evidence over hype — every score shows its reasoning' },
  { icon: 'coach', label: 'Coaching and a roadmap, not just a resume' },
  { icon: 'sparkles', label: 'Free to start — no credit card required' },
  { icon: 'achievements', label: 'Built for juniors and career-shifters' },
]

const PREVIEW_CATEGORIES = [
  { label: 'Resume quality', score: 81 },
  { label: 'Skills alignment', score: 64 },
  { label: 'Interview readiness', score: 52 },
]

const FOOTER_SECTIONS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', href: ROUTES.dashboard },
      { label: 'AI Coach', href: ROUTES.coach },
      { label: 'Roadmap', href: ROUTES.roadmap },
      { label: 'Resume', href: ROUTES.resume },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'How it works', href: '#how-it-works' },
      { label: 'Get started', href: ROUTES.signIn },
      { label: 'Contact', href: 'mailto:hello@levvro.app' },
    ],
  },
]

function MarketingHeader() {
  return (
    <header className="bg-background/70 supports-[backdrop-filter]:bg-background/50 sticky top-0 z-[var(--z-sticky)] border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[var(--content-max-width)] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href={ROUTES.signIn}>Sign in</Link>
          </Button>
          <Button asChild variant="gradient" size="sm">
            <Link href={ROUTES.signIn}>Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

/** Authentic product preview — the real Career-Score card, not a metrics grid. */
function HeroPreview() {
  return (
    <div className="mx-auto mt-14 w-full max-w-3xl">
      <Card className="shadow-xl">
        <CardContent className="grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="border-border flex flex-col items-center gap-2 sm:border-r sm:pr-6">
            <ProgressRing
              value={68}
              size={132}
              strokeWidth={11}
              label="Career readiness score preview"
            >
              <div>
                <div className="font-heading text-4xl font-semibold tabular-nums">68</div>
                <Text as="span" size="xs" tone="muted" tracking="wide" className="uppercase">
                  score
                </Text>
              </div>
            </ProgressRing>
            <Text as="span" size="sm" weight="medium">
              Career Readiness
            </Text>
          </div>
          <div className="space-y-3.5">
            {PREVIEW_CATEGORIES.map((category) => (
              <div key={category.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{category.label}</span>
                  <span className="text-muted-foreground font-medium tabular-nums">
                    {category.score}
                  </span>
                </div>
                <Progress value={category.score} aria-label={`${category.label} score`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="relative flex min-h-svh flex-col">
      {/* Decorative hero backdrop — animated brand aurora (gradient wash + drifting glows + mesh). */}
      <AuroraBackdrop />

      <MarketingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-[var(--content-max-width)] px-4 pt-16 pb-8 text-center sm:px-6 sm:pt-24 lg:px-8">
          <div className="hero-stagger">
            <span className="border-border bg-brand-muted text-brand mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium">
              <Icon name="sparkles" size="xs" variant="filled" />
              AI Career Intelligence
            </span>

            <Heading level={1} size="6xl" className="mx-auto mt-6 max-w-4xl">
              Turn career uncertainty into a{' '}
              <span className="text-brand">roadmap to getting hired</span>.
            </Heading>

            <Text
              as="p"
              size="xl"
              className="text-muted-foreground mx-auto mt-5 max-w-3xl text-pretty leading-relaxed"
            >
              {siteConfig.name} assesses where you are, coaches you forward, and generates the
              recruiter-ready assets that get you <span className="text-brand">interviews</span> —
              for juniors and career shifters.
            </Text>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="gradient" size="xl">
                <Link href={ROUTES.signIn}>
                  Start Your Career Journey
                  <Icon name="arrow-right" size="sm" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link href="#how-it-works">
                  <Icon name="play" size="sm" />
                  See how it works
                </Link>
              </Button>
            </div>

            <Text as="p" size="sm" tone="subtle" className="mt-4">
              Free to start · No credit card required
            </Text>

            <HeroPreview />
          </div>
        </section>

        {/* Features — bento layout (varied sizes, not an identical grid) */}
        <section
          id="features"
          className="mx-auto w-full max-w-[var(--content-max-width)] scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8"
        >
          <Reveal className="max-w-2xl">
            <Heading level={2} size="4xl">
              Everything you need to become recruiter-ready
            </Heading>
            <Text tone="muted" size="lg" className="mt-3">
              Evidence-driven, never overwhelming. Each screen has one clear goal.
            </Text>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, i) => {
              const wide = i === 0 || i === 3
              return (
                <Reveal
                  key={feature.title}
                  delay={i * 0.08}
                  className={cn('h-full', wide && 'lg:col-span-2')}
                >
                  <Card className="group/feature h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                    <CardContent className="flex h-full flex-col gap-3">
                      <span className="bg-gradient-brand-deep grid size-11 place-items-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover/feature:scale-105">
                        <Icon name={feature.icon} size="md" />
                      </span>
                      <Heading level={3} size={wide ? 'xl' : 'lg'}>
                        {feature.title}
                      </Heading>
                      <Text tone="muted" size={wide ? 'base' : 'sm'} className="max-w-prose">
                        {feature.body}
                      </Text>
                    </CardContent>
                  </Card>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* How it works — a real 3-step sequence (numbers earned, an ordered flow) */}
        <section
          id="how-it-works"
          className="mx-auto w-full max-w-[var(--content-max-width)] scroll-mt-20 px-4 py-16 sm:px-6 lg:px-8"
        >
          <Reveal className="max-w-2xl">
            <Heading level={2} size="4xl">
              From uncertain to interviewing, in three steps
            </Heading>
            <Text tone="muted" size="lg" className="mt-3">
              No black box. Every step shows its reasoning, so you always know where you stand and
              what to do next.
            </Text>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-gradient-brand-deep grid size-11 shrink-0 place-items-center rounded-xl text-white shadow-sm">
                      <Icon name={s.icon} size="md" />
                    </span>
                    <Text as="span" size="sm" weight="semibold" tone="brand">
                      {s.step}
                    </Text>
                  </div>
                  <Heading level={3} size="xl">
                    {s.title}
                  </Heading>
                  <Text tone="muted" className="max-w-prose">
                    {s.body}
                  </Text>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Reassurance — honest promises for an anxious first-timer (no fabricated proof) */}
          <Reveal className="mt-12">
            <ul className="border-border grid gap-x-6 gap-y-4 rounded-2xl border bg-card px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
              {REASSURANCES.map((r) => (
                <li key={r.label} className="flex items-start gap-2.5">
                  <span className="text-brand mt-0.5 shrink-0" aria-hidden="true">
                    <Icon name={r.icon} size="sm" variant="filled" />
                  </span>
                  <Text size="sm" weight="medium">
                    {r.label}
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
              <Heading level={2} size="4xl" tone="inverse" className="relative mx-auto max-w-2xl">
                Ready to feel confident walking into your next interview?
              </Heading>
              <Text size="lg" className="relative mx-auto mt-3 max-w-xl text-white/85">
                Start your assessment now and get a measurable plan in minutes.
              </Text>
              <div className="relative mt-7 flex justify-center">
                <Button
                  asChild
                  size="xl"
                  className="text-brand bg-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-white/90"
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
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors"
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
