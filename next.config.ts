import type { NextConfig } from 'next'

/**
 * Deliberately empty.
 *
 * Every `(app)` route downloads two byte-equivalent copies of zod (63KB gzipped
 * each) and two of motion (40KB each) — ~103KB gzipped of pure duplication, 19%
 * of the route's JavaScript. The pairs are the same modules under different
 * Turbopack module IDs (verified: identical token counts, identical byte
 * length), and `/`, which has no second layout, loads only one copy of each.
 *
 * It is a Turbopack chunk-allocation artifact, not something app code causes:
 * it predates the lazy Clerk import, and `experimental.turbopackClientSideNested\
 * AsyncChunking: false` was measured and changed nothing (33 chunks / 1929KB raw
 * / 548KB gzipped either way). Left documented rather than papered over with a
 * config option that does not work.
 */
const nextConfig: NextConfig = {}

export default nextConfig
