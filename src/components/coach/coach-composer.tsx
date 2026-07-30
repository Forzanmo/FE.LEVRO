'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import type { AnswerValue, CoachAnswer, CoachQuestion } from '@/features/coach/types'

import { OptionGroup } from './option-group'

function autosize(el: HTMLTextAreaElement) {
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, 200)}px`
}

/**
 * The answer surface for the current question — a text composer or an option
 * group — plus Back/Skip controls. Prefills from any existing answer (so Back
 * and Edit resume where the user left off) and moves focus to the input.
 */
export function CoachComposer({
  question,
  existing,
  canGoBack,
  onSubmit,
  onSkip,
  onBack,
}: {
  question: CoachQuestion
  existing?: CoachAnswer
  canGoBack: boolean
  onSubmit: (value: AnswerValue) => void
  onSkip: () => void
  onBack: () => void
}) {
  const isChoice = question.type !== 'text'
  // Prefill directly from props. The parent keys this component by question id,
  // so a new question remounts and re-initializes (no state-sync effect needed).
  const [text, setText] = useState(() =>
    question.type === 'text' && typeof existing?.value === 'string' ? existing.value : '',
  )
  const [selected, setSelected] = useState<string[]>(() =>
    isChoice && Array.isArray(existing?.value) ? existing.value : [],
  )
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  // Move focus to the answer surface on mount (DOM side effect only).
  useEffect(() => {
    if (question.type === 'text') {
      const el = textareaRef.current
      if (el) {
        el.focus()
        autosize(el)
      }
    } else {
      rootRef.current?.querySelector('input')?.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canSubmit = isChoice ? selected.length > 0 : text.trim().length > 0

  const submit = () => {
    if (!canSubmit) return
    onSubmit(isChoice ? selected : text.trim())
  }

  return (
    <div className="space-y-3" ref={rootRef}>
      {isChoice ? (
        <OptionGroup
          options={question.options ?? []}
          multiple={question.type === 'multi'}
          value={selected}
          onChange={setSelected}
          legend={question.prompt}
        />
      ) : (
        <div className="relative">
          <label htmlFor="coach-answer" className="sr-only">
            Your answer
          </label>
          <textarea
            id="coach-answer"
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              autosize(e.target)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                submit()
              }
            }}
            placeholder={question.placeholder ?? 'Type your answer…'}
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 max-h-[200px] w-full resize-none rounded-xl border px-3.5 py-2.5 pr-12 text-base outline-none focus-visible:ring-2 md:text-sm"
          />
          <div className="absolute right-2 bottom-2">
            <Button size="icon-sm" onClick={submit} disabled={!canSubmit} aria-label="Send answer">
              <Icon name="send" size="sm" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {canGoBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              leftIcon={<Icon name="arrow-left" size="xs" />}
            >
              Back
            </Button>
          ) : null}
          {question.optional ? (
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground">
              Skip
            </Button>
          ) : null}
        </div>

        {isChoice ? (
          <Button
            onClick={submit}
            disabled={!canSubmit}
            rightIcon={<Icon name="arrow-right" size="sm" />}
          >
            Continue
          </Button>
        ) : (
          <span className="text-muted-foreground hidden text-xs sm:block">Press Enter to send</span>
        )}
      </div>
    </div>
  )
}
