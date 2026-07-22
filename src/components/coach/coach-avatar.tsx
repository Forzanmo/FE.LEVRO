import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

/** Small, tasteful coach presence — a brand-tinted disc, not a mascot. */
export function CoachAvatar({
  size = 'md',
  className,
}: {
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'bg-brand-muted text-brand ring-brand/15 grid shrink-0 place-items-center rounded-full ring-1',
        size === 'sm' ? 'size-7' : 'size-9',
        className,
      )}
    >
      <Icon name="coach" size={size === 'sm' ? 'xs' : 'sm'} />
    </span>
  )
}
