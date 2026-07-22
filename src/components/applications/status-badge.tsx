import { Icon } from '@/components/ui/icon'
import { STATUS_META, type AppStatus } from '@/features/applications/status'
import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: AppStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        meta.tone,
      )}
    >
      <Icon name={meta.icon} size="xs" />
      {meta.label}
    </span>
  )
}
