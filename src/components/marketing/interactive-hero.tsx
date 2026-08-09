'use client'

import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type InteractiveHeroProps = {
  children: ReactNode
  className?: string
}

export function InteractiveHero({ children, className }: InteractiveHeroProps) {
  const surfaceRef = useRef<HTMLElement>(null)
  const frameRef = useRef<number | null>(null)
  const interactiveRef = useRef(false)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateCapability = () => {
      interactiveRef.current = finePointer.matches && !reducedMotion.matches
    }

    updateCapability()
    finePointer.addEventListener('change', updateCapability)
    reducedMotion.addEventListener('change', updateCapability)

    return () => {
      finePointer.removeEventListener('change', updateCapability)
      reducedMotion.removeEventListener('change', updateCapability)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  const updatePointer = (event: PointerEvent<HTMLElement>) => {
    if (!interactiveRef.current || !surfaceRef.current) return
    const surface = surfaceRef.current
    const bounds = surface.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height

    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => {
      surface.style.setProperty('--pointer-x', `${(x * 100).toFixed(2)}%`)
      surface.style.setProperty('--pointer-y', `${(y * 100).toFixed(2)}%`)
      surface.style.setProperty('--pointer-dx', (x - 0.5).toFixed(3))
      surface.style.setProperty('--pointer-dy', (y - 0.5).toFixed(3))
    })
  }

  const resetPointer = () => {
    const surface = surfaceRef.current
    if (!surface) return
    surface.style.setProperty('--pointer-x', '82%')
    surface.style.setProperty('--pointer-y', '2%')
    surface.style.setProperty('--pointer-dx', '0')
    surface.style.setProperty('--pointer-dy', '0')
  }

  return (
    <section
      ref={surfaceRef}
      className={cn('interactive-hero', className)}
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      {children}
    </section>
  )
}
