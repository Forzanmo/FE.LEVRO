'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Reveal } from '@/components/shared/reveal'
import { Button } from '@/components/ui/button'
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
    id: 'assets',
    title: 'Resume + Cover Letter',
    description: 'Get recruiter-ready assets, generated and refined with you.',
    icon: 'resume',
    features: ['Career Readiness Score', 'AI-generated resume', 'Tailored cover letters'],
  },
  {
    id: 'assets-roadmap',
    title: 'Resume + Cover Letter + Roadmap',
    description: 'Everything above, plus a step-by-step quest to close your gaps.',
    icon: 'roadmap',
    features: [
      'Everything in Resume + Cover Letter',
      'Interactive quest roadmap',
      'Guided path to interview-ready',
    ],
    recommended: true,
  },
]

export function OnboardingView() {
  const { status, hasOnboarded, user, completeOnboarding } = useSession()
  const router = useRouter()
  const handled = useRef(false)
  const [plan, setPlan] = useState<AuthPlan>('assets-roadmap')

  useEffect(() => {
    if (status === 'loading' || handled.current) return
    handled.current = true
    if (status === 'unauthenticated') router.replace(ROUTES.signIn)
    else if (hasOnboarded) router.replace(ROUTES.dashboard)
  }, [status, hasOnboarded, router])

  const firstName = user?.name?.split(' ')[0]

  const handleContinue = () => {
    completeOnboarding(plan)
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {PLANS.map((option, i) => {
          const selected = plan === option.id
          return (
            <Reveal key={option.id} delay={0.1 + i * 0.08} className="h-full">
              <button
                type="button"
                onClick={() => setPlan(option.id)}
                aria-pressed={selected}
                className={cn(
                  'focus-visible:ring-ring focus-visible:ring-offset-background relative h-full w-full rounded-2xl border-2 p-5 text-left transition outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  selected
                    ? 'border-brand bg-brand-muted/40'
                    : 'border-border hover:border-brand/40 hover:-translate-y-0.5 hover:bg-muted/40',
                )}
              >
                {option.recommended ? (
                  <span className="bg-primary text-primary-foreground absolute top-4 right-4 rounded-full px-2 py-0.5 text-xs font-medium">
                    Recommended
                  </span>
                ) : null}
                <span className="bg-brand-muted text-brand grid size-11 place-items-center rounded-xl">
                  <Icon name={option.icon} size="md" />
                </span>
                <Heading level={2} size="lg" className="mt-3">
                  {option.title}
                </Heading>
                <Text tone="muted" size="sm" className="mt-1">
                  {option.description}
                </Text>
                <ul className="mt-3 space-y-1.5">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Icon name="check" size="xs" tone="success" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </button>
            </Reveal>
          )
        })}
      </div>

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
