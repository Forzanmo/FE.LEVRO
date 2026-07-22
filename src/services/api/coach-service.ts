import type { Assessment } from '@/features/coach/types'

/**
 * AI Coach assessment script (mock). This stands in for the streamed,
 * server-driven question flow; the shape mirrors what a real endpoint would
 * return, so the coach state machine and UI are backend-agnostic.
 */
const ASSESSMENT: Assessment = {
  intro:
    "Hi — I'm your Levvro coach. I'll ask a few quick questions to build your Career Readiness Score. No fluff, and I'll explain why each one matters. You can skip, go back, or edit any answer.",
  questions: [
    {
      id: 'stage',
      type: 'single',
      prompt: 'Where are you in your career right now?',
      reasoning:
        'This calibrates everything else — the plan for a career shifter is different from a new grad’s.',
      options: [
        { value: 'student', label: 'Student / new grad' },
        { value: 'junior', label: 'Junior (0–2 years)' },
        { value: 'shifter', label: 'Career shifter' },
        { value: 'returning', label: 'Returning after a break' },
      ],
    },
    {
      id: 'role',
      type: 'text',
      prompt: 'What role are you aiming for?',
      reasoning: 'Your target role sets the exact skill bar we measure you against.',
      placeholder: 'e.g. Frontend Engineer',
    },
    {
      id: 'timeline',
      type: 'single',
      prompt: 'How soon do you want to be interviewing?',
      reasoning: 'Your timeline decides how aggressive your roadmap should be.',
      options: [
        { value: 'asap', label: 'As soon as possible' },
        { value: '1-3m', label: 'In 1–3 months' },
        { value: '3-6m', label: 'In 3–6 months' },
        { value: 'exploring', label: 'Just exploring' },
      ],
    },
    {
      id: 'evidence',
      type: 'multi',
      prompt: 'Which of these have you built or shipped?',
      reasoning: 'Evidence of shipped work is the strongest signal recruiters look for.',
      optional: true,
      options: [
        { value: 'projects', label: 'Personal projects' },
        { value: 'work', label: 'Internship / work experience' },
        { value: 'oss', label: 'Open-source contributions' },
        { value: 'freelance', label: 'Freelance / client work' },
        { value: 'none', label: 'Nothing yet' },
      ],
    },
    {
      id: 'skills',
      type: 'multi',
      prompt: 'Which of these skills do you already have?',
      reasoning:
        'We compare these against your target role to find the highest-leverage gaps to close.',
      optional: true,
      options: [
        { value: 'js', label: 'JavaScript / TypeScript' },
        { value: 'react', label: 'React / frontend' },
        { value: 'backend', label: 'Backend / APIs' },
        { value: 'systems', label: 'System design' },
        { value: 'testing', label: 'Testing' },
        { value: 'data', label: 'Data / SQL' },
      ],
    },
    {
      id: 'confidence',
      type: 'single',
      prompt: 'How confident do you feel walking into an interview?',
      reasoning:
        'Interview readiness is often the biggest hidden gap — and the most fixable one.',
      options: [
        { value: 'low', label: 'Not confident' },
        { value: 'some', label: 'Somewhat' },
        { value: 'fair', label: 'Fairly confident' },
        { value: 'high', label: 'Very confident' },
      ],
    },
    {
      id: 'blocker',
      type: 'text',
      prompt: 'What’s the one thing holding you back most right now?',
      reasoning: 'Naming the blocker lets your coach target it directly instead of guessing.',
      placeholder: 'Be honest — this stays private',
      optional: true,
    },
    {
      id: 'plan',
      type: 'single',
      prompt: 'What should we generate for you first?',
      reasoning: 'We’ll tailor your next steps to exactly what you pick here.',
      options: [
        { value: 'assets', label: 'Resume + Cover Letter' },
        { value: 'assets-roadmap', label: 'Resume + Cover Letter + Roadmap' },
      ],
    },
  ],
}

export const coachService = {
  getAssessment(): Assessment {
    return ASSESSMENT
  },
}
