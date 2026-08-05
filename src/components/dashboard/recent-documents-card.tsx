import Link from 'next/link'

import { DocumentStatusBadge } from '@/components/documents/document-status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/typography'
import { KIND_META } from '@/features/documents/status'
import type { DocumentSummary } from '@/features/documents/types'
import { formatRelativeTime } from '@/lib/formatters'
import { ROUTES } from '@/lib/constants/routes'

/** The four most recently touched documents, newest first. */
export function RecentDocumentsCard({ documents }: { documents: DocumentSummary[] }) {
  const recent = [...documents]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, 4)

  return (
    <Card>
      <CardHeader>
        <CardTitle as="h2">Your documents</CardTitle>
        {recent.length > 0 ? (
          <CardAction>
            <Button asChild variant="ghost" size="sm">
              <Link href={ROUTES.documents}>
                View all
                <Icon name="chevron-right" size="xs" />
              </Link>
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <Text size="sm" tone="muted" measure="prose">
            Your CVs and cover letters will collect here as you tailor them for each role, so you
            can reuse the one that fits.
          </Text>
        ) : (
          <ul className="-mx-2 space-y-0.5">
            {recent.map((doc) => {
              const kind = KIND_META[doc.kind]
              return (
                <li key={doc.id}>
                  <Link
                    href={`${ROUTES.documents}/${doc.id}`}
                    className="hover:bg-muted focus-visible:ring-ring flex items-center gap-3 rounded-lg px-2 py-2 outline-none transition-colors focus-visible:ring-2"
                  >
                    {/* No `mt-0.5` — a leftover from an items-start layout that
                        knocked the icon 2px off optical centre. */}
                    <span className="bg-muted text-muted-foreground grid size-8 shrink-0 place-items-center rounded-lg">
                      <Icon name={kind.icon} size="sm" />
                    </span>
                    <span className="min-w-0 flex-1">
                      {/* Wraps to two lines rather than truncating. `truncate`
                          cut "Frontend Engineer — Northwind" to "Frontend
                          Engineer — …", removing the company — the only thing
                          that tells two CVs for two roles apart. */}
                      <span className="line-clamp-2 text-sm leading-snug font-medium">
                        {doc.title}
                      </span>
                      <span className="text-muted-foreground block text-xs">
                        {kind.label} · {formatRelativeTime(doc.updatedAt)}
                      </span>
                    </span>
                    <DocumentStatusBadge
                      status={doc.status}
                      className="hidden shrink-0 sm:inline-flex"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
