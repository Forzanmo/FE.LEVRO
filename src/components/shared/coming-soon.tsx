import type { IconName } from '@/components/ui/icon'

import { EmptyState } from './empty-state'
import { PageHeader } from './page-header'

/** Reusable placeholder for routes that are navigable but not yet built. */
export function ComingSoon({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: IconName
}) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <EmptyState
        icon={icon}
        title={`${title} is coming soon`}
        description="This part of your journey is being crafted. Check back shortly."
      />
    </div>
  )
}
