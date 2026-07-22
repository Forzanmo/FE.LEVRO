import { Heading, Text } from '@/components/ui/typography'
import { cn } from '@/lib/utils'

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      <div className="space-y-1">
        <Heading level={1} size="3xl">
          {title}
        </Heading>
        {description ? (
          <Text tone="muted" size="lg" className="max-w-2xl">
            {description}
          </Text>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
