import type { Meta, StoryObj } from '@storybook/nextjs'

import { APPLICATION_STATUSES } from '@/features/applications/status'

import { StatusBadge } from './status-badge'

const meta: Meta<typeof StatusBadge> = {
  title: 'Applications/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: { status: 'interview' },
  argTypes: { status: { control: 'select', options: APPLICATION_STATUSES } },
}
export default meta

type Story = StoryObj<typeof StatusBadge>

export const Playground: Story = {}

export const All: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      {APPLICATION_STATUSES.map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  ),
}
