'use client'

import { useEffect } from 'react'

import { fontVariables } from '@/config/fonts'
import { cn } from '@/lib/utils'

import './globals.css'

/**
 * Last-resort boundary: an error thrown by the root layout itself, before
 * providers exist.
 *
 * It replaces `<html>`/`<body>`, so it cannot use the theme provider, the icon
 * set, or any component that expects context. Everything here is inlined on
 * purpose — including the colours, which are the `--background`, `--foreground`,
 * `--muted-foreground` and `--primary` values written out literally so this page
 * still renders if the token layer is what failed.
 *
 * Because they are literals, they do not follow a palette change, and they did
 * not: this screen went on rendering the pre-LEVRRO teal (#006b6d) and zinc ink
 * for a whole redesign, because nothing imports it and no gate visits it — the
 * route only exists for a failure that never happens in a healthy build. Any
 * future palette change has to come back here by hand. The values below are the
 * light-theme tokens as of the navy/teal identity.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en" className={cn(fontVariables, 'h-full')}>
      <body
        style={{ background: '#f9fbfe', color: '#1f2937' }}
        className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-12 text-center antialiased"
      >
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Levrro couldn’t start
        </h1>
        <p className="max-w-sm text-pretty" style={{ color: '#5b6b7e' }}>
          Something failed before the app could load. Your saved work is untouched — reloading
          usually fixes it.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{ background: '#0d4980' }}
          className="mt-1 inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium text-white"
        >
          Reload Levrro
        </button>
        {error.digest ? (
          <p className="text-sm" style={{ color: '#5b6b7e' }}>
            Reference: {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  )
}
