import type { Application } from '@/features/applications/types'

/**
 * Applications service (mock). Returns the user's tracked applications. A real
 * implementation would fetch these; the editor/table are unaffected.
 */
export const applicationsService = {
  getApplications(): Application[] {
    const now = Date.now()
    const daysAgo = (d: number) => new Date(now - d * 86_400_000).toISOString()

    return [
      { id: 'a1', company: 'Vercel', role: 'Frontend Engineer', status: 'interview', appliedAt: daysAgo(3), location: 'Remote', source: 'Referral' },
      { id: 'a2', company: 'Linear', role: 'Product Engineer', status: 'screening', appliedAt: daysAgo(5), location: 'Remote (EU)', source: 'Careers page' },
      { id: 'a3', company: 'Stripe', role: 'UI Engineer', status: 'applied', appliedAt: daysAgo(6), location: 'Berlin, DE', source: 'LinkedIn' },
      { id: 'a4', company: 'Notion', role: 'Frontend Engineer', status: 'offer', appliedAt: daysAgo(18), location: 'Remote', source: 'Referral' },
      { id: 'a5', company: 'Figma', role: 'Design Engineer', status: 'rejected', appliedAt: daysAgo(24), location: 'London, UK', source: 'Careers page' },
      { id: 'a6', company: 'Supabase', role: 'Frontend Engineer', status: 'interview', appliedAt: daysAgo(9), location: 'Remote', source: 'Twitter' },
      { id: 'a7', company: 'Raycast', role: 'Frontend Engineer', status: 'applied', appliedAt: daysAgo(2), location: 'Remote', source: 'LinkedIn' },
      { id: 'a8', company: 'PostHog', role: 'Product Engineer', status: 'screening', appliedAt: daysAgo(11), location: 'Remote', source: 'AngelList' },
      { id: 'a9', company: 'Retool', role: 'Frontend Engineer', status: 'applied', appliedAt: daysAgo(1), location: 'Remote (US)', source: 'Careers page' },
      { id: 'a10', company: 'Cal.com', role: 'Full-stack Engineer', status: 'rejected', appliedAt: daysAgo(30), location: 'Remote', source: 'GitHub' },
      { id: 'a11', company: 'Resend', role: 'Frontend Engineer', status: 'interview', appliedAt: daysAgo(7), location: 'Remote', source: 'Referral' },
      { id: 'a12', company: 'Clerk', role: 'UI Engineer', status: 'applied', appliedAt: daysAgo(4), location: 'Remote', source: 'LinkedIn' },
      { id: 'a13', company: 'Neon', role: 'Frontend Engineer', status: 'screening', appliedAt: daysAgo(13), location: 'Remote (EU)', source: 'Careers page' },
      { id: 'a14', company: 'Framer', role: 'Design Engineer', status: 'applied', appliedAt: daysAgo(8), location: 'Amsterdam, NL', source: 'Twitter' },
    ]
  },
}
