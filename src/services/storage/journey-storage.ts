/**
 * Where the user is in their journey, independent of any single feature.
 *
 * The dashboard used to return a fixture unconditionally, so someone who had
 * just finished their first assessment was greeted with "Welcome back, Alex", a
 * five-day streak they never earned, and twelve applications they never made.
 * The end of the first session is what the whole session is remembered by, so
 * it has to be true.
 */
const STORAGE_KEY = 'levvro:journey'

export interface JourneyState {
  /** ISO timestamp of the first completed assessment, or null. */
  assessmentCompletedAt: string | null
  /** Set once the dashboard has been seen, so first-run states show once. */
  dashboardSeenAt: string | null
}

const EMPTY: JourneyState = { assessmentCompletedAt: null, dashboardSeenAt: null }

function read(): JourneyState {
  if (typeof window === 'undefined') return EMPTY
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const parsed = JSON.parse(raw) as Partial<JourneyState>
    return {
      assessmentCompletedAt: parsed.assessmentCompletedAt ?? null,
      dashboardSeenAt: parsed.dashboardSeenAt ?? null,
    }
  } catch {
    return EMPTY
  }
}

function write(next: JourneyState): JourneyState {
  if (typeof window === 'undefined') return next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (error) {
    // Still not worth failing a render over — but a silent failure here means
    // the gate reads "no assessment" forever, so the user retakes an assessment
    // they already finished. Loud enough to diagnose, quiet enough to survive.
    console.error('Journey state could not be saved to localStorage', error)
  }
  return next
}

export const journeyStorage = {
  get: read,

  markAssessmentComplete(): JourneyState {
    const current = read()
    if (current.assessmentCompletedAt) return current
    return write({ ...current, assessmentCompletedAt: new Date().toISOString() })
  },

  markDashboardSeen(): JourneyState {
    const current = read()
    if (current.dashboardSeenAt) return current
    return write({ ...current, dashboardSeenAt: new Date().toISOString() })
  },

  /** Has the user actually completed the assessment? Nothing downstream of it
   *  — the skills picture, documents, history — exists before this is true. */
  hasAssessment(): boolean {
    return read().assessmentCompletedAt !== null
  },

  /**
   * True in the window between finishing the assessment and first seeing the
   * dashboard.
   *
   * This deliberately requires BOTH conditions. Keying only on
   * `dashboardSeenAt === null` was wrong in both directions: it was true for
   * someone who had never touched the assessment (so the dashboard greeted a
   * brand-new visitor as though work had been done), and it flipped false the
   * moment the dashboard was first dismissed (so a streak and twelve
   * applications the user never made reappeared on the next fetch).
   */
  isFirstRun(): boolean {
    const state = read()
    return state.assessmentCompletedAt !== null && state.dashboardSeenAt === null
  },

  reset(): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* nothing actionable */
    }
  },
}
