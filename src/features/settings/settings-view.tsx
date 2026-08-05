'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { authService } from '@/services/auth/auth-service'

import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { ChoiceGroup } from '@/components/ui/choice-group'
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

function ProfileForm({ initialName, email }: { initialName: string; email: string }) {
  const [name, setName] = useState(initialName)
  const [saved, setSaved] = useState(initialName)

  /*
   * This used to fire `toast.success('Profile saved')` with no persistence
   * call at all — the name lived in local state and was discarded on
   * navigation, so the one component whose entire job was to confirm was
   * lying. It now actually writes, and only reports success if the write
   * returned one.
   */
  const save = () => {
    const next = name.trim()
    if (!next || next === saved) return
    const session = authService.updateProfile({ name: next })
    if (session) {
      setSaved(next)
      toast.success('Profile saved')
    } else {
      toast.error("Couldn't save your profile — please try again.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" value={email} readOnly disabled />
      </div>
      <div className="flex justify-end">
        <Button onClick={save} disabled={!name.trim() || name.trim() === saved}>
          Save changes
        </Button>
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
    // Real radios: picking a theme is a one-of-three choice, which
    // `aria-pressed` buttons announce as three independent toggles.
    <ChoiceGroup
      legend="Theme"
      options={THEME_OPTIONS}
      value={active ?? null}
      onChange={setTheme}
      className="grid grid-cols-3 gap-2 sm:max-w-md"
    >
      {(option, { selected }) => (
        <span
          className={cn(
            'flex h-full flex-col items-center gap-2 rounded-lg border p-3 text-sm font-medium transition',
            'group-has-[:focus-visible]/choice:ring-ring group-has-[:focus-visible]/choice:ring-2',
            selected ? 'border-brand bg-brand-muted/40' : 'border-border hover:bg-muted',
          )}
        >
          <Icon name={THEME_OPTIONS.find((t) => t.value === option.value)!.icon} size="sm" />
          {option.label}
        </span>
      )}
    </ChoiceGroup>
  )
}

const NOTIFICATIONS: { id: string; label: string; description: string; default: boolean }[] = [
  {
    id: 'email',
    label: 'Email updates',
    description: 'Product news and account activity.',
    default: true,
  },
  {
    id: 'weekly',
    label: 'Weekly summary',
    description: 'A recap of your progress every Monday.',
    default: true,
  },
  {
    id: 'reminders',
    label: 'Document reminders',
    // Was "Nudges to complete your next quest." Quests were the roadmap's
    // vocabulary; the roadmap is gone and the word appeared nowhere else, so it
    // read as a setting for a feature the user could not find.
    description: 'Nudges to finish a CV or cover letter you’ve left as a draft.',
    default: false,
  },
]

function NotificationsSection() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATIONS.map((n) => [n.id, n.default])),
  )

  return (
    <div className="divide-border divide-y">
      {NOTIFICATIONS.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
        >
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
      ))}
    </div>
  )
}

export function SettingsView() {
  const { user, signOut } = useSession()
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
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
        />
      </SettingsSection>

      <SettingsSection title="Appearance" description="Choose how Levvro looks on this device.">
        <AppearanceSection />
      </SettingsSection>

      <SettingsSection title="Notifications" description="Decide what we email you about.">
        <NotificationsSection />
      </SettingsSection>

      <SettingsSection title="Account">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Text tone="muted" size="sm">
            Signed in as {user?.email ?? 'your account'}.
          </Text>
          <Button
            variant="outline"
            onClick={handleSignOut}
            leftIcon={<Icon name="logout" size="sm" />}
          >
            Sign out
          </Button>
        </div>
      </SettingsSection>
    </div>
  )
}
