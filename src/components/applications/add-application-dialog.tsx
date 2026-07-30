'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TextField } from '@/components/ui/field'
import { Icon } from '@/components/ui/icon'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APPLICATION_STATUSES, STATUS_META } from '@/features/applications/status'
import {
  APPLICATION_LIMITS,
  applicationFormSchema,
  type ApplicationFormValues,
} from '@/lib/validators/application-schema'

const DEFAULTS: ApplicationFormValues = {
  company: '',
  role: '',
  status: 'applied',
  location: '',
  source: '',
}

export function AddApplicationDialog({
  onAdd,
}: {
  onAdd: (values: ApplicationFormValues) => void
}) {
  const [open, setOpen] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: DEFAULTS,
  })

  const submit = handleSubmit((values) => {
    onAdd(values)
    reset(DEFAULTS)
    setOpen(false)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset(DEFAULTS)
      }}
    >
      <DialogTrigger asChild>
        <Button leftIcon={<Icon name="add" size="sm" />}>Add application</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add application</DialogTitle>
          <DialogDescription>Track a new role you&rsquo;ve applied to.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Company"
              required
              maxLength={APPLICATION_LIMITS.company}
              error={errors.company?.message}
              {...register('company')}
            />
            <TextField
              label="Role"
              required
              maxLength={APPLICATION_LIMITS.role}
              error={errors.role?.message}
              {...register('role')}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="app-status">Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="app-status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {STATUS_META[status].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Location"
              placeholder="Remote, Berlin…"
              maxLength={APPLICATION_LIMITS.location}
              {...register('location')}
            />
            <TextField
              label="Source"
              placeholder="LinkedIn, referral…"
              maxLength={APPLICATION_LIMITS.source}
              {...register('source')}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            {/* `handleSubmit` resolves validation asynchronously, so there is a
                real window between the first click and the dialog closing in
                which a second click lands and files the application twice. */}
            <Button type="submit" isLoading={isSubmitting}>
              Add application
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
