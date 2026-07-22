'use client'

import { useState } from 'react'

import { Icon } from '@/components/ui/icon'

/** Tag input for skills. Enter or comma adds; Backspace on empty removes last. */
export function SkillsInput({
  value,
  onChange,
  id,
}: {
  value: string[]
  onChange: (value: string[]) => void
  id?: string
}) {
  const [draft, setDraft] = useState('')

  const add = () => {
    const trimmed = draft.trim().replace(/,$/, '')
    if (trimmed && !value.includes(trimmed)) onChange([...value, trimmed])
    setDraft('')
  }

  const removeAt = (skill: string) => onChange(value.filter((s) => s !== skill))

  return (
    <div className="border-input focus-within:border-ring focus-within:ring-ring/50 flex flex-wrap items-center gap-1.5 rounded-xl border px-2 py-2 focus-within:ring-2">
      {value.map((skill) => (
        <span
          key={skill}
          className="bg-brand-muted text-brand inline-flex items-center gap-1 rounded-md py-0.5 pr-1 pl-2 text-sm"
        >
          {skill}
          <button
            type="button"
            onClick={() => removeAt(skill)}
            aria-label={`Remove ${skill}`}
            className="hover:text-destructive rounded p-0.5 outline-none"
          >
            <Icon name="close" size="xs" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            add()
          } else if (e.key === 'Backspace' && !draft && value.length) {
            removeAt(value[value.length - 1])
          }
        }}
        onBlur={add}
        placeholder={value.length ? 'Add another…' : 'Type a skill and press Enter'}
        className="min-w-[9rem] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
        aria-label="Add a skill"
      />
    </div>
  )
}
