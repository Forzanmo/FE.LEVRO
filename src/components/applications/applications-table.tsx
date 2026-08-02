'use client'

import { flexRender, type Table as TableInstance } from '@tanstack/react-table'

import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import type { Application } from '@/features/applications/types'
import { formatRelativeTime } from '@/lib/formatters'
import { cn } from '@/lib/utils'

import { StatusBadge } from './status-badge'

/**
 * Renders the same TanStack row model two ways: a real table on md+ and a card
 * list on small screens (structural responsiveness, product register).
 */
export function ApplicationsTable({
  table,
  onDelete,
}: {
  table: TableInstance<Application>
  onDelete: (application: Application) => void
}) {
  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <EmptyState
        icon="applications"
        title="No applications found"
        description="Try clearing your search or filters, or add your first application."
      />
    )
  }

  return (
    <>
      {/*
       * Desktop table.
       *
       * `overflow-x-auto` and `min-w-0`, not `overflow-hidden`. Between 768 and
       * ~900px the desktop sidebar has already appeared (256px) while the
       * viewport has not caught up, leaving the table about 512px for six
       * columns that need ~600. `overflow-hidden` did not contain that: the
       * wrapper is a grid child, so its automatic minimum was the table's
       * min-content width and the wrapper itself grew — pushing the whole PAGE
       * to scroll sideways by 65px at exactly 768px, in both themes.
       *
       * Six columns of a data table are worth scrolling; the page is not. The
       * `min-w-0` is what actually lets the track shrink, and `overflow-x-auto`
       * is what makes the overflow reachable instead of clipped.
       *
       * `relative` is the non-obvious part, and without it the page still
       * scrolled. The actions column carries an `sr-only` header, and `sr-only`
       * is `position: absolute`. With no positioned ancestor its containing
       * block is the initial one — the viewport — so that 1px label sat at
       * x=839 *outside* the scroll container and extended the document's scroll
       * width by 72px on its own. Making the wrapper a containing block puts it
       * back inside the region that scrolls.
       */}
      <div className="ring-foreground/10 relative hidden min-w-0 overflow-x-auto rounded-xl ring-1 md:block">
        <table className="w-full min-w-[38rem] text-sm">
          <thead className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  return (
                    <th
                      key={header.id}
                      // The actions column renders an empty <th>; give it a
                      // screen-reader name rather than an unlabelled header.
                      scope="col"
                      className="text-muted-foreground px-4 py-2.5 text-left font-medium"
                    >
                      {/* The row-actions column has no visible header. An empty
                          <th> is an unlabelled column for screen readers, so it
                          gets a name that simply isn't painted. */}
                      {!header.column.columnDef.header ? (
                        <span className="sr-only">Actions</span>
                      ) : header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          // `outline-none` with no replacement made this sort
                          // control invisible to keyboard focus.
                          className="hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded outline-none focus-visible:ring-2"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <Icon
                            name={sorted === 'asc' ? 'chevron-up' : 'chevron-down'}
                            size="xs"
                            className={cn('transition', !sorted && 'opacity-30')}
                          />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className="border-border hover:bg-muted/40 border-t transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden">
        {rows.map((row) => {
          const app = row.original
          return (
            <li key={row.id} className="bg-card ring-foreground/10 rounded-xl p-4 ring-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium">{app.company}</div>
                  <div className="text-muted-foreground truncate text-sm">{app.role}</div>
                </div>
                <StatusBadge status={app.status} />
              </div>
              <div className="text-muted-foreground mt-3 flex items-center justify-between gap-2 text-xs">
                <span className="truncate">
                  {[app.location, app.source].filter(Boolean).join(' · ')}
                </span>
                <span className="whitespace-nowrap">{formatRelativeTime(app.appliedAt)}</span>
              </div>
              <div className="mt-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(app)}
                  leftIcon={<Icon name="delete" size="xs" />}
                  className="text-muted-foreground hover:text-destructive"
                >
                  Delete
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
