import { z } from 'zod'

/**
 * Career-assessment session persistence. A thin, SSR-safe wrapper over
 * localStorage; the only place an in-progress assessment is read from or
 * written to the browser. Swappable for a server-backed store without touching
 * the coach.
 *
 * This exists because the assessment used to live entirely in a `useReducer`.
 * The UI offered "Save & exit", and leaving discarded every answer — twenty
 * minutes of honest self-assessment, from users PRODUCT.md describes as doing
 * this around a job, studies, or life. A promise the interface makes must be a
 * promise the code keeps.
 */
const STORAGE_KEY = 'levvro:coach:session'

/** Bump when the persisted shape changes; older payloads are then discarded. */
const SCHEMA_VERSION = 1

const answerSchema = z.object({
  questionId: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  skipped: z.boolean().optional(),
})

const sessionSchema = z.object({
  version: z.literal(SCHEMA_VERSION),
  index: z.number().int().min(0),
  answers: z.record(z.string(), answerSchema),
  /** Which assessment this belongs to, so a changed question set can't resume. */
  questionIds: z.array(z.string()),
  savedAt: z.number(),
})

export type CoachSession = z.infer<typeof sessionSchema>
export type PersistedCoachSession = Omit<CoachSession, 'version' | 'savedAt'>

export const coachStorage = {
  load(questionIds: string[]): PersistedCoachSession | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = sessionSchema.safeParse(JSON.parse(raw))
      if (!parsed.success) return null

      // Resuming into a different question set would restore answers against
      // the wrong prompts — worse than starting over, because it looks correct.
      const saved = parsed.data
      if (
        saved.questionIds.length !== questionIds.length ||
        saved.questionIds.some((id, i) => id !== questionIds[i])
      ) {
        return null
      }
      if (saved.index >= questionIds.length) return null

      return { index: saved.index, answers: saved.answers, questionIds: saved.questionIds }
    } catch {
      return null
    }
  },

  /**
   * Returns whether the session actually landed. "Save & exit" is a promise the
   * interface makes out loud; if the write fails, the caller has to stop making
   * it rather than swallow the error and let the user walk away.
   */
  save(session: PersistedCoachSession): boolean {
    if (typeof window === 'undefined') return false
    try {
      const payload: CoachSession = { ...session, version: SCHEMA_VERSION, savedAt: Date.now() }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      return true
    } catch (error) {
      console.error('Assessment progress could not be saved to localStorage', error)
      return false
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* nothing actionable */
    }
  },
}
