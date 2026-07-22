'use client'

import { useId } from 'react'

import { Icon } from '@/components/ui/icon'
import type { QuestionOption } from '@/features/coach/types'
import { cn } from '@/lib/utils'

/**
 * Selectable options built on native radio/checkbox inputs, so keyboard support
 * (arrow-key roving for single, space-toggle for multi) and screen-reader
 * semantics come for free. The visible chip is a styled <label>.
 */
export function OptionGroup({
  options,
  multiple,
  value,
  onChange,
}: {
  options: QuestionOption[]
  multiple: boolean
  value: string[]
  onChange: (value: string[]) => void
}) {
  const name = useId()

  const toggle = (v: string) => {
    if (!multiple) {
      onChange([v])
      return
    }
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  }

  return (
    <fieldset className="flex flex-col gap-2">
      {options.map((option) => {
        const checked = value.includes(option.value)
        return (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors',
              'has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-2',
              checked
                ? 'border-brand bg-brand-muted text-foreground'
                : 'border-border hover:bg-muted',
            )}
          >
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={name}
              value={option.value}
              checked={checked}
              onChange={() => toggle(option.value)}
              className="sr-only"
            />
            <span
              className={cn(
                'grid size-4 shrink-0 place-items-center border',
                multiple ? 'rounded-[6px]' : 'rounded-full',
                checked
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-muted-foreground/40',
              )}
            >
              {checked ? <Icon name="check" size="xs" className="size-3" /> : null}
            </span>
            <span className="flex-1">{option.label}</span>
          </label>
        )
      })}
    </fieldset>
  )
}
