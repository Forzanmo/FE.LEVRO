'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heading, Text } from '@/components/ui/typography'
import { ROUTES } from '@/lib/constants/routes'
import { accountService } from '@/services/auth/account-service'

function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-card ring-foreground/10 w-full max-w-md rounded-2xl p-8 shadow-lg ring-1">
      {children}
    </div>
  )
}

export function ForgotPasswordView() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      setMessage(await accountService.requestPasswordReset(email.trim()))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The reset request could not be sent.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard>
      <div className="space-y-2 text-center">
        <Heading level={1} size="2xl">Reset your password</Heading>
        <Text tone="muted">Enter your account email. We’ll send a time-limited reset link.</Text>
      </div>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div className="space-y-2">
          <Label htmlFor="reset-email">Email</Label>
          <Input
            id="reset-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        {message ? (
          <Alert>
            <AlertTitle>Check your inbox</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}
        {error ? (
          <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
        ) : null}
        <Button type="submit" fullWidth isLoading={submitting}>Send reset link</Button>
        <Button variant="ghost" fullWidth asChild>
          <Link href={ROUTES.signIn}>Back to sign in</Link>
        </Button>
      </form>
    </AuthCard>
  )
}

export function ResetPasswordView({ token }: { token: string | null }) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return setError('This password-reset link is missing its token.')
    if (password !== confirmation) return setError('The passwords do not match.')
    setSubmitting(true)
    setError(null)
    try {
      await accountService.confirmPasswordReset(token, password)
      router.replace(`${ROUTES.signIn}?reset=complete`)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The password could not be reset.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthCard>
      <div className="space-y-2 text-center">
        <Heading level={1} size="2xl">Choose a new password</Heading>
        <Text tone="muted">Use at least 10 characters and keep it unique to Levrro.</Text>
      </div>
      <form className="mt-6 space-y-4" onSubmit={submit}>
        <div className="space-y-2">
          <Label htmlFor="new-password">New password</Label>
          <Input id="new-password" type="password" autoComplete="new-password" minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input id="confirm-password" type="password" autoComplete="new-password" minLength={10} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
        </div>
        {error ? (
          <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
        ) : null}
        <Button type="submit" fullWidth isLoading={submitting} disabled={!token}>Update password</Button>
        <Button variant="ghost" fullWidth asChild>
          <Link href={ROUTES.signIn}>Back to sign in</Link>
        </Button>
      </form>
    </AuthCard>
  )
}
