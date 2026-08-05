import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'

import { EmptyState } from './empty-state'

const meta: Meta<typeof EmptyState> = {
  title: 'Shared/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    icon: 'applications',
    title: 'No applications found',
    description: 'Try clearing your search or filters, or add your first application.',
  },
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const Default: Story = {}

export const WithAction: Story = {
  args: {
    action: <Button leftIcon={<Icon name="add" size="sm" />}>Add application</Button>,
  },
}
