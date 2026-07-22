'use client'

import { Icon } from '@/components/ui/icon'
import type { SaveStatus as Status } from '@/features/resume/use-resume'
import { cn } from '@/lib/utils'

/** Autosave feedback — mirrors the "Auto Save" promise in the spec. */
export function SaveStatus({ status }: { status: Status }) {
  if (status === 'idle') return null
  const saving = status === 'saving'

  return (
    <span
      role="status"
      aria-live="polite"
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        saving ? 'text-muted-foreground' : 'text-success',
      )}
    >
      <Icon name={saving ? 'loader' : 'success'} size="xs" className={saving ? 'animate-spin' : undefined} />
      {saving ? 'Saving…' : 'Saved'}
    </span>
  )
}
