'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Reveal } from '@/components/shared/reveal'
import { Button } from '@/components/ui/button'
import { ChoiceGroup } from '@/components/ui/choice-group'
import { Icon, type IconName } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import { useSession } from '@/providers/session-provider'
import { ROUTES } from '@/lib/constants/routes'
import type { AuthPlan } from '@/services/auth/auth-service'
import { cn } from '@/lib/utils'

const PLANS: {
  id: AuthPlan
  title: string
  description: string
  icon: IconName
  features: string[]
  recommended?: boolean
}[] = [
  {
    id: 'cv',
    title: 'Just my CV',
    description: 'One strong CV, built from your answers and tailored per role.',
    icon: 'resume',
    features: [
      'Skills mapped against your target role',
      'Three templates: Minimalist, Designer, ATS',
      'Every version saved and reusable',
    ],
  },
  {
    id: 'cv-letters',
    title: 'CV + cover letters',
    description: 'Everything above, plus a matching letter for each application.',
    icon: 'cover-letter',
    features: [
      'Everything in Just my CV',
      'Cover letters written from the same evidence',
      'One library for every document',
    ],
    recommended: true,
  },
]

/** The ChoiceGroup contract: value + accessible label, layout comes from PLANS. */
const PLAN_OPTIONS = PLANS.map((p) => ({ value: p.id, label: `${p.title} — ${p.description}` }))

export function OnboardingView() {
  const { status, hasOnboarded, user, completeOnboarding } = useSession()
  const router = useRouter()
  const handled = useRef(false)
  const [plan, setPlan] = useState<AuthPlan>('cv-letters')

  useEffect(() => {
    if (status === 'loading' || handled.current) return
    handled.current = true
    if (status === 'unauthenticated') router.replace(ROUTES.signIn)
    else if (hasOnboarded) router.replace(ROUTES.dashboard)
  }, [status, hasOnboarded, router])

  const firstName = user?.name?.split(' ')[0]

  const handleContinue = async () => {
    await completeOnboarding(plan)
    router.push(ROUTES.coach)
  }

  return (
    <div className="w-full max-w-2xl">
      <Reveal className="space-y-2 text-center">
        <Heading level={1} size="3xl">
          {firstName ? `Welcome, ${firstName}` : 'Welcome'}
        </Heading>
        <Text tone="muted" size="lg">
          What should we build for you first? You can change this anytime.
        </Text>
      </Reveal>

      {/*
       * Real radios, via the shared ChoiceGroup. These were `aria-pressed`
       * toggle buttons, which announce "pressed / not pressed" per card for what
       * is a mutually-exclusive choice and give no roving arrow-key navigation —
       * wrong semantics for a one-of-two decision.
       */}
      <ChoiceGroup
        legend="What should we build for you first?"
        options={PLAN_OPTIONS}
        value={plan}
        onChange={(v) => setPlan(v as AuthPlan)}
        className="mt-8 grid gap-4 sm:grid-cols-2"
      >
        {(option, { selected }) => {
          const detail = PLANS.find((p) => p.id === option.value)!
          return (
            <span
              className={cn(
                'relative block h-full rounded-2xl border p-5 transition',
                'group-has-[:focus-visible]/choice:ring-ring group-has-[:focus-visible]/choice:ring-offset-background group-has-[:focus-visible]/choice:ring-2 group-has-[:focus-visible]/choice:ring-offset-2',
                selected
                  ? 'border-brand bg-brand-muted/40'
                  : 'border-border hover:border-brand/40 hover:bg-muted/40',
              )}
            >
              {detail.recommended ? (
                <span className="bg-primary text-primary-foreground absolute top-4 right-4 rounded-full px-2 py-0.5 text-xs font-medium">
                  Recommended
                </span>
              ) : null}
              <span className="bg-brand-muted text-brand grid size-11 place-items-center rounded-xl">
                <Icon name={detail.icon} size="md" />
              </span>
              <Heading level={2} size="lg" className="mt-3">
                {detail.title}
              </Heading>
              <Text tone="muted" size="sm" className="mt-1">
                {detail.description}
              </Text>
              <ul className="mt-3 space-y-1.5">
                {detail.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Icon name="check" size="xs" tone="success" />
                    {feature}
                  </li>
                ))}
              </ul>
            </span>
          )
        }}
      </ChoiceGroup>

      <Reveal delay={0.28} className="mt-8 flex justify-center">
        <Button
          size="xl"
          variant="gradient"
          onClick={handleContinue}
          rightIcon={<Icon name="arrow-right" size="sm" />}
        >
          Continue to your coach
        </Button>
      </Reveal>
    </div>
  )
}
