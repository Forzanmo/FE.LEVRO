'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { TextField } from '@/components/ui/field'
import { Icon, type IconName } from '@/components/ui/icon'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Heading, Text } from '@/components/ui/typography'
import { useMounted } from '@/hooks/use-mounted'
import { useSession } from '@/providers/session-provider'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-card ring-foreground/10 rounded-xl p-5 ring-1">
      <div className="mb-4">
        <Heading level={2} size="lg">
          {title}
        </Heading>
        {description ? (
          <Text tone="muted" size="sm" className="mt-0.5">
            {description}
          </Text>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function ProfileForm({
  initialName,
  email,
  onSave,
}: {
  initialName: string
  email: string
  onSave: (name: string) => Promise<void>
}) {
  const [name, setName] = useState(initialName)
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await onSave(name.trim())
      toast.success('Profile saved')
    } catch (error) {
      toast.error('Could not save profile', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" value={email} readOnly disabled />
      </div>
      <div className="flex justify-end">
        <Button onClick={save} isLoading={saving}>Save changes</Button>
      </div>
    </div>
  )
}

const THEME_OPTIONS: { value: string; label: string; icon: IconName }[] = [
  { value: 'light', label: 'Light', icon: 'sun' },
  { value: 'dark', label: 'Dark', icon: 'moon' },
  { value: 'system', label: 'System', icon: 'system' },
]

function AppearanceSection() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()
  const active = mounted ? theme : undefined

  return (
    <div className="grid grid-cols-3 gap-2 sm:max-w-md">
      {THEME_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setTheme(option.value)}
          aria-pressed={active === option.value}
          className={cn(
            'focus-visible:ring-ring flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition outline-none focus-visible:ring-2',
            active === option.value
              ? 'border-brand bg-brand-muted/40'
              : 'border-border hover:bg-muted',
          )}
        >
          <Icon name={option.icon} size="sm" />
          {option.label}
        </button>
      ))}
    </div>
  )
}

const NOTIFICATIONS: { id: string; label: string; description: string; default: boolean }[] = [
  { id: 'email', label: 'Email updates', description: 'Product news and account activity.', default: true },
  { id: 'weekly', label: 'Weekly summary', description: 'A recap of your progress every Monday.', default: true },
  { id: 'reminders', label: 'Roadmap reminders', description: 'Nudges to complete your next quest.', default: false },
]

function NotificationsSection({
  initial,
  onSave,
}: {
  initial: Record<string, boolean>
  onSave: (preferences: Record<string, boolean>) => Promise<void>
}) {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, initial[n.id] ?? n.default])),
  )
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    try {
      await onSave(prefs)
      toast.success('Notification preferences saved')
    } catch (error) {
      toast.error('Could not save preferences', {
        description: error instanceof Error ? error.message : 'Please try again.',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="divide-border divide-y">{NOTIFICATIONS.map((item) => (
        <div key={item.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
          <div className="space-y-0.5">
            <Label htmlFor={`notif-${item.id}`}>{item.label}</Label>
            <Text tone="muted" size="sm">
              {item.description}
            </Text>
          </div>
          <Switch
            id={`notif-${item.id}`}
            checked={prefs[item.id]}
            onCheckedChange={(checked) => setPrefs((p) => ({ ...p, [item.id]: checked }))}
          />
        </div>
      ))}</div>
      <div className="mt-4 flex justify-end"><Button variant="outline" onClick={save} isLoading={saving}>Save preferences</Button></div>
    </div>
  )
}

export function SettingsView() {
  const { user, profileData, signOut, updateProfile } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push(ROUTES.signIn)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Manage your account, appearance and preferences." />

      <SettingsSection title="Profile">
        <ProfileForm
          key={user?.id ?? 'loading'}
          initialName={user?.name ?? ''}
          email={user?.email ?? ''}
          onSave={(fullName) => updateProfile({ full_name: fullName })}
        />
      </SettingsSection>

      <SettingsSection title="Appearance" description="Choose how Levvro looks on this device.">
        <AppearanceSection />
      </SettingsSection>

      <SettingsSection title="Notifications" description="Decide what we email you about.">
        <NotificationsSection
          initial={
            profileData.notification_preferences && typeof profileData.notification_preferences === 'object'
              ? profileData.notification_preferences as Record<string, boolean>
              : {}
          }
          onSave={(notificationPreferences) => updateProfile({ notification_preferences: notificationPreferences })}
        />
      </SettingsSection>

      <SettingsSection title="Account">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Text tone="muted" size="sm">
            Signed in as {user?.email ?? 'your account'}.
          </Text>
          <Button variant="outline" onClick={handleSignOut} leftIcon={<Icon name="logout" size="sm" />}>
            Sign out
          </Button>
        </div>
      </SettingsSection>
    </div>
  )
}
