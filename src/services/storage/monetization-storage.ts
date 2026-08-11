import type { MonetizationConfig } from '@/features/monetization/types'

const KEY = 'levrro:monetization:v1'
const EVENT = 'levrro:monetization-change'

export const DEFAULT_MONETIZATION: MonetizationConfig = {
  heading: 'Choose the support your next move needs',
  description:
    'Start with evidence, then add the coaching and documents that move your application forward.',
  plans: [
    {
      id: 'start',
      name: 'Start',
      description: 'Understand what your CV proves before you rewrite it.',
      monthlyPrice: 0,
      yearlyPrice: 0,
      cta: 'Start free',
      featured: false,
      features: ['Career assessment', 'Skills evidence report', 'Saved profile evidence'],
    },
    {
      id: 'move',
      name: 'Move',
      description: 'Turn your evidence into application-ready documents.',
      monthlyPrice: 12,
      yearlyPrice: 108,
      cta: 'Choose Move',
      featured: true,
      features: ['Everything in Start', 'Three CV templates', 'Tailored cover letters', 'Document library'],
    },
    {
      id: 'accelerate',
      name: 'Accelerate',
      description: 'Ongoing support for an active, focused job search.',
      monthlyPrice: 24,
      yearlyPrice: 216,
      cta: 'Choose Accelerate',
      featured: false,
      features: ['Everything in Move', 'Unlimited coach sessions', 'Application tailoring', 'Priority document generation'],
    },
  ],
  discount: {
    enabled: true,
    label: 'Limited offer',
    title: 'Save 25% on your first year',
    description: 'Use the launch offer when you choose an annual plan.',
    code: 'FIRSTMOVE25',
    percent: 25,
  },
}

function valid(value: unknown): value is MonetizationConfig {
  if (!value || typeof value !== 'object') return false
  const config = value as Partial<MonetizationConfig>
  return typeof config.heading === 'string' && Array.isArray(config.plans) && config.plans.length === 3
}

export const monetizationStorage = {
  load(): MonetizationConfig {
    if (typeof window === 'undefined') return DEFAULT_MONETIZATION
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? 'null')
      return valid(parsed) ? parsed : DEFAULT_MONETIZATION
    } catch {
      return DEFAULT_MONETIZATION
    }
  },
  save(config: MonetizationConfig) {
    window.localStorage.setItem(KEY, JSON.stringify(config))
    window.dispatchEvent(new CustomEvent(EVENT))
  },
  subscribe(listener: () => void) {
    window.addEventListener(EVENT, listener)
    window.addEventListener('storage', listener)
    return () => {
      window.removeEventListener(EVENT, listener)
      window.removeEventListener('storage', listener)
    }
  },
}
