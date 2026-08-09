'use client'

import { motion, useReducedMotion } from 'motion/react'

import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

/** A user's answer, aligned right. Editable via a visible (touch-safe) control. */
export function UserAnswer({
  children,
  onEdit,
  skipped = false,
  avatarStyle = 'neutral',
  initials = 'You',
}: {
  children?: React.ReactNode
  onEdit?: () => void
  skipped?: boolean
  avatarStyle?: 'neutral' | 'woman' | 'man'
  initials?: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className="flex justify-end"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex max-w-[85%] items-center gap-2">
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit this answer"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded p-1 opacity-60 transition outline-none hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-2"
          >
            <Icon name="edit" size="xs" />
          </button>
        ) : null}
        <div
          className={cn(
            'rounded-xl rounded-tr-sm px-3.5 py-2 text-sm',
            skipped
              ? 'bg-muted text-muted-foreground italic'
              : 'bg-primary text-primary-foreground',
          )}
        >
          {skipped ? 'Skipped' : children}
        </div>
        <span
          className="bg-brand-surface text-white grid size-8 shrink-0 place-items-center rounded-full ring-1 ring-white/10"
          title={`${initials} profile icon`}
          aria-label={`${initials} profile icon`}
        >
          <Icon name={`user-${avatarStyle}`} size="xs" />
        </span>
      </div>
    </motion.div>
  )
}
