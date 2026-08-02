/**
 * Font system. Exposes three CSS variables consumed by the design tokens:
 *   --font-sans     body + UI text
 *   --font-mono     code / numeric tabular
 *   --font-heading  display headings
 *
 * Every file is self-hosted (`next/font/local`) from `src/assets/fonts`, so
 * builds stay fully offline/hermetic — no build-time fetch to Google Fonts.
 *
 * **Poppins carries the headings.** DESIGN.md's One-Family Rule reserved the
 * `--font-heading` slot for exactly one sanctioned swap: a true contrast face if
 * the display voice ever needed more than weight could give it. The LEVRRO
 * identity is that moment — the wordmark itself is set in Poppins, so headings
 * in anything else would leave the logotype speaking a different language from
 * the page it sits on.
 *
 * Geist keeps the body and the UI. The pairing is geometric (Poppins: circular
 * bowls, single-storey `a`, tall ascenders) against neo-grotesque (Geist:
 * double-storey `a`, tighter apertures) — a real contrast axis, not two
 * near-identical sans faces, which is the pairing failure worth avoiding.
 *
 * Poppins is static rather than variable on Google Fonts, so only the three
 * weights the type scale actually uses ship: 500 for labels, 600 for headings,
 * 700 for the marketing display. ~24KB total, latin subset.
 */
import localFont from 'next/font/local'

export const fontSans = localFont({
  src: '../assets/fonts/geist-sans.woff2',
  variable: '--font-sans',
  display: 'swap',
  weight: '100 900',
})

/**
 * `preload: false`, and this is the same rule DESIGN.md states about the root
 * providers: whatever the root layout declares, every visitor downloads on every
 * route, including the landing page.
 *
 * Fonts declared here are preloaded regardless of whether the rendered route
 * uses them, so Geist Mono was 31KB on the critical path of every page — to set
 * four digits on the marketing page ("7 / 11" and three step numbers) and
 * nothing at all on several others. It still loads, just off the critical path,
 * and `adjustFontFallback` metric-matches the substitute so the swap does not
 * shift layout.
 *
 * Geist Sans and Poppins stay preloaded: those two set essentially every glyph
 * above the fold.
 */
export const fontMono = localFont({
  src: '../assets/fonts/geist-mono.woff2',
  variable: '--font-mono',
  display: 'swap',
  weight: '100 900',
  preload: false,
})

export const fontHeading = localFont({
  src: [
    { path: '../assets/fonts/poppins-500.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/poppins-600.woff2', weight: '600', style: 'normal' },
    { path: '../assets/fonts/poppins-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-heading',
  display: 'swap',
  // Poppins runs large on the body and short on the x-height next to Geist.
  // Matching the fallback's metrics keeps the swap from shifting layout.
  adjustFontFallback: 'Arial',
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
})

/** Space-separated variable classes applied to <html>. */
export const fontVariables = `${fontSans.variable} ${fontMono.variable} ${fontHeading.variable}`
