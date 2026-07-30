'use client'

import { Icon } from '@/components/ui/icon'
import type { SaveStatus as Status } from '@/features/resume/use-resume'
import { cn } from '@/lib/utils'

const META: Record<Exclude<Status, 'idle'>, { icon: 'loader' | 'success' | 'warning'; tone: string; label: string }> =
  {
    saving: { icon: 'loader', tone: 'text-muted-foreground', label: 'Saving…' },
    saved: { icon: 'success', tone: 'text-success', label: 'Saved' },
    /*
     * The state this component used not to have. When the write failed it still
     * rendered "Saved", so the one signal the user has that their CV is safe was
     * the one that lied to them.
     */
    error: { icon: 'warning', tone: 'text-destructive', label: 'Not saved — copy your work' },
  }

/** Autosave feedback — mirrors the "Auto Save" promise in the spec. */
export function SaveStatus({ status }: { status: Status }) {
  if (status === 'idle') return null
  const meta = META[status]

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn('inline-flex items-center gap-1.5 text-xs font-medium', meta.tone)}
    >
      <Icon
        name={meta.icon}
        size="xs"
        className={status === 'saving' ? 'animate-spin' : undefined}
      />
      {meta.label}
    </span>
  )
}
