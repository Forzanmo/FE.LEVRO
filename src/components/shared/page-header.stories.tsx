import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'

import { PageHeader } from './page-header'

const meta: Meta<typeof PageHeader> = {
  title: 'Shared/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Applications',
    description: 'Track every application from applied to offer.',
  },
}
export default meta

type Story = StoryObj<typeof PageHeader>

export const Default: Story = {}

export const WithActions: Story = {
  args: {
    actions: (
      <Button variant="gradient" leftIcon={<Icon name="add" size="sm" />}>
        Add application
      </Button>
    ),
  },
}
