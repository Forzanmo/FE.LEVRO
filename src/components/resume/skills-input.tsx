'use client'

import { useState } from 'react'

import { Icon } from '@/components/ui/icon'
import { RESUME_LIMITS } from '@/lib/validators/resume-schema'

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
  const full = value.length >= RESUME_LIMITS.skills

  const add = () => {
    // Trim to the cap rather than refusing the entry: someone pasting a phrase
    // meant to add a skill, and the chip they get back shows exactly what was
    // kept. Silently dropping their input would just look broken.
    const trimmed = draft.trim().replace(/,$/, '').slice(0, RESUME_LIMITS.skill)
    if (trimmed && !full && !value.includes(trimmed)) onChange([...value, trimmed])
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
            /*
             * Two fixes. `after:` expands an 18px visual target to clear the
             * 24px touch floor without changing the chip's layout — the same
             * pattern the Switch and the coach disclosure use. And `outline-none`
             * had no replacement, so this button was invisible to keyboard focus
             * entirely; removing an outline without providing another indicator
             * is a keyboard regression, not a styling choice.
             */
            className="hover:text-destructive focus-visible:ring-ring relative rounded p-0.5 outline-none after:absolute after:-inset-1.5 focus-visible:ring-2"
          >
            <Icon name="close" size="xs" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        disabled={full}
        maxLength={RESUME_LIMITS.skill}
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
        placeholder={
          full
            ? `${RESUME_LIMITS.skills} skills is the maximum`
            : value.length
              ? 'Add another…'
              : 'Type a skill and press Enter'
        }
        className="min-w-[9rem] flex-1 bg-transparent px-1 py-0.5 text-sm outline-none disabled:cursor-not-allowed"
        aria-label="Add a skill"
      />
    </div>
  )
}
