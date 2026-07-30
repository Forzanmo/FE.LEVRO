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
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
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

const nextConfig: NextConfig = {
  /** Don't advertise the framework. */
  poweredByHeader: false,

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
