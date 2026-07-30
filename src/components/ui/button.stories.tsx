import type { Meta, StoryObj } from '@storybook/nextjs'

import { Icon } from '@/components/ui/icon'

import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Continue' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'gradient', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: { control: 'select', options: ['xs', 'sm', 'default', 'lg', 'xl'] },
  },
}
export default meta

type Story = StoryObj<typeof Button>

export const Default: Story = {}
export const Gradient: Story = { args: { variant: 'gradient' } }
export const WithIcons: Story = {
  args: {
    leftIcon: <Icon name="sparkles" size="sm" />,
    rightIcon: <Icon name="arrow-right" size="sm" />,
  },
}
export const Loading: Story = { args: { isLoading: true, children: 'Saving' } }

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(
        ['default', 'gradient', 'outline', 'secondary', 'ghost', 'destructive', 'link'] as const
      ).map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}
