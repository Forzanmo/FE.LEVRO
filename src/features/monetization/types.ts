export type BillingPeriod = 'month' | 'year'

export interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  cta: string
  featured: boolean
  features: string[]
}

export interface DiscountOffer {
  enabled: boolean
  label: string
  title: string
  description: string
  code: string
  percent: number
}

export interface MonetizationConfig {
  heading: string
  description: string
  plans: [PricingPlan, PricingPlan, PricingPlan]
  discount: DiscountOffer
}
