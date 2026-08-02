'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * The single "choose from options" mechanism for the whole product.
 *
 * Before this existed, four surfaces each implemented single-select their own
 * way: the coach used native radios in a fieldset, the onboarding plan cards and
 * the settings theme picker used `aria-pressed` toggle buttons, and the CV
 * template picker used a third variation. Two of those were semantically wrong —
 * `aria-pressed` on a mutually-exclusive choice announces "pressed / not
 * pressed" per button instead of "radio, 2 of 3", and gives no roving arrow-key
 * navigation — and all four had to reinvent focus rings and keyboard handling.
 *
 * This owns the MECHANISM and leaves the layout to each call site, because the
 * content genuinely differs (a compact answer row, a plan card with a feature
 * list, a three-up icon grid, a template card with trade-offs). Sharing the
 * mechanism removes the accessibility bugs; sharing the layout too would have
 * forced four different designs through one shape.
 *
 * What it guarantees, everywhere:
 *   - a real <fieldset> with a <legend>, so the group has an accessible name
 *   - native <input type="radio"|"checkbox">, so arrow keys, space, form
 *     semantics, and screen-reader position announcements come for free
 *   - one focus-visible convention, driven by `has-[:focus-visible]`
 *
 * Deliberately NOT used for view filters (the CV edit/preview
 * segmented controls). Those are "change what I'm looking at", not "pick a
 * value", and `role="group"` + `aria-pressed` is the right pattern there.
 */

export interface ChoiceOption {
  value: string
  /** The option's accessible name. Keep it meaningful on its own. */
  label: string
  disabled?: boolean
}

interface ChoiceGroupBaseProps<T extends ChoiceOption> {
  /** Names the group for assistive tech. Required — an unlabelled fieldset
   *  announces its options with no question attached. */
  legend: string
  /** Visually hide the legend when the surrounding UI already shows it. */
  hideLegend?: boolean
  options: readonly T[]
  className?: string
  /** Renders one option's visible content. Receives its selected state. */
  children: (option: T, state: { selected: boolean }) => React.ReactNode
}

type SingleProps<T extends ChoiceOption> = ChoiceGroupBaseProps<T> & {
  multiple?: false
  value: string | null
  onChange: (value: string) => void
}

type MultipleProps<T extends ChoiceOption> = ChoiceGroupBaseProps<T> & {
  multiple: true
  value: readonly string[]
  onChange: (value: string[]) => void
}

export function ChoiceGroup<T extends ChoiceOption>(props: SingleProps<T> | MultipleProps<T>) {
  const { legend, hideLegend = true, options, className, children } = props
  const name = React.useId()
  const multiple = props.multiple === true

  const selectedValues = multiple
    ? (props.value as readonly string[])
    : props.value == null
      ? []
      : [props.value as string]

  const toggle = (v: string) => {
    if (!multiple) {
      ;(props as SingleProps<T>).onChange(v)
      return
    }
    const current = props.value as readonly string[]
    const next = current.includes(v) ? current.filter((x) => x !== v) : [...current, v]
    ;(props as MultipleProps<T>).onChange(next)
  }

  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className={hideLegend ? 'sr-only' : 'text-muted-foreground mb-2 text-xs font-semibold tracking-caps uppercase'}>
        {legend}
        {multiple ? <span className="sr-only"> (choose all that apply)</span> : null}
      </legend>
      {options.map((option) => {
        const selected = selectedValues.includes(option.value)
        return (
          <label
            key={option.value}
            className={cn(
              'group/choice block cursor-pointer',
              option.disabled && 'cursor-not-allowed opacity-60',
            )}
          >
            <input
              type={multiple ? 'checkbox' : 'radio'}
              name={name}
              value={option.value}
              checked={selected}
              disabled={option.disabled}
              onChange={() => toggle(option.value)}
              className="peer sr-only"
            />
            {children(option, { selected })}
          </label>
        )
      })}
    </fieldset>
  )
}
