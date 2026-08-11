import { clampResume, resumeSchema, type ResumeData } from '@/lib/validators/resume-schema'

/**
 * Resume autosave persistence. A thin, SSR-safe wrapper over localStorage; the
 * only place the resume draft is read from or written to the browser. Swappable
 * for a server-backed store without touching the editor.
 */
const STORAGE_KEY = 'levrro:resume:draft'

export const resumeStorage = {
  load(): ResumeData | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      // Validate so a malformed/legacy draft can't corrupt the editor.
      //
      // Clamp BEFORE parsing. A draft written before the length caps existed is
      // still the user's real CV; failing it here would discard the whole
      // document over one long field. Trimming is recoverable, silence is not.
      const parsed = resumeSchema.safeParse(clampResume(JSON.parse(raw)))
      return parsed.success ? parsed.data : null
    } catch {
      return null
    }
  },

  /**
   * Returns whether the draft actually landed.
   *
   * This used to swallow the failure, so a full quota meant the editor kept
   * saying "Saved" while nothing was written — the single worst lie the app can
   * tell someone typing their employment history into it. The caller is now
   * obliged to deal with `false`.
   */
  save(data: ResumeData): boolean {
    if (typeof window === 'undefined') return false
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return true
    } catch (error) {
      console.error('Resume draft could not be saved to localStorage', error)
      return false
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(STORAGE_KEY)
  },
}
