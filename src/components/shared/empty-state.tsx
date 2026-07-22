import { Icon, type IconName } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

import { GridPattern } from './grid-pattern'

export interface EmptyStateProps {
  icon?: IconName
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon = 'sparkles', title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'relative isolate flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-dashed px-6 py-12 text-center',
        className,
      )}
    >
      <GridPattern variant="dots" size={22} className="opacity-60" />
      <span className="bg-brand-muted text-brand grid size-12 place-items-center rounded-full">
        <Icon name={icon} size="lg" />
      </span>
      <div className="space-y-1">
        <Heading level={3} size="lg">
          {title}
        </Heading>
        {description ? (
          <Text tone="muted" className="mx-auto max-w-sm">
            {description}
          </Text>
        ) : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
