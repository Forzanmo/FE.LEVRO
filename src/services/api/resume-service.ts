import type { ResumeData } from '@/lib/validators/resume-schema'

/**
 * Resume service. Returns the AI-generated starting resume (mocked here). A real
 * implementation would call the generation endpoint; the shape is identical, so
 * the editor and preview are unaffected.
 */
export const resumeService = {
  getSeed(): ResumeData {
    return {
      fullName: 'Alex Rivera',
      headline: 'Frontend Engineer',
      email: 'alex.rivera@example.com',
      phone: '+1 (555) 123-4567',
      location: 'Remote · Berlin, DE',
      website: 'alexrivera.dev',
      summary:
        'Frontend engineer focused on accessible, high-performance React interfaces. Two internships shipping production features; comfortable owning a task end to end.',
      experience: [
        {
          id: 'seed-e1',
          role: 'Frontend Intern',
          company: 'Northwind Studio',
          period: '2023 — 2024',
          highlights:
            'Shipped a component library adopted across four products.\nCut First Contentful Paint by 38% on the marketing site.\nAdded keyboard and screen-reader support to the checkout flow.',
        },
        {
          id: 'seed-e2',
          role: 'Junior Developer (Freelance)',
          company: 'Self-employed',
          period: '2022 — 2023',
          highlights:
            'Built three client sites in Next.js sharing one design system.\nSet up CI and Lighthouse budgets to hold performance.',
        },
      ],
      skills: ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Testing', 'Accessibility'],
    }
  },
}
