import { Icon } from '@/components/ui/icon'
import { STATUS_META } from '@/features/documents/status'
import type { DocumentStatus } from '@/features/documents/types'
import { cn } from '@/lib/utils'

/**
 * Document state badge.
 *
 * Deliberately the same shape as `components/applications/status-badge.tsx` —
 * same markup, same `STATUS_META` lookup, same icon+label pairing. Two status
 * chips in one product that render differently is how a codebase starts feeling
 * like several products, and this replaced the same span duplicated across the
 * library, the dashboard card, and the detail header.
 */
export function DocumentStatusBadge({
  status,
  className,
}: {
  status: DocumentStatus
  className?: string
}) {
  const meta = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        meta.tone,
        className,
      )}
    >
      <Icon name={meta.icon} size="xs" />
      {meta.label}
    </span>
  )
}
