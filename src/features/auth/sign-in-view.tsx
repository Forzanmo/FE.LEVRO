'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Reveal } from '@/components/shared/reveal'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icon, type IconName } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heading, Text } from '@/components/ui/typography'
import { useSession } from '@/providers/session-provider'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'

/*
 * Each of these has to be something the product does today. The first slot used
 * to promise "A measurable Career Readiness Score in minutes" — a feature that
 * had been removed, sold on the screen where the user decides to hand over
 * their employment history. It also introduced an expectation the landing page
 * never set and the app could not meet.
 *
 * "CV", not "resume": `navigation.ts` renamed the artifact deliberately, and two
 * nouns for one object is what makes an app feel like several apps.
 */
const VALUE_PROPS: { icon: IconName; text: string }[] = [
  { icon: 'target', text: 'See which skills your CV actually proves' },
  { icon: 'coach', text: 'An AI coach that explains every step' },
  { icon: 'resume', text: 'A recruiter-ready CV and cover letter' },
]

export function SignInView({ initialMode = 'sign-in' }: { initialMode?: 'sign-in' | 'register' }) {
  const { status, user, hasOnboarded, signIn, register } = useSession()
  const router = useRouter()
  const handled = useRef(false)
  const [registering, setRegistering] = useState(initialMode === 'register')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading' || handled.current) return
    if (status === 'authenticated') {
      handled.current = true
      router.replace(user?.isAdmin ? ROUTES.admin : hasOnboarded ? ROUTES.dashboard : ROUTES.onboarding)
    }
  }, [status, user?.isAdmin, hasOnboarded, router])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (registering) {
        await register({
          email: email.trim(),
          password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        })
      } else {
        await signIn({ email: email.trim(), password })
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not complete that request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Reveal className="w-full max-w-md">
      <div className="bg-card ring-foreground/10 rounded-2xl p-8 shadow-lg ring-1">
        <div className="space-y-2 text-center">
          <Heading level={1} size="2xl">
            {registering ? `Create your ${siteConfig.name} account` : `Welcome back to ${siteConfig.name}`}
          </Heading>
          <Text tone="muted">
            {registering
              ? 'Start your career assessment for free. No credit card required.'
              : 'Sign in to continue your saved assessment and documents.'}
          </Text>
        </div>

        {/*
         * Real links, and a plain statement about the data. This is the point
         * where someone hands over their entire employment history to an AI,
         * and it was the lowest-trust surface in the product: the Terms and
         * Privacy Policy were unclickable plain text, and the only privacy
         * assurance anywhere appeared on question 7 of the assessment — long
         * after commitment.
         */}
        <p className="text-muted-foreground mt-4 text-center text-xs text-balance">
          Your answers stay private and are only used to build your plan. By continuing you agree to
          our{' '}
          <Link href={ROUTES.terms} className="text-foreground underline underline-offset-2">
            Terms
          </Link>{' '}
          and{' '}
          <Link href={ROUTES.privacy} className="text-foreground underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          {registering ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="auth-first-name">First name</Label>
                <Input
                  id="auth-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-last-name">Last name</Label>
                <Input
                  id="auth-last-name"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
              </div>
            </div>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="auth-password">Password</Label>
              {!registering ? (
                <Link
                  href={ROUTES.forgotPassword}
                  className="text-brand text-xs font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              ) : null}
            </div>
            <Input
              id="auth-password"
              type="password"
              autoComplete={registering ? 'new-password' : 'current-password'}
              minLength={registering ? 10 : 1}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          <Button type="submit" fullWidth isLoading={submitting}>
            {registering ? 'Create account' : 'Sign in'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            fullWidth
            onClick={() => {
              setRegistering((value) => !value)
              setError(null)
            }}
          >
            {registering ? 'Already have an account? Sign in' : 'New to Levrro? Create account'}
          </Button>
        </form>

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
