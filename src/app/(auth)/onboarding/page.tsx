import type { Metadata } from 'next'

import { OnboardingView } from '@/features/onboarding/onboarding-view'

export const metadata: Metadata = {
  title: 'Get started',
}

export default function OnboardingPage() {
  return <OnboardingView />
}
