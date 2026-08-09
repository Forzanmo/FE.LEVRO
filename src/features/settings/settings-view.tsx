'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { ChoiceGroup } from '@/components/ui/choice-group'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TextField } from '@/components/ui/field'
import { Icon, type IconName } from '@/components/ui/icon'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Heading, Text } from '@/components/ui/typography'
import { useMounted } from '@/hooks/use-mounted'
import { useSession } from '@/providers/session-provider'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'
import { accountService } from '@/services/auth/account-service'

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

const PROFILE_SECTIONS = [
  ['education', 'Education'],
  ['experience', 'Experience'],
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['certifications', 'Certifications'],
  ['activities', 'Activities'],
  ['languages', 'Languages'],
  ['links', 'Links'],
] as const

type ProfileDraft = Record<string, string>

function editableValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  return JSON.stringify(value, null, 2)
}

function structuredValue(value: string): unknown {
  const trimmed = value.trim()
  if (!trimmed) return []
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed) as unknown
    } catch {
      // User-entered prose is stored as one item per non-empty line.
    }
  }
  return trimmed
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function makeProfileDraft(data: Record<string, unknown>, fallbackName: string): ProfileDraft {
  return Object.fromEntries([
    ['full_name', editableValue(data.full_name) || fallbackName],
    ['phone', editableValue(data.phone)],
    ['location', editableValue(data.location)],
    ['avatar_style', typeof data.avatar_style === 'string' ? data.avatar_style : 'neutral'],
    ...PROFILE_SECTIONS.map(([key]) => [key, editableValue(data[key])]),
  ])
}

function ProfileForm({
  initialName,
  email,
  profileData,
}: {
  initialName: string
  email: string
  profileData: Record<string, unknown>
}) {
  const { updateProfile } = useSession()
  const initialDraft = useMemo(
    () => makeProfileDraft(profileData, initialName),
    [initialName, profileData],
  )
  const [draft, setDraft] = useState<ProfileDraft>(initialDraft)
  const [saved, setSaved] = useState<ProfileDraft>(initialDraft)
  const [saving, setSaving] = useState(false)
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved)

  /*
   * This used to fire `toast.success('Profile saved')` with no persistence
   * call at all — the name lived in local state and was discarded on
   * navigation, so the one component whose entire job was to confirm was
   * lying. It now actually writes, and only reports success if the write
   * returned one.
   */
  const save = async () => {
    const fullName = draft.full_name.trim()
    if (!fullName || !dirty) return
    setSaving(true)
    try {
      await updateProfile({
        full_name: fullName,
        phone: draft.phone.trim(),
          location: draft.location.trim(),
          avatar_style: draft.avatar_style,
        ...Object.fromEntries(
          PROFILE_SECTIONS.map(([key]) => [key, structuredValue(draft[key])]),
        ),
      })
      setSaved(draft)
      toast.success('Profile saved')
    } catch {
      toast.error("Couldn't save your profile — please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Full name"
          value={draft.full_name}
          onChange={(event) => setDraft((current) => ({ ...current, full_name: event.target.value }))}
        />
        <TextField label="Email" value={email} readOnly disabled />
        <TextField
          label="Phone"
          value={draft.phone}
          onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))}
        />
        <TextField
          label="Location"
          value={draft.location}
          onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))}
        />
      </div>
      <Text tone="muted" size="sm">
        This is your shared evidence store. The coach, CV upload, and applications add facts here;
        use this section to correct or replace them. Keep one item per line. Structured details
        extracted from a CV remain editable as JSON.
      </Text>
      <ChoiceGroup
        legend="Profile icon"
        hideLegend={false}
        options={[
          { value: 'neutral', label: 'Neutral' },
          { value: 'woman', label: 'Woman' },
          { value: 'man', label: 'Man' },
        ]}
        value={draft.avatar_style}
        onChange={(avatar_style) => setDraft((current) => ({ ...current, avatar_style }))}
        className="grid grid-cols-3 gap-2 sm:max-w-md"
      >
        {(option, { selected }) => (
          <span className={cn('flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-medium transition', selected ? 'border-brand bg-brand-muted/40' : 'border-border hover:bg-muted')}>
            <Icon name={`user-${option.value}` as IconName} size="sm" />
            {option.label}
          </span>
        )}
      </ChoiceGroup>
      <div className="grid gap-4 sm:grid-cols-2">
        {PROFILE_SECTIONS.map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={`profile-${key}`}>{label}</Label>
            <Textarea
              id={`profile-${key}`}
              value={draft[key]}
              onChange={(event) =>
                setDraft((current) => ({ ...current, [key]: event.target.value }))
              }
              rows={4}
              dir="auto"
              placeholder={`Add ${label.toLowerCase()}, one item per line`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Button
          onClick={() => void save()}
          disabled={!draft.full_name.trim() || !dirty}
          isLoading={saving}
        >
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
  const { user, profileData, signOut } = useSession()
  const router = useRouter()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleSignOut = async () => {
    await signOut()
    router.push(ROUTES.signIn)
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) return
    setDeleting(true)
    setDeleteError(null)
    try {
      await accountService.deleteAccount(deletePassword)
      await signOut()
      router.replace(ROUTES.home)
    } catch (reason) {
      setDeleteError(reason instanceof Error ? reason.message : 'Your account could not be deleted.')
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Manage your account, appearance and preferences." />

      <SettingsSection
        title="Profile evidence"
        description="Edit facts collected by the coach, CV uploads, and applications. Career intake happens in the AI coach."
      >
        <ProfileForm
          initialName={user?.name ?? ''}
          email={user?.email ?? ''}
          profileData={profileData}
        />
      </SettingsSection>

      <SettingsSection title="Appearance" description="Choose how Levvro looks on this device.">
        <AppearanceSection />
      </SettingsSection>

      <SettingsSection title="Notifications" description="Decide what we email you about.">
        <NotificationsSection />
      </SettingsSection>

      <SettingsSection title="Account" description="Control your session and personal data.">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Text tone="muted" size="sm">
              Signed in as {user?.email ?? 'your account'}.
            </Text>
            <Button
              variant="outline"
              onClick={() => void handleSignOut()}
              leftIcon={<Icon name="logout" size="sm" />}
            >
              Sign out
            </Button>
          </div>
          <div className="border-destructive/30 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
            <div>
              <Text weight="medium">Delete account</Text>
              <Text tone="muted" size="sm">
                Permanently remove your profile, applications, answers, and documents.
              </Text>
            </div>
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              Delete account
            </Button>
          </div>
        </div>
      </SettingsSection>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete your account permanently?</DialogTitle>
            <DialogDescription>
              This cannot be undone. Enter your password to confirm deletion of all account data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="delete-account-password">Password</Label>
            <Input
              id="delete-account-password"
              type="password"
              autoComplete="current-password"
              value={deletePassword}
              onChange={(event) => setDeletePassword(event.target.value)}
              aria-invalid={Boolean(deleteError)}
            />
            {deleteError ? <Text className="text-destructive" size="sm">{deleteError}</Text> : null}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDeleteAccount()}
              disabled={!deletePassword}
              isLoading={deleting}
            >
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
