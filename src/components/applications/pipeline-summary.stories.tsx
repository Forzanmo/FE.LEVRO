import type { Meta, StoryObj } from '@storybook/nextjs'

import type { Application } from '@/features/applications/types'

import { PipelineSummary } from './pipeline-summary'

const meta: Meta<typeof PipelineSummary> = {
  title: 'Applications/PipelineSummary',
  component: PipelineSummary,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof PipelineSummary>

/*
 * Its own fixture rather than `applicationsService.getApplications()`. That
 * service is gated on the assessment now, and Storybook has no journey state,
 * so calling it would render every story as an empty pipeline.
 */
const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString()

const APPLICATIONS: Application[] = [
  {
    id: 'a1',
    company: 'Vercel',
    role: 'Frontend Engineer',
    status: 'interview',
    appliedAt: daysAgo(3),
    location: 'Remote',
    source: 'Referral',
  },
  {
    id: 'a2',
    company: 'Linear',
    role: 'Product Engineer',
    status: 'screening',
    appliedAt: daysAgo(5),
    location: 'Remote (EU)',
    source: 'Careers page',
  },
  {
    id: 'a3',
    company: 'Stripe',
    role: 'UI Engineer',
    status: 'applied',
    appliedAt: daysAgo(6),
    location: 'Berlin, DE',
    source: 'LinkedIn',
  },
  {
    id: 'a4',
    company: 'Notion',
    role: 'Frontend Engineer',
    status: 'offer',
    appliedAt: daysAgo(18),
    location: 'Remote',
    source: 'Referral',
  },
  {
    id: 'a5',
    company: 'Figma',
    role: 'Design Engineer',
    status: 'rejected',
    appliedAt: daysAgo(24),
    location: 'London, UK',
    source: 'Careers page',
  },
]

export const Default: Story = {
  render: () => <PipelineSummary applications={APPLICATIONS} />,
}

/** The state a new tracker actually opens in. */
export const Empty: Story = {
  render: () => <PipelineSummary applications={[]} />,
}
