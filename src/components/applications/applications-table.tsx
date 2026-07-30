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
      {/* Desktop table */}
      <div className="ring-foreground/10 hidden overflow-hidden rounded-xl ring-1 md:block">
        <table className="w-full text-sm">
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
