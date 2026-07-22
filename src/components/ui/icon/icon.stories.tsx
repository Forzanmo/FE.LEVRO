import type { Meta, StoryObj } from '@storybook/nextjs'

import { Icon } from './icon'
import { iconRegistry } from './registry'

const meta: Meta<typeof Icon> = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'sparkles', size: 'lg', variant: 'outline', tone: 'brand' },
  argTypes: {
    name: { control: 'select', options: Object.keys(iconRegistry) },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: { control: 'inline-radio', options: ['outline', 'rounded', 'filled', 'duotone'] },
    tone: {
      control: 'select',
      options: ['current', 'foreground', 'muted', 'brand', 'success', 'warning', 'danger', 'info'],
    },
  },
}
export default meta

type Story = StoryObj<typeof Icon>

export const Playground: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="flex items-center gap-6">
      {(['outline', 'rounded', 'filled', 'duotone'] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Icon {...args} variant={variant} size="xl" />
          <span className="text-muted-foreground text-xs">{variant}</span>
        </div>
      ))}
    </div>
  ),
}

export const Gallery: Story = {
  render: () => (
    <div className="grid grid-cols-8 gap-4">
      {Object.keys(iconRegistry).map((name) => (
        <div key={name} className="flex flex-col items-center gap-1">
          <Icon name={name as keyof typeof iconRegistry} size="md" />
          <span className="text-muted-foreground text-[0.6rem]">{name}</span>
        </div>
      ))}
    </div>
  ),
}
