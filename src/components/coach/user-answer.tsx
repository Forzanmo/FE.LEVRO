'use client'

import { motion, useReducedMotion } from 'motion/react'

import { Icon } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

/** A user's answer, aligned right. Editable via a visible (touch-safe) control. */
export function UserAnswer({
  children,
  onEdit,
  skipped = false,
}: {
  children?: React.ReactNode
  onEdit?: () => void
  skipped?: boolean
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
      </div>
    </motion.div>
  )
}
