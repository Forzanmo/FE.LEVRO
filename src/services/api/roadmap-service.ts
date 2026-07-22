import type { RoadmapData } from '@/features/roadmap/types'

/**
 * Roadmap quest graph (mock). A branching, converging tree from assessment to
 * offer. Status is derived from the set of completed quests (see use-roadmap),
 * so this stays a pure description of the graph and its prerequisites.
 */
const ROADMAP: RoadmapData = {
  cols: 3,
  initialCompleted: ['kickoff', 'role', 'skills'],
  nodes: [
    {
      id: 'kickoff',
      title: 'Career Kickoff',
      description: 'You completed your assessment and set a measurable baseline. The journey starts here.',
      xp: 40,
      icon: 'sparkles',
      tier: 0,
      col: 1,
      requires: [],
    },
    {
      id: 'role',
      title: 'Define target role',
      description: 'You named the role you are aiming for, so every next step is measured against a real bar.',
      xp: 30,
      icon: 'target',
      tier: 1,
      col: 0,
      requires: ['kickoff'],
    },
    {
      id: 'skills',
      title: 'Skills audit',
      description: 'You mapped your current skills against the role and surfaced the highest-leverage gaps.',
      xp: 30,
      icon: 'learning',
      tier: 1,
      col: 2,
      requires: ['kickoff'],
    },
    {
      id: 'portfolio',
      title: 'Build a portfolio project',
      description: 'Ship one focused project that proves your target-role skills with real, visible work.',
      xp: 80,
      icon: 'zap',
      tier: 2,
      col: 0,
      requires: ['role'],
    },
    {
      id: 'resume',
      title: 'Fix resume gaps',
      description: 'Turn your experience into recruiter-scannable evidence with quantified outcomes.',
      xp: 60,
      icon: 'resume',
      tier: 2,
      col: 2,
      requires: ['skills'],
    },
    {
      id: 'publish',
      title: 'Publish & get feedback',
      description: 'Put your project and resume in front of real people and fold in what they tell you.',
      xp: 70,
      icon: 'preview',
      tier: 3,
      col: 1,
      requires: ['portfolio', 'resume'],
    },
    {
      id: 'mock',
      title: 'Mock interviews',
      description: 'Rehearse technical rounds under realistic pressure until they feel routine.',
      xp: 90,
      icon: 'message',
      tier: 4,
      col: 0,
      requires: ['publish'],
    },
    {
      id: 'behavioral',
      title: 'Behavioral drills',
      description: 'Build a bank of STAR stories so behavioral questions become easy wins.',
      xp: 70,
      icon: 'star',
      tier: 4,
      col: 2,
      requires: ['publish'],
    },
    {
      id: 'applications',
      title: 'First applications',
      description: 'Apply with intent — tailored assets, tracked outcomes, steady volume.',
      xp: 100,
      icon: 'applications',
      tier: 5,
      col: 1,
      requires: ['mock', 'behavioral'],
    },
    {
      id: 'offer',
      title: 'Land the offer',
      description: 'The goal: recruiter-ready, interviewing with confidence, and negotiating from strength.',
      xp: 150,
      icon: 'achievements',
      tier: 6,
      col: 1,
      requires: ['applications'],
    },
  ],
}

export const roadmapService = {
  getRoadmap(): RoadmapData {
    return ROADMAP
  },
}
