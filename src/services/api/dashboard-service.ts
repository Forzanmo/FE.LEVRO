import type { DashboardOverview, HeatmapDay, HeatmapLevel } from '@/features/dashboard/types'

/**
 * Dashboard service. All dashboard data access flows through here, so swapping
 * the mock for a real endpoint is a one-function change (call httpClient.get
 * instead of returning the fixture) with no impact on UI or hooks.
 */

const MOCK_LATENCY_MS = 600

function delay<T>(value: T, ms = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/** 13 weeks of deterministic daily-activity levels, trending up into a streak. */
function buildHeatmap(now: number): HeatmapDay[] {
  const days: HeatmapDay[] = []
  for (let i = 90; i >= 0; i--) {
    const d = new Date(now - i * 86_400_000)
    const dow = d.getDay()
    const h = (i * 2654435761) >>> 0
    let level = h % 5
    if (dow === 0 || dow === 6) level = Math.max(0, level - 2) // lighter weekends
    if (i < 6) level = Math.min(4, level + 2) // recent days build the streak
    else if (i < 14) level = Math.min(4, level + 1)
    if (h % 13 === 0) level = 0 // the occasional rest day
    days.push({ date: d.toISOString().slice(0, 10), level: level as HeatmapLevel })
  }
  return days
}

function buildMockOverview(): DashboardOverview {
  const now = Date.now()
  const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString()

  return {
    userName: 'Alex',
    streakDays: 5,
    score: {
      overall: 68,
      delta: 6,
      categories: [
        {
          id: 'experience',
          label: 'Work Experience',
          score: 72,
          reasoning:
            'Two relevant internships with quantified impact. Add one more outcome metric to your latest role to push this higher.',
        },
        {
          id: 'skills',
          label: 'Skills Alignment',
          score: 64,
          reasoning:
            '8 of 12 target-role skills are evidenced in your profile. TypeScript and system design are the highest-leverage gaps.',
        },
        {
          id: 'resume',
          label: 'Resume Quality',
          score: 81,
          reasoning:
            'Strong structure and action verbs. Tighten the summary to a single sentence for a recruiter-friendly scan.',
        },
        {
          id: 'interview',
          label: 'Interview Readiness',
          score: 52,
          reasoning:
            'You have completed 3 of 8 core behavioural drills. Finish the STAR set to close the biggest score gap.',
        },
      ],
    },
    mission: {
      id: 'star-drills',
      title: 'Finish 2 STAR interview drills',
      description: 'Interview readiness is your lowest category — 20 minutes here moves your score the most.',
      xp: 120,
      estimatedMinutes: 20,
      icon: 'target',
    },
    roadmap: {
      completed: 4,
      total: 12,
      nextQuest: 'Finish the STAR interview set',
    },
    heatmap: buildHeatmap(now),
    activity: [
      { id: 'a1', title: 'Generated a tailored resume for “Frontend Engineer”', timestamp: hoursAgo(3), type: 'resume', icon: 'resume' },
      { id: 'a2', title: 'Completed AI Coach: strengths assessment', timestamp: hoursAgo(26), type: 'coach', icon: 'coach' },
      { id: 'a3', title: 'Unlocked “First Milestone” achievement', timestamp: hoursAgo(49), type: 'achievement', icon: 'achievements' },
      { id: 'a4', title: 'Applied to Product Studio — Junior Developer', timestamp: hoursAgo(72), type: 'application', icon: 'applications' },
    ],
    applications: { total: 12, interviewing: 3, offers: 1 },
  }
}

export const dashboardService = {
  getOverview(): Promise<DashboardOverview> {
    // Real implementation: return httpClient.get<DashboardOverview>('/dashboard/overview')
    return delay(buildMockOverview())
  },
}
