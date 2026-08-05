'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { GoogleButton } from '@/components/auth/google-button'
import { Reveal } from '@/components/shared/reveal'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

export function SignInView() {
  const { status, hasOnboarded, signIn, register } = useSession()
  const router = useRouter()
  const handled = useRef(false)
  const [open, setOpen] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading' || handled.current) return
    if (status === 'authenticated') {
      handled.current = true
      router.replace(hasOnboarded ? ROUTES.dashboard : ROUTES.onboarding)
    }
  }, [status, hasOnboarded, router])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const credentials = { email: email.trim(), password }
      if (registering) await register(credentials)
      else await signIn(credentials)
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
            Welcome to {siteConfig.name}
          </Heading>
          <Text tone="muted">Sign in to build your career readiness — free to start.</Text>
        </div>

        <div className="mt-6">
          <GoogleButton onClick={() => setOpen(true)} />
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

        <ul className="mt-6 space-y-2.5 border-t pt-6">
          {VALUE_PROPS.map((vp) => (
            <li key={vp.text} className="flex items-center gap-2.5 text-sm">
              <Icon name={vp.icon} size="sm" tone="brand" />
              <span className="text-foreground/90">{vp.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{registering ? 'Create your account' : 'Sign in to Levvro'}</DialogTitle>
            <DialogDescription>
              Use your email and password for this demo. Google authentication can be enabled later.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submit}>
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
              <Label htmlFor="auth-password">Password</Label>
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
              {registering ? 'Already have an account? Sign in' : 'New to Levvro? Create account'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Reveal>
  )
}
