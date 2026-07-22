'use client'

import * as React from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

/**
 * TextField — accessible composite of Label + Input + hint/error + adornments.
 * Wires ids and ARIA (aria-invalid, aria-describedby, role="alert") so callers
 * — including react-hook-form field renderers — get correct semantics for free.
 */
export interface TextFieldProps extends Omit<React.ComponentProps<'input'>, 'id'> {
  label?: React.ReactNode
  description?: React.ReactNode
  error?: React.ReactNode
  required?: boolean
  leftAdornment?: React.ReactNode
  rightAdornment?: React.ReactNode
  id?: string
  containerClassName?: string
}

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    description,
    error,
    required,
    leftAdornment,
    rightAdornment,
    id,
    className,
    containerClassName,
    'aria-describedby': ariaDescribedby,
    ...props
  },
  ref,
) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const descriptionId = description ? `${inputId}-description` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy =
    [ariaDescribedby, descriptionId, errorId].filter(Boolean).join(' ') || undefined
  const invalid = Boolean(error)

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label ? (
        <Label htmlFor={inputId}>
          {label}
          {required ? (
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          ) : null}
        </Label>
      ) : null}

      <div className="relative">
        {leftAdornment ? (
          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5">
            {leftAdornment}
          </span>
        ) : null}

        <Input
          id={inputId}
          ref={ref}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          aria-required={required || undefined}
          className={cn(leftAdornment && 'pl-9', rightAdornment && 'pr-9', className)}
          {...props}
        />

        {rightAdornment ? (
          <span className="text-muted-foreground absolute inset-y-0 right-0 flex items-center pr-2.5">
            {rightAdornment}
          </span>
        ) : null}
      </div>

      {description && !error ? (
        <p id={descriptionId} className="text-muted-foreground text-xs">
          {description}
        </p>
      ) : null}

      {error ? (
        <p id={errorId} role="alert" className="text-destructive text-xs font-medium">
          {error}
        </p>
      ) : null}
    </div>
  )
})
