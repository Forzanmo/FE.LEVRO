import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Icon } from '@/components/ui/icon'

import { TextField } from './text-field'

const meta: Meta<typeof TextField> = {
  title: 'UI/TextField',
  component: TextField,
  tags: ['autodocs'],
  args: { label: 'Email', placeholder: 'you@example.com' },
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof TextField>

export const Default: Story = {}

export const WithDescription: Story = {
  args: { description: 'We’ll only use this to send your career report.' },
}

export const Required: Story = { args: { required: true } }

export const WithError: Story = {
  args: { error: 'Please enter a valid email address.', defaultValue: 'not-an-email' },
}

export const WithAdornment: Story = {
  args: {
    leftAdornment: <Icon name="search" size="sm" />,
    label: 'Search',
    placeholder: 'Search…',
  },
}
