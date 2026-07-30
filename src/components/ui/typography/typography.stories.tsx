import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Heading, Text } from './index'

const meta: Meta = {
  title: 'UI/Typography',
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj

export const Headings: Story = {
  render: () => (
    <div className="space-y-3">
      {(['6xl', '5xl', '4xl', '3xl', '2xl', 'xl', 'lg'] as const).map((size) => (
        <Heading key={size} size={size}>
          The quick brown fox ({size})
        </Heading>
      ))}
      <Heading size="4xl" tone="brand">
        Brand display heading
      </Heading>
    </div>
  ),
}

export const BodyText: Story = {
  render: () => (
    <div className="max-w-prose space-y-3">
      <Text size="lg">Large lead paragraph for introductions.</Text>
      <Text>Default body text used across the product interface.</Text>
      <Text tone="muted">Muted text for secondary information and captions.</Text>
      <Text tone="brand" weight="medium">
        Brand-toned emphasis.
      </Text>
    </div>
  ),
}
