import type { Meta, StoryObj } from '@storybook/nextjs'

import type { Achievement } from '@/features/achievements/types'

import { AchievementCard } from './achievement-card'

const base: Achievement = {
  id: 'earned',
  title: 'Recruiter-Ready Resume',
  description: 'Polished your resume to an 80+ quality score.',
  icon: 'resume',
  xp: 80,
  status: 'earned',
}

const meta: Meta<typeof AchievementCard> = {
  title: 'Achievements/AchievementCard',
  component: AchievementCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { achievement: base },
}
export default meta

type Story = StoryObj<typeof AchievementCard>

export const Earned: Story = {}

export const InProgress: Story = {
  args: {
    achievement: {
      id: 'progress',
      title: 'Quest Master',
      description: 'Complete 10 roadmap quests.',
      icon: 'roadmap',
      xp: 120,
      status: 'in-progress',
      progress: { current: 3, target: 10 },
    },
  },
}

export const Locked: Story = {
  args: {
    achievement: {
      id: 'locked',
      title: 'Land the offer',
      description: 'Land an offer.',
      icon: 'achievements',
      xp: 250,
      status: 'locked',
    },
  },
}
