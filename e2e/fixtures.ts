import { expect, test as base, type Page, type Route } from '@playwright/test'

const now = '2026-08-05T09:00:00Z'

function application(id: string, organization: string, title: string, state = 'draft') {
  return {
    id,
    organization,
    title,
    state,
    application_type: 'job',
    opportunity_text: null,
    source_application_id: null as string | null,
    revision: 0,
    created_at: now,
    updated_at: now,
  }
}

export async function installApi(page: Page, initiallyAuthenticated = true) {
  let authenticated = initiallyAuthenticated
  let onboarded = true
  let profileRevision = 0
  let profileData: Record<string, unknown> = {
    full_name: 'Alex Rivera',
    onboarding_completed: onboarded,
    plan: 'assets-roadmap',
  }
  let coachRevision = 0
  let coachAnswers: Record<string, { question_id: string; value: string | string[]; skipped: boolean }> = {}
  let roadmapRevision = 1
  let completedQuests = ['kickoff', 'role', 'skills']
  let resumeRevision = 1
  let resumeData = {
    full_name: 'Alex Rivera', headline: 'Frontend Engineer', email: 'alex@example.com', phone: '', location: 'Berlin', website: '', summary: 'Frontend engineer focused on accessible products.',
    experience: [
      { id: 'e1', role: 'Frontend Intern', company: 'Northwind', period: '2023 — 2024', highlights: 'Shipped a design system.' },
      { id: 'e2', role: 'Junior Developer', company: 'Freelance', period: '2022 — 2023', highlights: 'Built client products.' },
    ],
    skills: ['TypeScript', 'React'],
  }
  let applications = [
    application('a1', 'Vercel', 'Frontend Engineer', 'interviewing'),
    application('a2', 'Linear', 'Product Engineer', 'ready_to_generate'),
    application('a3', 'Stripe', 'UI Engineer'),
    application('a4', 'Notion', 'Frontend Engineer', 'exported'),
  ]

  const respond = (route: Route, json: unknown, status = 200) => route.fulfill({ status, json })
  const unauthorized = (route: Route) => respond(route, { error: { code: 'unauthorized', message: 'Authentication required', request_id: 'e2e' } }, 401)

  await page.route('**/api/v1/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const path = url.pathname
    const method = request.method()

    if (path === '/api/v1/auth/refresh' && method === 'POST') {
      return authenticated ? respond(route, { access_token: 'e2e-token', expires_in: 900, token_type: 'bearer' }) : unauthorized(route)
    }
    if (path === '/api/v1/auth/token' && method === 'POST') {
      authenticated = true
      onboarded = false
      profileData = { ...profileData, onboarding_completed: false }
      return respond(route, { access_token: 'e2e-token', expires_in: 900, token_type: 'bearer' })
    }
    if (path === '/api/v1/auth/register' && method === 'POST') {
      return respond(route, { id: 'user-1', email: 'admin@example.com', email_verified: true, is_admin: true, created_at: now }, 201)
    }
    if (path === '/api/v1/auth/password-reset/request' && method === 'POST') {
      return respond(route, { message: 'If an account exists, a reset link has been sent.' }, 202)
    }
    if (path === '/api/v1/auth/password-reset/confirm' && method === 'POST') {
      authenticated = false
      return route.fulfill({ status: 204 })
    }
    if (path === '/api/v1/auth/logout' && method === 'POST') {
      authenticated = false
      return route.fulfill({ status: 204 })
    }
    if (!authenticated) return unauthorized(route)
    if (path === '/api/v1/auth/me' && method === 'DELETE') {
      authenticated = false
      return route.fulfill({ status: 204 })
    }
    if (path === '/api/v1/auth/me') {
      return respond(route, { id: 'user-1', email: 'admin@example.com', email_verified: true, is_admin: true, created_at: now })
    }
    if (path === '/api/v1/profile' && method === 'GET') {
      return respond(route, { id: 'profile-1', revision: profileRevision, data: profileData, updated_at: now })
    }
    if (path === '/api/v1/profile' && method === 'PATCH') {
      const body = request.postDataJSON() as { data: Record<string, unknown> }
      profileRevision += 1
      onboarded = true
      profileData = { ...body.data, onboarding_completed: true }
      return respond(route, { id: 'profile-1', revision: profileRevision, data: profileData, updated_at: now })
    }
    if (path === '/api/v1/analytics/events' && method === 'POST') {
      return route.fulfill({ status: 204 })
    }

    const coachQuestions = [
      { id: 'stage', type: 'single', prompt: 'Where are you in your career right now?', reasoning: 'This calibrates everything else — the plan matches your current stage.', optional: false, options: [{ value: 'student', label: 'Student / new grad' }, { value: 'junior', label: 'Junior (0–2 years)' }] },
      { id: 'role', type: 'text', prompt: 'What role are you aiming for?', reasoning: 'Your target role sets the exact skill bar.', optional: false, placeholder: 'e.g. Frontend Engineer', options: null },
      { id: 'timeline', type: 'single', prompt: 'How soon do you want to be interviewing?', reasoning: 'Your timeline sets the pace.', optional: false, options: [{ value: 'asap', label: 'As soon as possible' }] },
      { id: 'evidence', type: 'multi', prompt: 'Which of these have you built or shipped?', reasoning: 'Evidence matters.', optional: true, options: [{ value: 'projects', label: 'Personal projects' }] },
      { id: 'skills', type: 'multi', prompt: 'Which skills do you have?', reasoning: 'Skills reveal gaps.', optional: true, options: [{ value: 'react', label: 'React' }] },
      { id: 'confidence', type: 'single', prompt: 'How confident are you?', reasoning: 'Confidence guides practice.', optional: false, options: [{ value: 'fair', label: 'Fairly confident' }] },
      { id: 'blocker', type: 'text', prompt: 'What is holding you back?', reasoning: 'The blocker focuses the plan.', optional: true, options: null },
      { id: 'plan', type: 'single', prompt: 'What should we generate first?', reasoning: 'The choice prioritizes work.', optional: false, options: [{ value: 'resume', label: 'A stronger resume' }] },
    ]
    if (path === '/api/v1/product/coach' && method === 'GET') {
      return respond(route, { intro: "Hi — I'm your Levrro coach.", questions: coachQuestions, answers: coachAnswers, revision: coachRevision, completed_at: null })
    }
    if (path === '/api/v1/product/coach/answer' && method === 'PUT') {
      const body = request.postDataJSON() as { question_id: string; value: string | string[]; skipped?: boolean }
      coachRevision += 1
      coachAnswers = { ...coachAnswers, [body.question_id]: { question_id: body.question_id, value: body.value, skipped: Boolean(body.skipped) } }
      return respond(route, { intro: "Hi — I'm your Levrro coach.", questions: coachQuestions, answers: coachAnswers, revision: coachRevision, completed_at: null })
    }
    if (path === '/api/v1/product/coach' && method === 'DELETE') {
      coachRevision = 0
      coachAnswers = {}
      return respond(route, { intro: "Hi — I'm your Levrro coach.", questions: coachQuestions, answers: coachAnswers, revision: 0, completed_at: null })
    }

    const roadmapNodes = [
      { id: 'kickoff', title: 'Career Kickoff', description: 'Begin the journey.', xp: 40, icon: 'sparkles', tier: 0, col: 1, requires: [] },
      { id: 'role', title: 'Define target role', description: 'Choose a role.', xp: 30, icon: 'target', tier: 1, col: 0, requires: ['kickoff'] },
      { id: 'skills', title: 'Skills audit', description: 'Audit skills.', xp: 30, icon: 'learning', tier: 1, col: 2, requires: ['kickoff'] },
      { id: 'portfolio', title: 'Build a portfolio project', description: 'Ship work.', xp: 80, icon: 'zap', tier: 2, col: 0, requires: ['role'] },
      { id: 'resume', title: 'Fix resume gaps', description: 'Improve evidence.', xp: 60, icon: 'resume', tier: 2, col: 2, requires: ['skills'] },
      { id: 'publish', title: 'Publish & get feedback', description: 'Get feedback.', xp: 70, icon: 'preview', tier: 3, col: 1, requires: ['portfolio', 'resume'] },
      { id: 'mock', title: 'Mock interviews', description: 'Practice.', xp: 90, icon: 'message', tier: 4, col: 0, requires: ['publish'] },
      { id: 'behavioral', title: 'Behavioral drills', description: 'Build stories.', xp: 70, icon: 'star', tier: 4, col: 2, requires: ['publish'] },
      { id: 'applications', title: 'First applications', description: 'Apply.', xp: 100, icon: 'applications', tier: 5, col: 1, requires: ['mock', 'behavioral'] },
      { id: 'offer', title: 'Land the offer', description: 'Get hired.', xp: 150, icon: 'achievements', tier: 6, col: 1, requires: ['applications'] },
    ]
    if (path === '/api/v1/product/roadmap' && method === 'GET') return respond(route, { cols: 3, nodes: roadmapNodes, completed_quest_ids: completedQuests, revision: roadmapRevision })
    const roadmapMatch = path.match(/^\/api\/v1\/product\/roadmap\/([^/]+)\/completion$/)
    if (roadmapMatch && (method === 'PUT' || method === 'DELETE')) {
      completedQuests = method === 'PUT' ? [...new Set([...completedQuests, roadmapMatch[1]])] : completedQuests.filter((id) => id !== roadmapMatch[1])
      roadmapRevision += 1
      return respond(route, { cols: 3, nodes: roadmapNodes, completed_quest_ids: completedQuests, revision: roadmapRevision })
    }
    if (path === '/api/v1/product/resume' && method === 'GET') return respond(route, { data: resumeData, revision: resumeRevision, updated_at: now })
    if (path === '/api/v1/product/resume' && method === 'PUT') {
      const body = request.postDataJSON() as { data: typeof resumeData }
      resumeData = body.data
      resumeRevision += 1
      return respond(route, { data: resumeData, revision: resumeRevision, updated_at: now })
    }
    if (path === '/api/v1/product/cover-letter' && method === 'POST') {
      const body = request.postDataJSON() as { company: string; role: string; hiring_manager: string; tone: string; highlights: string }
      return respond(route, { generation_input: body, revision: 1, updated_at: now, content: { greeting: body.hiring_manager ? `Dear ${body.hiring_manager},` : 'Dear Hiring Manager,', paragraphs: [`I am applying for the ${body.role} position at ${body.company}.`, 'I bring relevant experience.', `I would welcome a conversation with ${body.company}.`], signoff: 'Sincerely,', name: 'Alex Rivera' } }, 201)
    }
    if (path === '/api/v1/product/dashboard' && method === 'GET') {
      return respond(route, { user_name: 'Alex Rivera', streak_days: 5, score: { overall: 68, delta: 0, categories: [{ id: 'resume', label: 'Resume Quality', score: 81, reasoning: 'Your resume is complete.' }] }, mission: { id: 'portfolio', title: 'Build a portfolio project', description: 'Ship focused evidence.', xp: 80, estimated_minutes: 20, icon: 'zap' }, roadmap: { completed: completedQuests.length, total: 10, next_quest: 'Build a portfolio project' }, heatmap: [{ date: '2026-08-05', level: 2 }], activity: [], applications: { total: applications.length, interviewing: 2, offers: 1 } })
    }
    if (path === '/api/v1/product/achievements' && method === 'GET') {
      return respond(route, [{ id: 'first-app', title: 'In the Arena', description: 'Track your first application.', icon: 'applications', xp: 40, status: 'earned', progress: null }, { id: 'quest-master', title: 'Quest Master', description: 'Complete 10 quests.', icon: 'roadmap', xp: 120, status: 'in-progress', progress: { current: completedQuests.length, target: 10 } }])
    }

    if (path === '/api/v1/applications' && method === 'GET') return respond(route, applications)
    if (path === '/api/v1/applications' && method === 'POST') {
      const body = request.postDataJSON() as { organization: string; title: string; application_type: string }
      const created = {
        ...application(`a${applications.length + 10}`, body.organization, body.title),
        application_type: body.application_type,
      }
      applications = [created, ...applications]
      return respond(route, created, 201)
    }
    const duplicateMatch = path.match(/^\/api\/v1\/applications\/([^/]+)\/duplicate$/)
    if (duplicateMatch && method === 'POST') {
      const source = applications.find((item) => item.id === duplicateMatch[1]) ?? applications[0]
      const body = request.postDataJSON() as { title?: string }
      const created = {
        ...source,
        id: `a${applications.length + 10}`,
        title: body.title ?? `${source.title} copy`,
        source_application_id: source.id,
      }
      applications = [created, ...applications]
      return respond(route, created, 201)
    }
    const applicationMatch = path.match(/^\/api\/v1\/applications\/([^/]+)$/)
    if (applicationMatch && method === 'DELETE') {
      applications = applications.filter((item) => item.id !== applicationMatch[1])
      return route.fulfill({ status: 204 })
    }
    if (applicationMatch && method === 'GET') {
      const found = applications.find((item) => item.id === applicationMatch[1]) ?? applications[0]
      return respond(route, found)
    }
    if (path.endsWith('/opportunity') && method === 'GET') {
      return respond(route, { id: 'opp-1', application_id: 'a1', organization: 'Vercel', role_name: 'Frontend Engineer', description: 'Build excellent React products.', analysis_provider: 'gemini', revision: 1, requirements: [{ id: 'req-1', position: 0, requirement_type: 'required_qualification', text: 'React and TypeScript' }], created_at: now, updated_at: now })
    }
    if (path.endsWith('/extraction') && method === 'GET') {
      return respond(route, { id: 'extract-1', application_id: 'a1', status: 'confirmed', revision: 1, candidate_data: { name: 'Alex Rivera' }, extracted_text: 'Alex Rivera', error_code: null, confirmed_at: now, created_at: now, updated_at: now, upload: { id: 'upload-1', application_id: 'a1', original_filename: 'cv.pdf', media_type: 'application/pdf', page_count: 1, scan_status: 'clean', sha256: 'abc', size_bytes: 1024, created_at: now } })
    }
    if (path.endsWith('/conversation/current')) {
      return respond(route, { application_id: 'a1', question_set_version: 1, current_question: null, answered_questions: [], answered_count: 4, eligible_count: 4, progress_percent: 100, is_complete: true })
    }
    if (path.endsWith('/documents') && method === 'GET') {
      const applicationId = path.match(/^\/api\/v1\/applications\/([^/]+)\/documents$/)?.[1] ?? 'a1'
      return respond(route, [{ id: applicationId === 'a1' ? 'doc-1' : `${applicationId}-doc`, application_id: applicationId, document_type: 'cv', current_revision: 1, updated_at: now }])
    }
    if (path === '/api/v1/documents/doc-1' && method === 'GET') {
      return respond(route, {
        id: 'doc-1', application_id: 'a1', document_type: 'cv', current_revision: 1, updated_at: now,
        content: {
          document_type: 'cv', title: 'Alex Rivera — Frontend Engineer', evidence: [],
          presentation: { template_id: 'classic', accent_color: '#315c5b' },
          sections: [
            { id: 'summary', type: 'summary', title: 'Professional Summary', position: 0, statements: [{ id: 's1', text: 'Frontend engineer focused on accessible, high-performance React products.', origin: 'ai', evidence_ids: [], aligned_requirement_ids: ['req-1'] }] },
            { id: 'experience', type: 'experience', title: 'Relevant Experience', position: 1, statements: [{ id: 's2', text: 'Built and shipped an accessible component library used across product teams.', origin: 'ai', evidence_ids: [], aligned_requirement_ids: ['req-1'] }] },
          ],
        },
      })
    }
    if (path === '/api/v1/documents/doc-1/preview' && method === 'GET') {
      return route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><body><h1>Alex Rivera</h1><p>Frontend Engineer</p></body></html>',
      })
    }
    const regenerateMatch = path.match(/^\/api\/v1\/documents\/doc-1\/sections\/([^/]+)\/regenerate$/)
    if (regenerateMatch && method === 'POST') {
      return respond(route, { id: 'regen-job-1', application_id: 'a1', job_type: 'section_regeneration', target_id: regenerateMatch[1], resource_id: 'doc-1', resource_revision: 1, result_id: null, status: 'queued', attempt_count: 0, max_attempts: 3, error_code: null, created_at: now, completed_at: null }, 202)
    }
    if (path === '/api/v1/jobs/regen-job-1' && method === 'GET') {
      return respond(route, { id: 'regen-job-1', application_id: 'a1', job_type: 'section_regeneration', target_id: 'summary', resource_id: 'doc-1', resource_revision: 2, result_id: 'doc-1', status: 'completed', attempt_count: 1, max_attempts: 3, error_code: null, created_at: now, completed_at: now })
    }

    if (path === '/api/v1/admin/question-set-versions' && method === 'GET') {
      return respond(route, [{ id: 'version-1', name: 'Default guided flow', version: 1, revision: 2, is_published: false, published_at: null, created_by_user_id: 'user-1', questions: [{ id: 'question-1', key: 'target_role', label: 'What role are you targeting?', question_type: 'short_text', profile_section: 'general', display_order: 0, is_required: true, is_active: true, help_text: null, options: null, rule: null }], created_at: now, updated_at: now }])
    }
    if (path === '/api/v1/admin/question-set-versions' && method === 'POST') {
      return respond(route, { id: 'version-2', name: 'New flow', version: 2, revision: 0, is_published: false, published_at: null, created_by_user_id: 'user-1', questions: [], created_at: now, updated_at: now }, 201)
    }
    if (path === '/api/v1/admin/question-set-versions/version-1' && method === 'GET') {
      return respond(route, { id: 'version-1', name: 'Default guided flow', version: 1, revision: 2, is_published: false, published_at: null, created_by_user_id: 'user-1', questions: [{ id: 'question-1', key: 'target_role', label: 'What role are you targeting?', question_type: 'short_text', profile_section: 'general', display_order: 0, is_required: true, is_active: true, help_text: null, options: null, rule: null }], created_at: now, updated_at: now })
    }
    if (path === '/api/v1/admin/operations/ai-usage') return respond(route, { period_days: 30, since: now, buckets: [{ provider: 'gemini', model: 'gemini-3.6-flash', invocation_count: 12, failure_count: 1, input_tokens: 1000, output_tokens: 500, total_tokens: 1500, cached_input_tokens: 0, cache_write_tokens: 0, estimated_cost_microusd: 12000, average_duration_ms: 850 }] })
    if (path === '/api/v1/admin/operations/email-delivery') return respond(route, { period_days: 30, since: now, overdue_count: 0, oldest_queued_at: null, buckets: [{ email_type: 'verification', provider: 'postmark', status: 'delivered', delivery_count: 8 }] })
    if (path === '/api/v1/admin/operations/product-funnel') return respond(route, { period_days: 30, since: now, buckets: [{ event_name: 'application_started', event_count: 10, distinct_users: 5, distinct_applications: 10 }, { event_name: 'cv_exported', event_count: 4, distinct_users: 3, distinct_applications: 4 }], abandonment_by_step: [] })

    return respond(route, { error: { code: 'not_found', message: `Unhandled E2E route: ${method} ${path}`, request_id: 'e2e' } }, 404)
  })
}

export const test = base.extend<{ api: void; signedIn: boolean }>({
  signedIn: [true, { option: true }],
  api: [async ({ page, signedIn }, use) => {
    await installApi(page, signedIn)
    await use()
  }, { auto: true }],
})

export { expect }
