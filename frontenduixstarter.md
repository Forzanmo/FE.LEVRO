# Levvro2 Frontend UI/UX Starter Specification

## 1. Product Identity
- **Product:** Levvro2
- **Category:** AI Career Intelligence Platform
- **Vision:** Transform career uncertainty into a measurable roadmap toward getting hired.
- **Mission:** Help juniors and career shifters become recruiter-ready through assessment, coaching, and AI-generated career assets.

## 2. Target Users
- Junior professionals
- Career shifters

### User emotions
- Confidence
- Clarity
- Ambition

### Core promise
> Never waste the user's time.

### AI personality
- Friendly
- Intelligent
- Trustworthy
- Evidence-driven
- Never hallucinates
- Always guides users toward their career goal

---

# 3. MVP Scope

## Included
- Authentication (Google)
- AI onboarding conversation
- Career Readiness Score
- Interactive Quest Roadmap
- Resume Generator
- Cover Letter Generator
- Dashboard
- Applications
- Achievements
- Resume Preview
- Live Preview
- Auto Save
- Dark & Light Theme

## Excluded
- Networking
- Community
- Learning Platform
- Recruiter Marketplace

---

# 4. Navigation

## Sidebar
- Dashboard
- AI Coach
- Roadmap
- Resume
- Cover Letter
- Applications
- Achievements
- Settings

Desktop: Expandable sidebar

Mobile: Bottom navigation

No global search.

---

# 5. User Flow

Landing
→ Sign In / Sign Up
→ Select:
- Resume + Cover Letter
- Resume + Cover Letter + Roadmap

(New users)
→ AI Coach Conversation
→ Processing
→ Career Score
→ Resume Generation
→ Cover Letter Generation
→ Roadmap (if selected)
→ Dashboard

Returning users:
→ Dashboard

---

# 6. Dashboard

Priority

1. Career Score
2. Roadmap
3. Heatmap
4. AI Coach
5. Resume
6. Recent Activity
7. Today's Mission
8. Applications

Primary CTA

**Continue AI Coach**

If empty:
- Score = 0
- Encourage user to start assessment.

---

# 7. AI Coach

- One question at a time
- User can skip/back/edit
- Typing animation
- Robot avatar
- Silent UI
- AI never hallucinates
- AI always explains reasoning

---

# 8. Resume

- Split editor + preview
- Live preview
- Auto save
- One premium template

Cover Letter:
- Generated only

---

# 9. Career Score

Visualization:
- Progress Ring

Expandable categories with reasoning.

Roadmap style:
- Quest
- Completed tasks remain visible.

---

# 10. Motion

Style:
- Meaningful animations only

Examples
- Sidebar
- Progress ring
- Roadmap unlocks
- Dashboard cards
- Success states

Loading:
- AI generation may take up to 30 seconds
- Show tips and motivational quotes

---

# 11. Design Language

Inspiration:
- Notion (layout)
- Linear (quality)

Theme
- Light & Dark
- Accent gradients
- Spacious layout
- Rounded corners
- Minimal illustrations
- Large SaaS footer

Brand values
- Trustworthy
- Premium
- Elegant
- Intelligent
- Friendly

---

# 12. Accessibility

- Keyboard navigation
- Screen reader support
- High contrast
- Reduced motion
- Proper ARIA labels

---

# 13. Icons

Unified Icon component

Props
- name
- variant
- size
- color

Variants
- Outline
- Filled
- Rounded
- Duotone

Implementation
- Optimized SVG
- SVGO
- Lazy loading
- Sprite support

---

# 14. Homepage

Sections
- Hero
- Features
- FAQ
- About
- Contact

Hero CTA

> Start Your Career Journey

Hero visual:
Dashboard preview

---

# 15. Frontend Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI
- Motion
- React Hook Form
- Zod
- TanStack Query
- TanStack Table
- Lucide Icons
- Sonner
- next-themes

---

# 16. UX Principles

1. Reduce uncertainty.
2. Every screen has one primary goal.
3. Every action has immediate feedback.
4. Minimize cognitive load.
5. Explain every score.
6. Guide, don't overwhelm.
7. Accessibility by default.
8. Motion has purpose.
9. Never waste the user's time.
10. Trust is earned through transparency.

---

# 17. Success Statement

Users should say:

> "This is the first AI career product that actually made me confident to go through a real interview."

