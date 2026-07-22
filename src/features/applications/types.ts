import type { AppStatus } from './status'

export interface Application {
  id: string
  company: string
  role: string
  status: AppStatus
  /** ISO date the application was submitted. */
  appliedAt: string
  location: string
  source: string
}
