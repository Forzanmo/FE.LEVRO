import type { ApplicationsSummary, DashboardOverview } from '@/features/dashboard/types'
import type { Application } from '@/features/applications/types'
import { applicationsService } from '@/services/api/applications-service'
import { authService } from '@/services/auth/auth-service'
import { journeyStorage } from '@/services/storage/journey-storage'

/**
 * Dashboard service. All dashboard data access flows through here, so swapping
 * the mock for a real endpoint is a one-function change (call httpClient.get
 * instead of returning the fixture) with no impact on UI or hooks.
 */

const MOCK_LATENCY_MS = 600

function delay<T>(value: T, ms = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/** One source of truth for the pipeline counts the dashboard and /applications
 *  both report, so they cannot disagree about how many applications exist. */
function summarizeApplications(applications: Application[]): ApplicationsSummary {
  return {
    total: applications.length,
    interviewing: applications.filter((a) => a.status === 'interview').length,
    offers: applications.filter((a) => a.status === 'offer').length,
  }
}

function buildMockOverview(): DashboardOverview {
  const now = Date.now()
  const hoursAgo = (h: number) => new Date(now - h * 3_600_000).toISOString()

  return {
    userName: 'Alex',
    isFirstRun: false,
    hasAssessment: true,
    streakDays: 5,
    skills: {
      targetRole: 'Frontend Engineer',
      skills: [
        {
          id: 'react',
          label: 'React & component architecture',
          strength: 'strong',
          evidence: 'Evidenced in two roles on your CV, with outcomes attached.',
        },
        {
          id: 'typescript',
          label: 'TypeScript',
          strength: 'strong',
          evidence: 'Named in your summary and in both recent experience entries.',
        },
        {
          id: 'testing',
          label: 'Testing',
          strength: 'partial',
          evidence: 'Mentioned once, without an outcome. One concrete example would settle it.',
        },
        {
          id: 'accessibility',
          label: 'Accessibility',
          strength: 'partial',
          evidence: 'Implied by your portfolio work but never stated in the CV itself.',
        },
        {
          id: 'system-design',
          label: 'System design',
          strength: 'missing',
          evidence: 'Not present in any document. Common in Frontend Engineer postings you saved.',
        },
      ],
    },
    documents: [
      {
        id: 'cv-northwind',
        kind: 'cv',
        title: 'Frontend Engineer — Northwind',
        role: 'Frontend Engineer',
        company: 'Northwind',
        status: 'ready',
        updatedAt: hoursAgo(3),
        template: 'minimalist',
      },
      {
        id: 'cl-northwind',
        kind: 'cover-letter',
        title: 'Cover letter — Northwind',
        role: 'Frontend Engineer',
        company: 'Northwind',
        status: 'sent',
        updatedAt: hoursAgo(4),
      },
      {
        id: 'cv-product-studio',
        kind: 'cv',
        title: 'Junior Developer — Product Studio',
        role: 'Junior Developer',
        company: 'Product Studio',
        status: 'sent',
        updatedAt: hoursAgo(72),
        template: 'ats',
      },
      {
        id: 'cv-general',
        kind: 'cv',
        title: 'General CV',
        role: 'Frontend Engineer',
        status: 'draft',
        updatedAt: hoursAgo(120),
        template: 'designer',
      },
    ],
    activity: [
      {
        id: 'a1',
        title: 'Tailored your CV for “Frontend Engineer” at Northwind',
        timestamp: hoursAgo(3),
        type: 'cv',
        icon: 'resume',
      },
      {
        id: 'a2',
        title: 'Sent a cover letter to Northwind',
        timestamp: hoursAgo(4),
        type: 'cover-letter',
        icon: 'cover-letter',
      },
      {
        id: 'a3',
        title: 'Added TypeScript evidence to your experience section',
        timestamp: hoursAgo(26),
        type: 'cv',
        icon: 'resume',
      },
      {
        id: 'a4',
        title: 'Applied to Product Studio — Junior Developer',
        timestamp: hoursAgo(72),
        type: 'application',
        icon: 'applications',
      },
    ],
    // Derived, not hardcoded. These were literals that drifted out of step with
    // the applications fixture: the dashboard claimed 12 while /applications
    // listed 14, and the two screens are one click apart.
    applications: summarizeApplications(applicationsService.getApplications()),
  }
}

/**
 * The dashboard as it genuinely is immediately after a first assessment: a
 * skills picture, and nothing else yet — no documents, no streak, no history.
 * The cards render first-run states from this rather than showing zeroes in a
 * layout designed for content.
 */
function buildFirstRunOverview(userName: string): DashboardOverview {
  const full = buildMockOverview()
  return {
    ...full,
    userName,
    isFirstRun: true,
    hasAssessment: true,
    streakDays: 0,
    // The skills picture IS earned — it is what the assessment just produced.
    documents: [],
    activity: [],
    applications: { total: 0, interviewing: 0, offers: 0 },
  }
}

export const dashboardService = {
  getOverview(): Promise<DashboardOverview> {
    // Real implementation: return httpClient.get<DashboardOverview>('/dashboard/overview')
    const userName = authService.getSession()?.user?.name ?? ''

    // Nothing downstream of the assessment exists until it has been taken.
    // Serving the seeded skills picture here would tell a brand-new visitor
    // what their strengths are before they have said a word.
    if (!journeyStorage.hasAssessment()) {
      return delay({ ...buildFirstRunOverview(userName), hasAssessment: false })
    }

    if (journeyStorage.isFirstRun()) {
      return delay(buildFirstRunOverview(userName))
    }
    return delay({ ...buildMockOverview(), userName, isFirstRun: false, hasAssessment: true })
  },
}
