import type { Achievement } from '@/features/achievements/types'

/** Achievements (mock) — earned, in-progress and locked milestones. */
const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-steps', title: 'First Steps', description: 'Completed your career assessment.', icon: 'sparkles', xp: 40, status: 'earned' },
  { id: 'halfway', title: 'Halfway There', description: 'Reached a Career Readiness Score above 50.', icon: 'target', xp: 60, status: 'earned' },
  { id: 'resume-ready', title: 'Recruiter-Ready Resume', description: 'Polished your resume to an 80+ quality score.', icon: 'resume', xp: 80, status: 'earned' },
  { id: 'streak-5', title: 'Warming Up', description: 'Kept a 5-day activity streak.', icon: 'streak', xp: 50, status: 'earned' },
  { id: 'first-app', title: 'In the Arena', description: 'Submitted your first application.', icon: 'applications', xp: 40, status: 'earned' },
  { id: 'interviewer', title: 'Interviewer', description: 'Reach 3 interview-stage applications.', icon: 'message', xp: 90, status: 'in-progress', progress: { current: 1, target: 3 } },
  { id: 'quest-master', title: 'Quest Master', description: 'Complete 10 roadmap quests.', icon: 'roadmap', xp: 120, status: 'in-progress', progress: { current: 3, target: 10 } },
  { id: 'skill-builder', title: 'Skill Builder', description: 'Evidence 8 target-role skills.', icon: 'learning', xp: 70, status: 'in-progress', progress: { current: 5, target: 8 } },
  { id: 'top-tier', title: 'Top Tier', description: 'Reach a Career Readiness Score of 80.', icon: 'trending', xp: 100, status: 'locked' },
  { id: 'unstoppable', title: 'Unstoppable', description: 'Keep a 30-day activity streak.', icon: 'streak', xp: 150, status: 'locked' },
  { id: 'prolific', title: 'Prolific', description: 'Track 25 applications.', icon: 'applications', xp: 120, status: 'locked' },
  { id: 'signed-sealed', title: 'Signed & Sealed', description: 'Land an offer.', icon: 'achievements', xp: 250, status: 'locked' },
]

export const achievementsService = {
  getAchievements(): Achievement[] {
    return ACHIEVEMENTS
  },
}
