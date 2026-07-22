import type { Meta, StoryObj } from '@storybook/nextjs'

import { StatCard } from './stat-card'

const meta: Meta<typeof StatCard> = {
  title: 'Shared/StatCard',
  component: StatCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Career score',
    value: 68,
    icon: 'target',
    tone: 'brand',
    delta: { value: '+6 pts', trend: 'up' },
  },
}
export default meta

type Story = StoryObj<typeof StatCard>

export const Default: Story = {}

export const Tones: Story = {
  render: () => (
    <div className="grid max-w-2xl grid-cols-2 gap-4">
      <StatCard label="Career score" value={68} icon="target" tone="brand" delta={{ value: '+6 pts', trend: 'up' }} />
      <StatCard label="Day streak" value={5} icon="streak" tone="warning" />
      <StatCard label="Interviewing" value={3} icon="applications" tone="info" />
      <StatCard label="Offers" value={1} icon="achievements" tone="success" />
    </div>
  ),
}
