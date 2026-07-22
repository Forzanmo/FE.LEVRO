'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { GoogleButton } from '@/components/auth/google-button'
import { Reveal } from '@/components/shared/reveal'
import { Icon, type IconName } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import { useSession } from '@/providers/session-provider'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'

const VALUE_PROPS: { icon: IconName; text: string }[] = [
  { icon: 'target', text: 'A measurable Career Readiness Score in minutes' },
  { icon: 'coach', text: 'An AI coach that explains every step' },
  { icon: 'resume', text: 'Recruiter-ready resume & cover letter' },
]

export function SignInView() {
  const { status, hasOnboarded, signIn } = useSession()
  const router = useRouter()
  const handled = useRef(false)

  useEffect(() => {
    if (status === 'loading' || handled.current) return
    if (status === 'authenticated') {
      handled.current = true
      router.replace(hasOnboarded ? ROUTES.dashboard : ROUTES.onboarding)
    }
  }, [status, hasOnboarded, router])

  return (
    <Reveal className="w-full max-w-md">
      <div className="bg-card ring-foreground/10 rounded-2xl p-8 shadow-lg ring-1">
        <div className="space-y-2 text-center">
          <Heading level={1} size="2xl">
            Welcome to {siteConfig.name}
          </Heading>
          <Text tone="muted">Sign in to build your career readiness — free to start.</Text>
        </div>

        <div className="mt-6">
          <GoogleButton onClick={signIn} />
        </div>

        <p className="text-muted-foreground mt-4 text-center text-xs">
          By continuing you agree to our Terms and Privacy Policy.
        </p>

        <ul className="mt-6 space-y-2.5 border-t pt-6">
          {VALUE_PROPS.map((vp) => (
            <li key={vp.text} className="flex items-center gap-2.5 text-sm">
              <Icon name={vp.icon} size="sm" tone="brand" />
              <span className="text-foreground/90">{vp.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}
