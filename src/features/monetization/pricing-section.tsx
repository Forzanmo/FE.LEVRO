'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { Heading, Text } from '@/components/ui/typography'
import { ROUTES } from '@/lib/constants/routes'
import { cn } from '@/lib/utils'
import { DEFAULT_MONETIZATION, monetizationStorage } from '@/services/storage/monetization-storage'
import type { BillingPeriod } from './types'

const SHELL = 'mx-auto w-full max-w-[var(--content-max-width)] px-5 sm:px-6 lg:px-8'

export function PricingSection() {
  const [config, setConfig] = useState(DEFAULT_MONETIZATION)
  const [period, setPeriod] = useState<BillingPeriod>('month')
  const [offerOpen, setOfferOpen] = useState(true)
  const [offerEligible, setOfferEligible] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')
  const copyResetRef = useRef<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const refresh = () => setConfig(monetizationStorage.load())
    refresh()
    return monetizationStorage.subscribe(refresh)
  }, [])

  useEffect(() => () => {
    if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current)
  }, [])

  const copyOfferCode = async () => {
    setCopyState('copying')
    try {
      if (!navigator.clipboard) throw new Error('Clipboard is unavailable')
      await Promise.race([
        navigator.clipboard.writeText(config.discount.code),
        new Promise((_, reject) => window.setTimeout(() => reject(new Error('Clipboard timed out')), 600)),
      ])
      setCopyState('copied')
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = config.discount.code
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand('copy')
      textarea.remove()
      setCopyState(copied ? 'copied' : 'error')
    }
    if (copyResetRef.current !== null) window.clearTimeout(copyResetRef.current)
    copyResetRef.current = window.setTimeout(() => setCopyState('idle'), 2200)
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setOfferEligible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="pricing" className="bg-brand-surface relative isolate scroll-mt-20 overflow-hidden text-white">
      <div aria-hidden="true" className="chevron-field pricing-chevron-drift pointer-events-none absolute inset-x-0 -inset-y-4 -z-10 text-white opacity-[0.055]" />
      <div className={cn(SHELL, 'py-20 sm:py-24 lg:py-28')}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <Heading level={2} size="display-lg" tone="inherit" className="max-w-[18ch] leading-[1.12]">{config.heading}</Heading>
          <Text tone="onBrand" size="lg" measure="lead" className="text-brand-surface-muted mt-4">{config.description}</Text>
        </div>
        <div className="inline-flex w-fit rounded-xl bg-white/10 p-1" role="group" aria-label="Billing period">
          {(['month', 'year'] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={period === value}
              onClick={() => setPeriod(value)}
              className={cn(
                'focus-visible:ring-ring relative min-h-9 rounded-lg px-4 text-sm font-medium outline-none focus-visible:ring-2',
                period === value ? 'text-brand-950' : 'text-white/75 hover:text-white',
              )}
            >
              {period === value ? (
                <motion.span layoutId="billing-period" className="absolute inset-0 rounded-lg bg-white shadow-sm" transition={{ duration: reduceMotion ? 0 : 0.22 }} />
              ) : null}
              <span className="relative">{value === 'month' ? 'Monthly' : 'Annual'}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          'transition-[min-height,margin] duration-300 ease-[var(--ease-emphasized)]',
          config.discount.enabled && offerOpen ? 'mt-8 min-h-52' : 'min-h-0',
        )}
      >
        <AnimatePresence>
          {config.discount.enabled && offerOpen && offerEligible ? (
          <motion.aside
            initial={reduceMotion ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0 round 16px)' }}
            animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0 round 16px)', y: reduceMotion ? 0 : [0, -7, 0] }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ opacity: { duration: 0.25 }, clipPath: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }, y: { duration: 2.6, ease: [0.16, 1, 0.3, 1] } }}
            className="relative max-w-md rounded-2xl bg-white p-5 pr-12 text-[var(--brand-950)] shadow-[0_20px_55px_-28px_rgba(0,0,0,.7)] sm:ml-auto"
            aria-label="Subscription offer"
          >
            <button type="button" onClick={() => setOfferOpen(false)} aria-label="Dismiss offer" className="focus-visible:ring-ring absolute top-3 right-3 grid size-8 place-items-center rounded-lg text-[var(--neutral-600)] outline-none hover:bg-[var(--neutral-100)] hover:text-[var(--neutral-900)] focus-visible:ring-2">
              <Icon name="close" size="sm" />
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold text-[var(--accent-700)]">{config.discount.label}</p>
              <span className="rounded-full bg-[var(--accent-100)] px-2 py-0.5 text-xs font-semibold text-[var(--accent-800)]">
                {config.discount.percent}% off
              </span>
            </div>
            <p className="mt-1 font-semibold">{config.discount.title}</p>
            <p className="mt-1 text-sm text-[var(--neutral-600)]">{config.discount.description}</p>
            <button
              type="button"
              onClick={() => void copyOfferCode()}
              disabled={copyState === 'copying'}
              className="focus-visible:ring-ring mt-3 rounded-lg bg-[var(--neutral-100)] px-3 py-2 text-sm font-semibold outline-none hover:bg-[var(--neutral-200)] focus-visible:ring-2"
              aria-live="polite"
            >
              {copyState === 'copied'
                ? 'Code copied'
                : copyState === 'copying'
                  ? 'Copying code…'
                : copyState === 'error'
                  ? 'Copy failed — try again'
                  : `Copy code ${config.discount.code}`}
            </button>
          </motion.aside>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3 lg:items-stretch">
        {config.plans.map((plan) => {
          const price = period === 'month' ? plan.monthlyPrice : plan.yearlyPrice
          return (
            <article
              key={plan.id}
              className={cn(
                'pricing-plan relative flex flex-col rounded-2xl bg-white p-6 text-[var(--neutral-900)] shadow-[0_20px_55px_-30px_rgba(0,0,0,.65)]',
                plan.featured ? 'ring-2 ring-[var(--accent-500)] lg:-mt-3 lg:mb-3' : 'ring-1 ring-white/20',
              )}
            >
              {plan.featured ? <span className="mb-5 text-sm font-semibold text-[var(--accent-700)]">Recommended</span> : null}
              <Heading level={3} size="xl" className="text-[var(--neutral-900)]">{plan.name}</Heading>
              <Text className="mt-2 min-h-12 text-[var(--neutral-600)]">{plan.description}</Text>
              <div className="mt-6 flex items-baseline gap-1">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={`${plan.id}-${period}`}
                    initial={reduceMotion ? false : { opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: 5 }}
                    className="font-heading text-4xl font-semibold tracking-tight"
                  >
                    ${price}
                  </motion.span>
                </AnimatePresence>
                <span className="text-sm text-[var(--neutral-600)]">/{period === 'month' ? 'month' : 'year'}</span>
              </div>
              <ul className="my-7 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm">
                    <Icon name="check" size="sm" className="mt-0.5 shrink-0 text-[var(--accent-700)]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" variant={plan.featured ? 'default' : 'outline'} fullWidth>
                <Link href={ROUTES.createAccount}>{plan.cta}</Link>
              </Button>
            </article>
          )
        })}
      </div>

      </div>
    </section>
  )
}
