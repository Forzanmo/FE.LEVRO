'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icon, type IconName } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Reveal } from '@/components/shared/reveal'
import { Heading, Text } from '@/components/ui/typography'
import { useSession } from '@/providers/session-provider'
import { ROUTES } from '@/lib/constants/routes'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

const VALUE_PROPS: { icon: IconName; text: string }[] = [
  { icon: 'target', text: 'A measurable Career Readiness Score in minutes' },
  { icon: 'coach', text: 'An AI coach that explains every step' },
  { icon: 'resume', text: 'Recruiter-ready resume & cover letter' },
]

type AuthMode = 'sign-in' | 'register'

function messageFrom(error: unknown): string {
  return error instanceof Error ? error.message : 'We could not complete that request.'
}

export function SignInView() {
  const { status, hasOnboarded, signIn, register } = useSession()
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(hasOnboarded ? ROUTES.dashboard : ROUTES.onboarding)
    }
  }, [status, hasOnboarded, router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const credentials = { email: email.trim(), password }
      if (mode === 'register') await register(credentials)
      else await signIn(credentials)
    } catch (reason) {
      setError(messageFrom(reason))
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
          <Text tone="muted">
            {mode === 'sign-in'
              ? 'Sign in to continue building your career readiness.'
              : 'Create your account — free to start.'}
          </Text>
        </div>

        <div className="bg-muted mt-6 grid grid-cols-2 rounded-lg p-1" aria-label="Authentication mode">
          {(['sign-in', 'register'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value)
                setError(null)
              }}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition',
                mode === value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground',
              )}
            >
              {value === 'sign-in' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              minLength={mode === 'register' ? 10 : 1}
              required
            />
            {mode === 'register' ? (
              <p className="text-muted-foreground text-xs">Use at least 10 characters.</p>
            ) : null}
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <Button type="submit" variant="gradient" size="xl" fullWidth isLoading={submitting}>
            {mode === 'sign-in' ? 'Sign in' : 'Create account'}
          </Button>
        </form>

        <p className="text-muted-foreground mt-4 text-center text-xs">
          By continuing you agree to our Terms and Privacy Policy.
        </p>

        <ul className="mt-6 space-y-2.5 border-t pt-6">
          {VALUE_PROPS.map((item) => (
            <li key={item.text} className="flex items-center gap-2.5 text-sm">
              <Icon name={item.icon} size="sm" tone="brand" />
              <span className="text-foreground/90">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}
