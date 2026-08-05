'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from '@tanstack/react-table'
import { toast } from 'sonner'

import { ApplicationsTable } from '@/components/applications/applications-table'
import { ApplicationsToolbar } from '@/components/applications/applications-toolbar'
import { PipelineSummary } from '@/components/applications/pipeline-summary'
import { StatusBadge } from '@/components/applications/status-badge'
import { PageHeader } from '@/components/shared/page-header'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Skeleton } from '@/components/ui/skeleton'
import { formatRelativeTime } from '@/lib/formatters'
import { DYNAMIC_ROUTES } from '@/lib/constants/routes'

import type { Application } from './types'
import { useApplications } from './use-applications'

export function ApplicationsView() {
  const { applications, isLoading, error, add, remove, restore } = useApplications()

  const [sorting, setSorting] = useState<SortingState>([{ id: 'appliedAt', desc: true }])
  const [globalFilter, setGlobalFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const handleDelete = useCallback(
    (app: Application) => {
      remove(app.id)
      toast('Application removed', {
        description: `${app.role} at ${app.company}`,
        action: { label: 'Undo', onClick: () => restore(app) },
      })
    },
    [remove, restore],
  )

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        id: 'company',
        accessorFn: (row) => `${row.company} ${row.role}`,
        header: 'Company',
        cell: ({ row }) => (
          <div className="min-w-0">
            <div className="font-medium">{row.original.company}</div>
            <div className="text-muted-foreground text-xs">{row.original.role}</div>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        filterFn: 'equals',
        cell: ({ getValue }) => <StatusBadge status={getValue() as Application['status']} />,
      },
      {
        accessorKey: 'appliedAt',
        header: 'Applied',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground whitespace-nowrap">
            {formatRelativeTime(getValue() as string)}
          </span>
        ),
      },
      {
        accessorKey: 'location',
        header: 'Location',
        enableSorting: false,
        cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
      },
      {
        accessorKey: 'source',
        header: 'Source',
        enableSorting: false,
        cell: ({ getValue }) => <span className="text-muted-foreground">{getValue() as string}</span>,
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        enableGlobalFilter: false,
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon-sm" aria-label={`Open ${row.original.company} application`} asChild>
              <Link href={DYNAMIC_ROUTES.application(row.original.id)}>
                <Icon name="arrow-right" size="xs" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Delete ${row.original.company} application`}
              onClick={() => handleDelete(row.original)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Icon name="delete" size="xs" />
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete],
  )

  const columnFilters = useMemo<ColumnFiltersState>(
    () => (statusFilter === 'all' ? [] : [{ id: 'status', value: statusFilter }]),
    [statusFilter],
  )

  // TanStack Table returns non-memoizable functions; safe here (small controlled table).
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: applications,
    columns,
    state: { sorting, globalFilter, columnFilters },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Track every application from applied to offer."
      />

      <PipelineSummary applications={applications} />

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Applications could not be loaded</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-4">
        <ApplicationsToolbar
          search={globalFilter}
          onSearch={setGlobalFilter}
          status={statusFilter}
          onStatus={setStatusFilter}
          onAdd={add}
        />
        {isLoading ? <Skeleton className="h-64 w-full rounded-xl" /> : <ApplicationsTable table={table} onDelete={handleDelete} />}
      </div>
    </div>
  )
}
