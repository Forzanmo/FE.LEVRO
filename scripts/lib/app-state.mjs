/**
 * The app states the verification gates measure, and the routes that need each.
 *
 * Shared by `check-contrast.mjs` and `check-a11y.mjs` so both gates measure the
 * SAME surfaces in the SAME states. When this lived inside the contrast gate
 * only, the a11y gate silently measured different pages — /coach reported zero
 * tab stops because it never got past the auth guard, and nobody noticed because
 * "0 findings" reads like success.
 *
 * State matters as much as the path: a first run of the contrast gate reported
 * the dashboard clean with 11 text runs, which was the pre-assessment empty
 * state — the skills card, documents list, and activity feed were never measured
 * at all. A green result on a state you did not intend to test is not evidence.
 */

const DEMO_USER = {
  id: 'demo-user',
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  initials: 'AR',
}

/** Fixed timestamp so runs are deterministic. */
const SEEDED_AT = '2026-01-15T10:00:00.000Z'

/**
 * localStorage payloads per state. Keys mirror `services/auth/auth-service.ts`
 * and `services/storage/journey-storage.ts` — if those keys change, these must.
 */
export function seedFor(state) {
  switch (state) {
    case 'onboarded':
      return {
        'levvro:auth': { authenticated: true, user: DEMO_USER, hasOnboarded: true },
        'levvro:journey': { assessmentCompletedAt: SEEDED_AT, dashboardSeenAt: SEEDED_AT },
      }
    case 'needs-onboarding':
      return { 'levvro:auth': { authenticated: true, user: DEMO_USER, hasOnboarded: false } }
    case 'signedout':
      return { 'levvro:auth': { authenticated: false, user: null, hasOnboarded: false } }
    case 'new':
    default:
      // No keys — a genuinely fresh visitor. Exercises the pre-assessment states.
      return {}
  }
}

/**
 * Every surface with meaningful content, each paired with the state it must be
 * measured in. Both dashboard states are listed deliberately: the empty first-run
 * one and the populated one are different designs and both ship.
 */
export const ROUTES = [
  { path: '/', state: 'new' },
  { path: '/sign-in', state: 'signedout' },
  { path: '/onboarding', state: 'needs-onboarding' },
  { path: '/coach', state: 'onboarded' },
  { path: '/dashboard', state: 'new' },
  { path: '/dashboard', state: 'onboarded' },
  { path: '/documents', state: 'onboarded' },
  /*
   * Pre-assessment states, added when the history services were gated. Each of
   * these renders a genuinely different design for a visitor who has not taken
   * the assessment — that is the whole point of the gate — so measuring only the
   * populated one would leave the state a brand-new user actually sees unproven.
   */
  { path: '/documents', state: 'new' },
  { path: '/resume', state: 'new' },
  { path: '/applications', state: 'new' },
  /* A retired route, so this measures the branded not-found page. */
  { path: '/roadmap', state: 'new' },
  // The CV templates are the highest-risk contrast surfaces in the product:
  // a white paper sheet and a deep-teal sidebar, both theme-invariant.
  { path: '/documents/cv-northwind', state: 'onboarded' },
  { path: '/documents/cl-northwind', state: 'onboarded' },
  { path: '/documents/cv-general', state: 'onboarded' },
  { path: '/resume', state: 'onboarded' },
  { path: '/cover-letter', state: 'onboarded' },
  { path: '/applications', state: 'onboarded' },
  { path: '/settings', state: 'onboarded' },
  { path: '/terms', state: 'new' },
  { path: '/privacy', state: 'new' },
]

/** Dev-only overlays float above the app and are not part of the product. */
export const HIDE_DEV_OVERLAYS =
  '.tsqd-parent-container,nextjs-portal,#nextjs-dev-tools-menu,' +
  '[data-nextjs-dev-tools-button],[data-nextjs-toast],' +
  '#__next-build-watcher{display:none !important}'

/** `path` or `path#state` from the CLI. */
export function parseRouteArg(token) {
  const [path, state = 'onboarded'] = token.split('#')
  return { path, state }
}
