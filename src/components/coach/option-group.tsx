'use client'

import { ChoiceGroup } from '@/components/ui/choice-group'
import { Icon } from '@/components/ui/icon'
import type { QuestionOption } from '@/features/coach/types'
import { cn } from '@/lib/utils'

/**
 * The coach's answer options.
 *
 * Layout only — `ChoiceGroup` owns the fieldset, the legend, the native
 * radio/checkbox inputs, and the focus-visible convention, so this file no
 * longer reimplements keyboard handling or accessible naming. See
 * `components/ui/choice-group.tsx` for why that mechanism is shared.
 */
export function OptionGroup({
  options,
  multiple,
  value,
  onChange,
  legend,
}: {
  options: QuestionOption[]
  multiple: boolean
  value: string[]
  onChange: (value: string[]) => void
  /**
   * The question these options answer. The visible question lives in a separate
   * `role="log"` region, so it cannot label this group by proximity — without a
   * legend a screen-reader user hears "radio button, 1 of 4, Student / new grad"
   * with no question attached.
   */
  legend: string
}) {
  const shared = { legend, options, className: 'flex flex-col gap-2' } as const

  const row = (option: QuestionOption, selected: boolean) => (
    <span
      className={cn(
        'flex items-center gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors',
        'group-has-[:focus-visible]/choice:ring-ring group-has-[:focus-visible]/choice:ring-2',
        selected ? 'border-brand bg-brand-muted text-foreground' : 'border-border hover:bg-muted',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'grid size-4 shrink-0 place-items-center border',
          // rounded-sm, not a one-off 6px: the checkbox indicator belongs on the
          // documented radius scale like everything else.
          multiple ? 'rounded-sm' : 'rounded-full',
          selected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/40',
        )}
      >
        {selected ? <Icon name="check" size="xs" className="size-3" /> : null}
      </span>
      <span className="flex-1">{option.label}</span>
    </span>
  )

  return multiple ? (
    <ChoiceGroup {...shared} multiple value={value} onChange={onChange}>
      {(option, { selected }) => row(option, selected)}
    </ChoiceGroup>
  ) : (
    <ChoiceGroup {...shared} value={value[0] ?? null} onChange={(v) => onChange([v])}>
      {(option, { selected }) => row(option, selected)}
    </ChoiceGroup>
  )
}
