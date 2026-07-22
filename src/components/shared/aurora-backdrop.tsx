'use client'

import { useEffect, useState } from 'react'
import { MeshGradient } from '@paper-design/shaders-react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

// Brand-family hues for the WebGL mesh: deep teal → teal → aqua → warm gold.
const MESH_COLORS = ['#008687', '#1aa9a8', '#52c9c6', '#e7a929']

/**
 * Full-page dynamic gradient background for the brand surfaces (landing, auth).
 * Replaces the flat `--background` with a living gradient that covers the whole
 * viewport — never a plain block of white/black.
 *
 * Layered for richness AND robustness:
 *   1. a token gradient wash + drifting aurora glows — pure CSS, server-rendered,
 *      so the gradient is present on the first frame and covers top-to-bottom;
 *   2. a WebGL `MeshGradient` (the `@paper-design/shaders-react` library) that
 *      fades in on top for continuous organic motion.
 *
 * `fixed`, so the gradient stays put while content scrolls. Every layer freezes
 * under `prefers-reduced-motion`. Decorative only (`aria-hidden`), theme-aware
 * via the gradient tokens, and kept translucent so text stays legible.
 */
export function AuroraBackdrop({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion()
  const [showMesh, setShowMesh] = useState(false)

  // Run the continuous WebGL mesh only on reasonably capable devices. Low-end
  // phones, data-saver, and reduced-motion fall back to the static CSS wash +
  // drifting glows below — no WebGL context, no per-frame battery cost.
  useEffect(() => {
    if (reduceMotion) return
    const nav = navigator as Navigator & {
      deviceMemory?: number
      connection?: { saveData?: boolean }
    }
    const cores = nav.hardwareConcurrency ?? 0
    const mem = nav.deviceMemory // undefined off Chromium — don't penalize
    const saveData = nav.connection?.saveData ?? false
    setShowMesh(cores >= 4 && (mem === undefined || mem >= 4) && !saveData)
  }, [reduceMotion])

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none fixed inset-0 -z-10 overflow-hidden', className)}
    >
      {/* Base wash — a brand gradient across the entire viewport (tinted even at the
          bottom), so no part of the page is ever flat. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(158deg,' +
            ' color-mix(in oklab, var(--gradient-from) 55%, transparent) 0%,' +
            ' color-mix(in oklab, var(--gradient-via) 40%, transparent) 30%,' +
            ' color-mix(in oklab, var(--gradient-to) 30%, transparent) 60%,' +
            ' color-mix(in oklab, var(--gradient-from) 20%, transparent) 100%)',
        }}
      />

      {/* Drifting aurora glows (frozen under reduced-motion). */}
      <div
        className="absolute -top-40 left-[8%] h-[46rem] w-[46rem] rounded-full opacity-45 blur-3xl dark:opacity-60"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--gradient-from) 58%, transparent), transparent 66%)',
          animation: 'aurora-drift-a 28s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -top-24 right-[-8rem] h-[42rem] w-[42rem] rounded-full opacity-40 blur-3xl dark:opacity-55"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--gradient-to) 54%, transparent), transparent 66%)',
          animation: 'aurora-drift-b 34s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[-10rem] left-1/3 h-[44rem] w-[44rem] rounded-full opacity-35 blur-3xl dark:opacity-50"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--gradient-via) 52%, transparent), transparent 66%)',
          animation: 'aurora-drift-c 40s ease-in-out infinite',
        }}
      />

      {/* WebGL mesh — capable devices only (gated in the effect above); fades in
          client-side so there is no first-paint pop and no SSR WebGL. */}
      {showMesh ? (
        <motion.div
          className="absolute inset-0 dark:mix-blend-plus-lighter"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.16 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <MeshGradient
            className="h-full w-full"
            colors={MESH_COLORS}
            distortion={0.85}
            swirl={0.65}
            speed={0.4}
          />
        </motion.div>
      ) : null}

      {/* Faint dot texture for depth. */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(color-mix(in oklab, var(--foreground) 12%, transparent) 1px, transparent 1.6px)',
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  )
}
