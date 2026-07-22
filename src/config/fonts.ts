/**
 * Font system. Exposes three CSS variables consumed by the design tokens:
 *   --font-sans     body + UI text
 *   --font-mono     code / numeric tabular
 *   --font-heading  display headings (kept separate so it can be swapped for a
 *                   distinct display face later without touching components)
 *
 * Geist is used across the board for a cohesive, Linear-grade feel. The font is
 * self-hosted (`next/font/local`) from the variable woff2 files in
 * `src/assets/fonts`, so builds are fully offline/hermetic — no build-time fetch
 * to Google Fonts. Geist ships under the SIL Open Font License. The files are the
 * variable fonts (weight axis 100–900); the `latin` subset covers all glyphs the
 * app uses (including `—` and `·`).
 */
import localFont from 'next/font/local'

export const fontSans = localFont({
  src: '../assets/fonts/geist-sans.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '100 900',
})

export const fontMono = localFont({
  src: '../assets/fonts/geist-mono.woff2',
  variable: '--font-mono',
  display: 'swap',
  weight: '100 900',
})

export const fontHeading = localFont({
  src: '../assets/fonts/geist-sans.woff2',
  variable: '--font-heading',
  display: 'swap',
  weight: '100 900',
})

/** Space-separated variable classes applied to <html>. */
export const fontVariables = `${fontSans.variable} ${fontMono.variable} ${fontHeading.variable}`
