import type { Meta, StoryObj } from '@storybook/nextjs'

import { CoverLetterPreview } from './cover-letter-preview'

const meta: Meta<typeof CoverLetterPreview> = {
  title: 'CoverLetter/CoverLetterPreview',
  component: CoverLetterPreview,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta

type Story = StoryObj<typeof CoverLetterPreview>

export const Empty: Story = { args: { letter: null, isGenerating: false } }

export const Generating: Story = { args: { letter: null, isGenerating: true } }

export const Generated: Story = {
  args: {
    isGenerating: false,
    letter: {
      greeting: 'Dear Hiring Manager,',
      paragraphs: [
        'I am writing to express my strong interest in the Frontend Engineer position at Vercel.',
        'A few things I would bring: shipped a component library used across four products; cut load time by 38%.',
        'What draws me to Vercel specifically is the chance to do that work with a team that sweats the details.',
        'I would welcome the opportunity to discuss how I can contribute. My resume is attached.',
      ],
      signoff: 'Sincerely,',
      name: 'Alex Rivera',
    },
  },
}
