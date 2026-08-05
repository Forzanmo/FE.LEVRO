#!/usr/bin/env node
/**
 * Rendered-contrast gate.
 *
 * `build-tokens.mts` proves that token *pairs* clear WCAG AA. That check cannot
 * see what actually lands on screen: text on the brand surfaces composites over
 * the AuroraBackdrop (a translucent wash + blurred glows + a dot grid), and the
 * effective background behind a glyph is nothing any token knows about.
 *
 * This script measures the real thing. For every visible text run on a route it:
 *   1. paints the glyphs transparent (keeping layout AND every background box
 *      intact — `visibility:hidden` would also drop the element's own
 *      background and report a falsely low number),
 *   2. screenshots the viewport so the sampled pixels are the true composite,
 *   3. composites the text colour (including inherited opacity) over each
 *      sampled pixel, and
 *   4. reports the WORST ratio found under the run, against the threshold WCAG
 *      2.2 requires for that run's computed size and weight.
 *
 * Backgrounds here are gradients, so a single sample is meaningless — the floor
 * is what matters. Sampling is a grid across each client rect, and the reported
 * ratio is the minimum.
 *
 * Usage:
 *   node scripts/check-contrast.mjs
 *   node scripts/check-contrast.mjs --base http://localhost:3000 --routes / /sign-in
 *   node scripts/check-contrast.mjs --themes dark --json
 *
 * Exit codes: 0 = all pass, 1 = at least one failure, 2 = could not run.
 */

import { chromium } from 'playwright'
import { PNG } from 'pngjs'

// Routes, their states, and the dev-overlay mask are shared with the a11y gate
// so both measure the same surfaces in the same states. See lib/app-state.mjs.
import {
  HIDE_DEV_OVERLAYS,
  ROUTES as DEFAULT_ROUTES,
  parseRouteArg,
  seedFor,
} from './lib/app-state.mjs'
import { resolveBase } from './lib/dev-server.mjs'

const DEFAULT_THEMES = ['light', 'dark']
const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

/** Aurora glows drift, so the composite moves; sample a few frames. */
const FRAME_SAMPLES = 3
const FRAME_INTERVAL_MS = 900

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  // `base: null` means "resolve it" — see `lib/dev-server.mjs`. Hardcoding
  // localhost:3000 here is what made this gate unrunnable unless you already
  // happened to have a server on that exact port.
  const args = { base: null, routes: [], themes: [], json: false }
  let key = null
  for (const token of argv.slice(2)) {
    if (token.startsWith('--')) {
      key = token.slice(2)
      if (key === 'json') {
        args.json = true
        key = null
      }
      continue
    }
    if (key === 'base') args.base = token
    // A CLI route may carry its state as `path#state`, e.g. /dashboard#onboarded.
    else if (key === 'routes') args.routes.push(parseRouteArg(token))
    else if (key === 'themes') args.themes.push(token)
  }
  if (!args.routes.length) args.routes = DEFAULT_ROUTES
  if (!args.themes.length) args.themes = DEFAULT_THEMES
  return args
}

// ---------------------------------------------------------------------------
// Colour math (WCAG 2.x relative luminance)
// ---------------------------------------------------------------------------

const channel = (v) => {
  const s = v / 255
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
}

const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

function contrast(a, b) {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/** Source-over composite of a possibly-translucent colour onto an opaque one. */
function composite([r, g, b, a], bg) {
  if (a >= 1) return [r, g, b]
  return [
    r * a + bg[0] * (1 - a),
    g * a + bg[1] * (1 - a),
    b * a + bg[2] * (1 - a),
  ]
}

/**
 * WCAG 2.2 SC 1.4.3: 3:1 for "large" text (>=24px, or >=18.66px when bold),
 * 4.5:1 otherwise. Sizes arrive in px from getComputedStyle.
 */
function requiredRatio(fontSizePx, fontWeight) {
  const bold = Number(fontWeight) >= 700
  const large = fontSizePx >= 24 || (bold && fontSizePx >= 18.66)
  return large ? 3 : 4.5
}

// ---------------------------------------------------------------------------
// In-page collection
// ---------------------------------------------------------------------------

/**
 * Returns one entry per element that paints its own text, with the resolved
 * colour, the accumulated opacity from its ancestor chain, and its client
 * rects. Runs in the page.
 */
const COLLECT = `(() => {
  const out = []
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TITLE', 'svg', 'SVG'])

  // Tokens are authored in OKLCH and Chrome returns \`color\` as oklch(...), so
  // string-parsing the computed value yields garbage. Let the browser do the
  // conversion: painting into a 1x1 sRGB canvas resolves any colour syntax and
  // clamps out-of-gamut values exactly the way the display will.
  const probe = document.createElement('canvas')
  probe.width = probe.height = 1
  const probeCtx = probe.getContext('2d', { willReadFrequently: true })
  const parseColor = (str) => {
    probeCtx.clearRect(0, 0, 1, 1)
    probeCtx.fillStyle = '#000'
    probeCtx.fillStyle = str
    probeCtx.fillRect(0, 0, 1, 1)
    const d = probeCtx.getImageData(0, 0, 1, 1).data
    return [d[0], d[1], d[2], d[3] / 255]
  }

  const hasOwnText = (el) => {
    for (const node of el.childNodes) {
      if (node.nodeType === 3 && node.textContent.trim().length) return true
    }
    return false
  }

  const isHidden = (el) => {
    if (el.closest('[aria-hidden="true"]')) return true
    // sr-only: clipped to 1px. Never painted, so contrast is meaningless.
    const r = el.getBoundingClientRect()
    if (r.width <= 1 || r.height <= 1) return true
    return false
  }

  let id = 0
  for (const el of document.body.querySelectorAll('*')) {
    if (SKIP.has(el.tagName)) continue
    if (!hasOwnText(el)) continue

    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none') continue
    if (parseFloat(cs.opacity) === 0) continue
    if (isHidden(el)) continue

    const color = parseColor(cs.color)
    if (!color || color[3] === 0) continue

    // Accumulate ancestor opacity — a 0.5-opacity wrapper halves effective alpha.
    let alpha = color[3]
    let node = el
    while (node && node !== document.documentElement) {
      const o = parseFloat(getComputedStyle(node).opacity)
      if (!Number.isNaN(o)) alpha *= o
      node = node.parentElement
    }
    // Effectively unpainted (an un-triggered scroll reveal, a faded-out layer).
    // Sampling it would measure the page background and report a bogus 1:1, so
    // surface it as its own class of problem instead of as a contrast failure.
    if (alpha < 0.05) {
      out.push({ id: id++, unpainted: true, tag: el.tagName.toLowerCase(),
        text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 70) })
      continue
    }

    // Measure the GLYPH boxes, not the element box. A block-level <a> wrapping
    // a button is far wider than its label, and sampling its corners would read
    // the page background instead of the button fill. A Range over the element's
    // own text nodes gives tight per-line boxes.
    //
    // Each candidate point is then hit-tested. Without that, text scrolled under
    // the sticky header still reports client rects, and the sampler happily
    // reads the HEADER's pixels as that text's background — scoring a heading
    // against the nav's teal button. If the topmost element at a point is not
    // this element, the user cannot see the text there, so it is not measurable.
    const STEPS = 7
    const points = []
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.textContent.trim().length) continue
      const range = document.createRange()
      range.selectNodeContents(node)
      for (const r of range.getClientRects()) {
        if (r.width <= 1 || r.height <= 1) continue
        // Inset so the sample stays inside the line box, off the leading edges.
        const padX = Math.min(r.width * 0.12, 6)
        const padY = Math.min(r.height * 0.22, 6)
        const x0 = r.x + padX
        const y0 = r.y + padY
        const w = Math.max(1, r.width - padX * 2)
        const h = Math.max(1, r.height - padY * 2)
        for (let i = 0; i < STEPS; i++) {
          for (let j = 0; j < STEPS; j++) {
            const px = x0 + (w * i) / (STEPS - 1)
            const py = y0 + (h * j) / (STEPS - 1)
            if (px < 0 || py < 0 || px >= innerWidth || py >= innerHeight) continue
            const hit = document.elementFromPoint(px, py)
            if (!hit || !(hit === el || el.contains(hit))) continue
            points.push({ x: px, y: py })
          }
        }
      }
      range.detach?.()
    }
    if (!points.length) continue

    out.push({
      id: id++,
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 70),
      color: [color[0], color[1], color[2], alpha],
      fontSize: parseFloat(cs.fontSize),
      fontWeight: cs.fontWeight,
      points,
    })
  }
  return out
})()`

const MASK_STYLE_ID = '__contrast_mask__'

/**
 * Hide every glyph while leaving the painted world otherwise identical.
 *
 * `-webkit-text-fill-color` is the precise tool here: it suppresses glyph fill
 * WITHOUT touching `color`, so anything deriving from `currentColor` — icon
 * strokes, border-color, ring-color — still paints exactly as it does normally.
 * (`color: transparent` would blank those too and understate the background.)
 *
 * Applied as a blanket rule in a <style> we own, deliberately not keyed to any
 * per-element attribute: React re-renders during the frame-sampling window strip
 * unknown attributes, which silently un-masks the text and makes the sampler
 * read glyph pixels — reporting a perfect 1.00:1 for perfectly fine text.
 */
const MASK_ON = `(() => {
  let style = document.getElementById('${MASK_STYLE_ID}')
  if (!style) {
    style = document.createElement('style')
    style.id = '${MASK_STYLE_ID}'
    document.head.appendChild(style)
  }
  style.textContent =
    '*,*::before,*::after{-webkit-text-fill-color:transparent !important;' +
    'text-shadow:none !important;caret-color:transparent !important}'
})()`

const MASK_OFF = `(() => {
  const style = document.getElementById('${MASK_STYLE_ID}')
  if (style) style.textContent = ''
})()`

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------

/** Read the composited pixel at each already-hit-tested point. */
function samplePixels(png, scale, points) {
  const samples = []
  for (const { x, y } of points) {
    const px = Math.min(png.width - 1, Math.max(0, Math.round(x * scale)))
    const py = Math.min(png.height - 1, Math.max(0, Math.round(y * scale)))
    const idx = (png.width * py + px) << 2
    samples.push([png.data[idx], png.data[idx + 1], png.data[idx + 2]])
  }
  return samples
}

/** Park the viewport at `y` and wait for it to actually settle there. */
async function scrollTo(page, y) {
  await page.evaluate((top) => window.scrollTo(0, top), y)
  await page.waitForFunction(
    (target) => Math.abs(window.scrollY - target) < 2 ||
      window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 2,
    y,
    { timeout: 4000 }
  ).catch(() => {})
  await page.waitForTimeout(200)
}

/**
 * Wait until the page stops changing beyond a small tolerance.
 *
 * A fixed sleep is not enough here: the sticky header's translucent background
 * and `backdrop-filter` recomposite after a scroll jump, and sampling mid-flight
 * catches a half-blended backdrop — which shows up as a spurious 1.x:1 result
 * that vanishes on the next frame. The tolerance exists because the aurora
 * glows drift continuously, so successive frames are never bit-identical.
 */
async function waitForStablePaint(page, { tries = 8, gapMs = 220, tolerance = 2.2 } = {}) {
  let prev = null
  for (let i = 0; i < tries; i++) {
    const png = PNG.sync.read(await page.screenshot({ type: 'png' }))
    if (prev && prev.data.length === png.data.length) {
      let sum = 0
      // Stride over the buffer; a full per-pixel diff is needless here.
      for (let p = 0; p < png.data.length; p += 64) sum += Math.abs(png.data[p] - prev.data[p])
      if (sum / (png.data.length / 64) < tolerance) return true
    }
    prev = png
    await page.waitForTimeout(gapMs)
  }
  return false
}

async function measureRoute(page, { url, theme, viewport }) {
  await page.goto(url, { waitUntil: 'networkidle' })
  // `globals.css` sets `scroll-behavior: smooth`, so a programmatic scroll keeps
  // animating after the call returns — client rects collected mid-flight would
  // no longer line up with the screenshot. Measurement needs instant jumps.
  await page.addStyleTag({
    content:
      'html,body,*{scroll-behavior:auto !important}' +
      // Dev overlays float above the footer, and their multi-hue logos were being
      // sampled as page background (impossible lime/coral/magenta reads).
      HIDE_DEV_OVERLAYS,
  })
  // next-themes (attribute="class") toggles only `.dark`; light is its absence.
  await page.waitForFunction(
    (wantDark) => document.documentElement.classList.contains('dark') === wantDark,
    theme === 'dark',
    { timeout: 8000 }
  )
  await page.waitForTimeout(1200) // let the drifting glows settle

  // Scroll-triggered reveals start at opacity 0. Walk the whole page once so
  // every `whileInView` transition has fired, then return to the top — otherwise
  // we would sample the page background through content that never painted.
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight)
  const steps = Math.max(1, Math.ceil(scrollHeight / viewport.height))
  for (let step = 0; step <= steps; step++) {
    await scrollTo(page, step * viewport.height)
  }
  await scrollTo(page, 0)
  await page.waitForTimeout(500)

  const results = new Map()
  const unpainted = []

  for (let step = 0; step < steps; step++) {
    await scrollTo(page, step * viewport.height)
    await waitForStablePaint(page)

    const collected = await page.evaluate(COLLECT)
    const elements = collected.filter((e) => !e.unpainted)
    for (const e of collected) {
      if (e.unpainted && !unpainted.some((u) => u.text === e.text)) unpainted.push(e)
    }
    if (!elements.length) continue

    await page.evaluate(MASK_ON)
    await waitForStablePaint(page)

    // Aurora drift: take the worst composite across a few frames.
    for (let frame = 0; frame < FRAME_SAMPLES; frame++) {
      if (frame) await page.waitForTimeout(FRAME_INTERVAL_MS)
      const buf = await page.screenshot({ type: 'png' })
      const png = PNG.sync.read(buf)
      const scale = png.width / viewport.width

      for (const el of elements) {
        const bgSamples = samplePixels(png, scale, el.points)
        // Key on stable identity, NOT the collector's per-step counter: that
        // counter restarts each scroll step, so results for different elements
        // would merge and cross-contaminate (one run's text colour scored
        // against another run's background).
        const key = `${el.tag}|${el.fontSize}|${el.fontWeight}|${el.color.join(',')}|${el.text}`
        for (const bg of bgSamples) {
          const fg = composite(el.color, bg)
          const ratio = contrast(fg, bg)
          const prev = results.get(key)
          if (!prev || ratio < prev.ratio) {
            results.set(key, {
              ratio,
              bg,
              fg,
              tag: el.tag,
              text: el.text,
              fontSize: el.fontSize,
              fontWeight: el.fontWeight,
              required: requiredRatio(el.fontSize, el.fontWeight),
            })
          }
        }
      }
    }

    await page.evaluate(MASK_OFF)
  }

  return { measured: [...results.values()], unpainted, finalUrl: page.url() }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const fmt = (n) => `${n.toFixed(2)}:1`
const rgb = ([r, g, b]) =>
  `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`

async function main() {
  const args = parseArgs(process.argv)
  const server = await resolveBase(args.base)
  const base = server.base

  let browser
  try {
    browser = await chromium.launch()
  } catch (err) {
    console.error(`Could not launch chromium: ${err.message}`)
    console.error('Run `npx playwright install chromium` first.')
    await server.stop()
    process.exit(2)
  }

  const failures = []
  const all = []

  const unexpectedRedirects = []

  for (const viewport of VIEWPORTS) {
    for (const theme of args.themes) {
      for (const route of args.routes) {
        /*
         * A FRESH context per route, not per (viewport, theme).
         *
         * Each route declares the app state it must be measured in, and that
         * state is seeded into localStorage before first paint — which is only
         * possible with an init script on a context that has not navigated yet.
         * Reusing one context across routes would also leak state between them
         * (a page that writes `dashboardSeenAt` silently changes what the next
         * route renders), so per-route isolation is a correctness win regardless.
         */
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: 1,
          colorScheme: theme === 'dark' ? 'dark' : 'light',
        })
        // next-themes reads `theme` before first paint; the rest is app state.
        await context.addInitScript(
          ([t, seed]) => {
            window.localStorage.setItem('theme', t)
            for (const [k, v] of Object.entries(seed)) {
              window.localStorage.setItem(k, JSON.stringify(v))
            }
          },
          [theme, seedFor(route.state)]
        )
        const page = await context.newPage()

        const label = `${route.path}${route.state !== 'onboarded' ? ` (${route.state})` : ''}`
        const url = new URL(route.path, base).toString()
        let out
        try {
          out = await measureRoute(page, { url, theme, viewport })
        } catch (err) {
          console.error(`✗ ${label} [${theme}/${viewport.name}] — ${err.message}`)
          process.exitCode = 2
          await context.close()
          continue
        }
        const { measured, unpainted, finalUrl } = out

        for (const m of measured) {
          const entry = { route: label, theme, viewport: viewport.name, ...m }
          all.push(entry)
          if (m.ratio < m.required) failures.push(entry)
        }

        const bad = measured.filter((m) => m.ratio < m.required).length
        const landed = new URL(finalUrl).pathname
        const redirected = landed !== new URL(url).pathname
        // A redirect means the gate measured a DIFFERENT page than intended.
        // Silently passing on the wrong surface is how the dashboard's populated
        // state went unmeasured for an entire run — so this is now an error.
        if (redirected) {
          unexpectedRedirects.push({ route: label, theme, viewport: viewport.name, landed })
        }
        const mark = bad ? '✗' : redirected ? '!' : '✓'
        const redirect = redirected ? `  → REDIRECTED to ${landed} (state not reached)` : ''
        console.log(
          `${mark} ${label} [${theme}/${viewport.name}] — ${measured.length} text runs, ${bad} failing` +
            (unpainted.length ? `, ${unpainted.length} never painted` : '') +
            redirect
        )
        if (unpainted.length) {
          for (const u of unpainted.slice(0, 5)) {
            console.log(`    ⚠ unpainted <${u.tag}> "${u.text}"`)
          }
        }

        await context.close()
      }
    }
  }

  await browser.close()
  await server.stop()

  if (args.json) {
    console.log(JSON.stringify({ failures, total: all.length }, null, 2))
  } else if (failures.length) {
    console.log(`\n${failures.length} contrast failures (worst first):\n`)
    failures.sort((a, b) => a.ratio - b.ratio)
    for (const f of failures.slice(0, 40)) {
      console.log(
        `  ${fmt(f.ratio)} (needs ${f.required}:1)  ${f.route} ${f.theme}/${f.viewport}\n` +
          `    <${f.tag}> ${f.fontSize}px/${f.fontWeight}  fg ${rgb(f.fg)} on ${rgb(f.bg)}\n` +
          `    "${f.text}"\n`
      )
    }
    if (failures.length > 40) console.log(`  …and ${failures.length - 40} more.\n`)
  }

  if (unexpectedRedirects.length) {
    const uniq = [...new Map(unexpectedRedirects.map((r) => [r.route + r.landed, r])).values()]
    console.log(`\n${uniq.length} route(s) never reached the intended state:\n`)
    for (const r of uniq) {
      console.log(`  ${r.route} → landed on ${r.landed}`)
    }
    console.log(
      '  These surfaces were NOT measured. Fix the seed state or the route list —\n' +
        '  a pass here would be a pass on the wrong page.\n'
    )
  }

  if (failures.length) {
    console.log(`FAIL — ${failures.length}/${all.length} text runs below WCAG AA.`)
    process.exit(1)
  }
  if (process.exitCode === 2 || !all.length) {
    console.log('FAIL — no text runs were measured; the run did not complete.')
    process.exit(2)
  }
  if (unexpectedRedirects.length) {
    console.log(
      `FAIL — ${all.length} text runs clear AA, but ${unexpectedRedirects.length} route/state combos were never reached.`
    )
    process.exit(1)
  }
  console.log(`PASS — all ${all.length} text runs clear WCAG AA, every route in its intended state.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(2)
})
