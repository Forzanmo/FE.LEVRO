'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import type { QuestNodeWithStatus, QuestStatus } from '@/features/roadmap/types'

import { QuestNode } from './quest-node'

const ROW_HEIGHT_REM = 7

interface Point {
  x: number
  y: number
}
interface Connector {
  id: string
  from: Point
  to: Point
  status: QuestStatus
  toTier: number
}

const pathOf = (from: Point, to: Point): string => {
  const dy = (to.y - from.y) * 0.5
  return `M ${from.x} ${from.y} C ${from.x} ${from.y + dy} ${to.x} ${to.y - dy} ${to.x} ${to.y}`
}

const strokeFor = (status: QuestStatus): string =>
  status === 'locked' ? 'var(--border)' : 'var(--brand)'

/**
 * A gold energy pulse that travels a connector once, when a quest completes and
 * unlocks the next. SMIL `beginElement()` fires it on insertion regardless of
 * the SVG document timeline age — a plain `begin="0s"` would not replay for an
 * element mounted long after the SVG first painted.
 */
function TravelPulse({ d }: { d: string }) {
  const glow = useRef<SVGAnimateMotionElement>(null)
  const core = useRef<SVGAnimateMotionElement>(null)

  useEffect(() => {
    glow.current?.beginElement()
    core.current?.beginElement()
  }, [])

  return (
    <g>
      <circle r={10} fill="var(--accent-500)" opacity={0.55} filter="url(#quest-pulse-glow)">
        <animateMotion
          ref={glow}
          dur="0.95s"
          path={d}
          begin="indefinite"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.4 0 0.2 1"
        />
      </circle>
      <circle r={4} fill="var(--accent-300)">
        <animateMotion
          ref={core}
          dur="0.95s"
          path={d}
          begin="indefinite"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.4 0 0.2 1"
        />
      </circle>
    </g>
  )
}

/**
 * The quest tree, rendered as a living map. HTML node buttons are grid-placed by
 * (tier, col); a measured, pixel-space SVG layer draws the connectors between
 * prerequisite centres — measured (not a stretched viewBox) so the travelling
 * pulses stay perfectly round. Connectors draw in tier-by-tier on mount; edges
 * into the next available quest carry ambient flowing energy; completing a quest
 * sends a gold pulse along the newly-opened edge (`pulseEdges`). The SVG is
 * decorative (aria-hidden); screen readers get the nodes in tier order.
 */
export function QuestTree({
  cols,
  nodes,
  selectedId,
  celebrateId,
  pulseEdges = [],
  onSelect,
}: {
  cols: number
  nodes: QuestNodeWithStatus[]
  selectedId: string | null
  celebrateId?: string | null
  pulseEdges?: string[]
  onSelect: (id: string) => void
}) {
  const reduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)

  const rows = Math.max(...nodes.map((n) => n.tier)) + 1

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const byId = new Map(nodes.map((n) => [n.id, n]))
  const center = (tier: number, col: number, w: number, h: number): Point => ({
    x: ((col + 0.5) / cols) * w,
    y: ((tier + 0.5) / rows) * h,
  })

  const connectors: Connector[] =
    size == null
      ? []
      : nodes.flatMap((node) =>
          node.requires.flatMap((reqId) => {
            const parent = byId.get(reqId)
            if (!parent) return []
            return [
              {
                id: `${reqId}-${node.id}`,
                from: center(parent.tier, parent.col, size.w, size.h),
                to: center(node.tier, node.col, size.w, size.h),
                status: node.status,
                toTier: node.tier,
              },
            ]
          }),
        )

  const connectorById = new Map(connectors.map((c) => [c.id, c]))

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-xl min-w-[26rem]"
      style={{ height: `${rows * ROW_HEIGHT_REM}rem` }}
    >
      {size != null ? (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${size.w} ${size.h}`}
          aria-hidden="true"
        >
          <defs>
            <filter id="quest-pulse-glow" x="-75%" y="-75%" width="250%" height="250%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {connectors.map((c) => (
            <motion.path
              key={c.id}
              d={pathOf(c.from, c.to)}
              fill="none"
              stroke={strokeFor(c.status)}
              strokeOpacity={c.status === 'available' ? 0.4 : c.status === 'locked' ? 0.9 : 1}
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={c.status === 'locked' ? '2 6' : undefined}
              initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: c.toTier * 0.08, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}

          {/* Ambient energy along the active frontier — edges into the next
              available quest. CSS-animated; frozen to a static dotted line by the
              global reduced-motion rule. */}
          {connectors
            .filter((c) => c.status === 'available')
            .map((c) => (
              <path
                key={`flow-${c.id}`}
                className="quest-flow"
                d={pathOf(c.from, c.to)}
                fill="none"
                stroke="var(--brand)"
                strokeOpacity={0.85}
                strokeWidth={2}
                strokeLinecap="round"
              />
            ))}

          {/* The earned moment: gold pulses travel the edges this quest opened. */}
          {!reduceMotion &&
            pulseEdges.map((id) => {
              const c = connectorById.get(id)
              return c ? <TravelPulse key={`pulse-${id}`} d={pathOf(c.from, c.to)} /> : null
            })}
        </svg>
      ) : null}

      <div
        className="relative grid h-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
      >
        {nodes.map((node) => (
          <div
            key={node.id}
            style={{ gridColumn: node.col + 1, gridRow: node.tier + 1 }}
            className="relative grid place-items-center"
          >
            <QuestNode
              node={node}
              selected={selectedId === node.id}
              celebrate={celebrateId === node.id}
              onSelect={() => onSelect(node.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
