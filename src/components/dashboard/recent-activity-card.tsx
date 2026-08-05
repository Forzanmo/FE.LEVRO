import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/typography'
import type { ActivityItem } from '@/features/dashboard/types'
import { formatRelativeTime } from '@/lib/formatters'

/** Priority #6 widget: a concise trail of recent progress. */
export function RecentActivityCard({ items }: { items: ActivityItem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {/*
         * Without this branch the card rendered its title over an empty <ul> —
         * a heading promising content, followed by nothing. An empty state
         * should teach what the card will hold once the user gets there.
         */}
        {items.length === 0 ? (
          <Text size="sm" tone="muted" className="text-pretty">
            Your progress will show up here as you tailor CVs, write cover letters, and log
            applications.
          </Text>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span className="bg-muted text-muted-foreground mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg">
                  <Icon name={item.icon} size="sm" />
                </span>
                <div className="min-w-0 flex-1">
                  <Text size="sm" leading="snug">
                    {item.title}
                  </Text>
                  <Text as="span" size="xs" tone="subtle">
                    {formatRelativeTime(item.timestamp)}
                  </Text>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
