import { resumeSchema, type ResumeData } from '@/lib/validators/resume-schema'

/**
 * Resume autosave persistence. A thin, SSR-safe wrapper over localStorage; the
 * only place the resume draft is read from or written to the browser. Swappable
 * for a server-backed store without touching the editor.
 */
const STORAGE_KEY = 'levvro:resume:draft'

export const resumeStorage = {
  load(): ResumeData | null {
    if (typeof window === 'undefined') return null
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      // Validate so a malformed/legacy draft can't corrupt the editor.
      const parsed = resumeSchema.safeParse(JSON.parse(raw))
      return parsed.success ? parsed.data : null
    } catch {
      return null
    }
  },

  save(data: ResumeData): void {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* quota or serialization failure — draft simply isn't persisted */
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(STORAGE_KEY)
  },
}
