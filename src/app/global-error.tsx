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
 * purpose — including the colours, which are the light/dark `--background` and
 * `--foreground` values from globals.css written out literally so this page
 * still renders if the token layer is what failed.
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
        style={{ background: '#f6fbfc', color: '#09090b' }}
        className="flex min-h-full flex-col items-center justify-center gap-4 px-6 py-12 text-center antialiased"
      >
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Levvro couldn’t start
        </h1>
        <p className="max-w-sm text-pretty" style={{ color: '#52525b' }}>
          Something failed before the app could load. Your saved work is untouched — reloading
          usually fixes it.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{ background: '#006b6d' }}
          className="mt-1 inline-flex h-9 items-center rounded-lg px-3.5 text-sm font-medium text-white"
        >
          Reload Levvro
        </button>
        {error.digest ? (
          <p className="text-sm" style={{ color: '#52525b' }}>
            Reference: {error.digest}
          </p>
        ) : null}
      </body>
    </html>
  )
}
