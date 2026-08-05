import type { NextConfig } from 'next'

/**
 * Security headers, applied to every response.
 *
 * The app shipped with none of these — no CSP, no framing policy, no MIME
 * sniffing protection, no referrer policy — while writing a full CV and an
 * assessment transcript into `localStorage`. Clickjacking a career product whose
 * screens include "Download PDF" and "Sign out" is worth two lines of config.
 *
 * The CSP allows `'unsafe-inline'` for styles because Tailwind and `next/font`
 * emit inline `<style>`, and for scripts because Next's hydration bootstrap is
 * an inline script. Tightening those needs a nonce threaded through the
 * document, which is a real change rather than a config line — noted rather than
 * pretended away.
 */
/*
 * `connect-src` has to allow websockets in development, and finding that out
 * cost a verification run.
 *
 * `next dev` serves the page on one port and its HMR socket on another, so
 * `ws://127.0.0.1:<other-port>` is not `'self'` and a bare `connect-src 'self'`
 * blocks it. The symptoms were not obviously CSP: the a11y gate died on
 * `page.addScriptTag`, and the e2e run filled with websocket errors from an
 * editor extension. Live reload was broken for anyone running the dev server.
 *
 * Production keeps the strict value — there is no HMR socket to allow, and
 * that is the environment the header exists to protect.
 */
const isDev = process.env.NODE_ENV === 'development'

const CSP = [
  "default-src 'self'",
  // `unsafe-eval` is dev-only: Turbopack's HMR runtime needs it, the production
  // bundle does not.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ')

const SECURITY_HEADERS = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  // HSTS is a no-op over plain HTTP, so it costs nothing locally and is correct
  // the moment this is served over TLS.
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const backendOrigin = (process.env.LEVRRO_BACKEND_ORIGIN ?? 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
)

const nextConfig: NextConfig = {
  /** Don't advertise the framework. */
  poweredByHeader: false,

  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendOrigin}/api/v1/:path*`,
      },
    ]
  },

  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }]
  },
}

export default nextConfig

/*
 * Known, measured, and NOT fixed here:
 *
 * Every `(app)` route downloads two byte-equivalent copies of zod (64KB gzipped
 * each) and two of motion (41KB each) — ~105KB gzipped of pure duplication. The
 * pairs are the same modules under different Turbopack module IDs (verified:
 * identical token counts, identical byte length), and `/`, which has no second
 * layout, loads only one copy of each.
 *
 * It is a Turbopack chunk-allocation artifact, not something app code causes: it
 * predates the lazy Clerk import, and `experimental.turbopackClientSideNested-
 * AsyncChunking: false` was measured and changed nothing (33 chunks / 1929KB raw
 * / 548KB gzipped either way). Left documented rather than papered over with a
 * config option that does not work. Worth re-measuring on each Next upgrade.
 */
