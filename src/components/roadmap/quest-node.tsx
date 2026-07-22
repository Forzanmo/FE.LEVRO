'use client'

import { motion, useReducedMotion } from 'motion/react'

import { Icon } from '@/components/ui/icon'
import type { QuestNodeWithStatus } from '@/features/roadmap/types'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<QuestNodeWithStatus['status'], string> = {
  completed: 'Completed',
  available: 'Available now',
  locked: 'Locked',
}

/**
 * A single tree node: a circular marker centered in its grid cell (so SVG
 * connectors meet its centre) with the title floated beneath. Active nodes
 * carry a soft pulse; the marker re-animates when its status changes (unlock).
 */
export function QuestNode({
  node,
  selected,
  celebrate = false,
  onSelect,
}: {
  node: QuestNodeWithStatus
  selected: boolean
  celebrate?: boolean
  onSelect: () => void
}) {
  const reduceMotion = useReducedMotion()
  const { status } = node

  return (
    <div className="relative flex flex-col items-center">
      {/* Beacon glow — the next available quest reads as a lit waypoint. */}
      {status === 'available' ? (
        <span
          aria-hidden="true"
          className="bg-brand/25 pointer-events-none absolute top-0 left-1/2 size-14 -translate-x-1/2 rounded-full blur-lg"
        />
      ) : null}
      <motion.button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${node.title} — ${STATUS_LABEL[status]}`}
        whileHover={reduceMotion ? undefined : { y: -3 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96, y: -1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        className={cn(
          'focus-visible:ring-ring focus-visible:ring-offset-background relative grid size-14 place-items-center rounded-full outline-none transition-[background-color,color,box-shadow] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2',
          status === 'completed' && 'bg-primary shadow-brand-glow text-primary-foreground',
          status === 'available' && 'bg-background text-brand ring-brand ring-2',
          status === 'locked' && 'bg-muted text-muted-foreground ring-border ring-1',
          selected && 'ring-offset-background ring-offset-2',
        )}
      >
        {status === 'available' && !reduceMotion ? (
          <motion.span
            aria-hidden="true"
            className="ring-brand absolute inset-0 rounded-full ring-2"
            animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        ) : null}
        {/* The earned moment: a single gold ripple when this quest is completed. */}
        {celebrate && !reduceMotion ? (
          <motion.span
            aria-hidden="true"
            className="ring-accent-500 pointer-events-none absolute inset-0 rounded-full ring-2"
            initial={{ scale: 1, opacity: 0.75 }}
            animate={{ scale: 2.2, opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
        <motion.span
          key={status}
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="grid place-items-center"
        >
          <Icon
            name={status === 'completed' ? 'check' : status === 'locked' ? 'lock' : node.icon}
            size="sm"
            variant={status === 'completed' ? 'filled' : 'outline'}
          />
        </motion.span>
      </motion.button>
      <span
        className={cn(
          'pointer-events-none absolute top-full mt-2 w-28 text-center text-xs leading-tight font-medium',
          status === 'locked' ? 'text-muted-foreground' : 'text-foreground',
        )}
      >
        {node.title}
      </span>
    </div>
  )
}
