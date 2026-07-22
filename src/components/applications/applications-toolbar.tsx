'use client'

import { TextField } from '@/components/ui/field'
import { Icon } from '@/components/ui/icon'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APPLICATION_STATUSES, STATUS_META } from '@/features/applications/status'
import type { ApplicationFormValues } from '@/lib/validators/application-schema'

import { AddApplicationDialog } from './add-application-dialog'

export function ApplicationsToolbar({
  search,
  onSearch,
  status,
  onStatus,
  onAdd,
}: {
  search: string
  onSearch: (value: string) => void
  status: string
  onStatus: (value: string) => void
  onAdd: (values: ApplicationFormValues) => void
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <TextField
          containerClassName="sm:max-w-xs sm:flex-1"
          aria-label="Search applications"
          placeholder="Search company or role…"
          leftAdornment={<Icon name="search" size="sm" />}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Select value={status} onValueChange={onStatus}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {APPLICATION_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_META[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <AddApplicationDialog onAdd={onAdd} />
    </div>
  )
}
