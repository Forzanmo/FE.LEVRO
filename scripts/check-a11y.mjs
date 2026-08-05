#!/usr/bin/env node
/**
 * Accessibility gate.
 *
 * Runs axe-core against every route in both themes at two viewports, plus a
 * keyboard-reachability probe that axe cannot do: axe audits a static DOM, so it
 * never opens a Select, a Dialog, or an Accordion, and it has no opinion on
 * focus order. This adds the checks that matter for a keyboard-only user and
 * fails the build on any violation.
 *
 * Usage:
 *   node scripts/check-a11y.mjs
 *   node scripts/check-a11y.mjs --base http://localhost:3001 --json
 *
 * Exit codes: 0 = clean, 1 = violations, 2 = could not run.
 */

import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

import { HIDE_DEV_OVERLAYS, ROUTES, parseRouteArg, seedFor } from './lib/app-state.mjs'
import { resolveBase } from './lib/dev-server.mjs'

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

function parseArgs(argv) {
  // `base: null` means "resolve it" — see `lib/dev-server.mjs`.
  const args = { base: null, routes: [], json: false }
  let key = null
  for (const t of argv.slice(2)) {
    if (t.startsWith('--')) {
      key = t.slice(2)
      if (key === 'json') {
        args.json = true
        key = null
      }
      continue
    }
    if (key === 'base') args.base = t
    else if (key === 'routes') args.routes.push(parseRouteArg(t))
  }
  if (!args.routes.length) args.routes = ROUTES
  return args
}

function axeSource() {
  try {
    return fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
  } catch {
    const local = path.join(process.cwd(), 'node_modules', 'axe-core', 'axe.min.js')
    if (fs.existsSync(local)) return fs.readFileSync(local, 'utf8')
    return null
  }
}

async function run() {
  const args = parseArgs(process.argv)
  const AXE = axeSource()
  if (!AXE) {
    console.error('axe-core not found. Install it: npm i -D axe-core')
    process.exit(2)
  }

  const server = await resolveBase(args.base)
  const base = server.base

  let browser
  try {
    browser = await chromium.launch()
  } catch (err) {
    console.error(`Could not launch chromium: ${err.message}`)
    await server.stop()
    process.exit(2)
  }

  const violations = []
  const focusProblems = []
  let checks = 0

  for (const viewport of VIEWPORTS) {
    for (const theme of ['light', 'dark']) {
      for (const route of args.routes) {
        // Fresh context per route so each one gets its own seeded state before
        // first paint, and so no page leaks state into the next.
        const ctx = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
          deviceScaleFactor: 1,
          colorScheme: theme,
        })
        await ctx.addInitScript(
          ([t, seed]) => {
            window.localStorage.setItem('theme', t)
            for (const [k, v] of Object.entries(seed)) {
              window.localStorage.setItem(k, JSON.stringify(v))
            }
          },
          [theme, seedFor(route.state)]
        )
        const page = await ctx.newPage()

        const label = `${route.path}${route.state !== 'onboarded' ? ` (${route.state})` : ''}`
        const url = new URL(route.path, base).toString()
        try {
          await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
        } catch (err) {
          console.log(`✗ ${label} [${theme}/${viewport.name}] navigation failed: ${err.message}`)
          process.exitCode = 2
          await ctx.close()
          continue
        }
        await page.addStyleTag({ content: HIDE_DEV_OVERLAYS })
        await page.waitForTimeout(900)
        await page.addScriptTag({ content: AXE })

        const res = await page.evaluate(async () => {
          const r = await window.axe.run(document, { resultTypes: ['violations'] })
          return r.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            nodes: v.nodes.length,
            help: v.help,
            target: v.nodes[0]?.target?.join(' ') ?? '',
          }))
        })
        checks++
        for (const v of res) violations.push({ route: label, theme, viewport: viewport.name, ...v })

        /*
         * Keyboard pass: tab through and check every stop.
         *
         * `misses` tolerates focus transiently landing outside the document —
         * Chromium's tab order can pass through the dev-tools portal and back to
         * body before reaching app content. Breaking on the first null made this
         * gate report "0 tab stops" on pages whose keyboard order was perfectly
         * fine, which is a false failure and exactly as damaging as a false pass.
         */
        const stops = []
        let misses = 0
        for (let i = 0; i < 70; i++) {
          await page.keyboard.press('Tab')
          const info = await page.evaluate(() => {
            const el = document.activeElement
            if (!el || el === document.body) return null
            const cs = getComputedStyle(el)
            const own = el.getBoundingClientRect()
            /*
             * The HIT AREA, not the element box.
             *
             * A visually-hidden input inside a <label> is the correct pattern for
             * a styled radio or checkbox: the input is 1x1 and sr-only, and the
             * label is what the user actually presses. Measuring the input alone
             * reported every ChoiceGroup option as a 1x1 touch target — a false
             * positive that would have pushed us to "fix" a correct pattern.
             */
            const host = el.closest('label') ?? el
            const box = host.getBoundingClientRect()

            /*
             * Expand by any ::before/::after touch-target extension.
             *
             * Small controls in this system (the Switch, icon buttons) enlarge
             * their tappable area with an absolutely-positioned pseudo-element
             * using negative insets — `after:-inset-x-3 after:-inset-y-2` puts a
             * 56x34 target around an 18px switch track. `getBoundingClientRect`
             * cannot see that, so measuring the element alone reported a
             * correctly-built control as an undersized target. Reading the
             * pseudo-element's computed insets measures what the finger hits.
             */
            let hit = { width: box.width, height: box.height }
            for (const pseudo of ['::after', '::before']) {
              const ps = getComputedStyle(host, pseudo)
              if (ps.position !== 'absolute' || ps.content === 'none') continue
              const num = (v) => (v && v.endsWith('px') ? parseFloat(v) : 0)
              // Negative insets grow the box; positive ones shrink it.
              const growX = -(num(ps.left) + num(ps.right))
              const growY = -(num(ps.top) + num(ps.bottom))
              if (growX > 0 || growY > 0) {
                hit = {
                  width: Math.max(hit.width, box.width + Math.max(0, growX)),
                  height: Math.max(hit.height, box.height + Math.max(0, growY)),
                }
              }
            }

            return {
              tag: el.tagName.toLowerCase(),
              label: (
                el.getAttribute('aria-label') ||
                host.textContent ||
                el.textContent ||
                ''
              )
                .trim()
                .slice(0, 44),
              // Focusable-but-unpainted is a real defect; sr-only skip-links are
              // the deliberate exception and are matched by their own class.
              visible: hit.width > 0 && hit.height > 0,
              srOnly: cs.clipPath === 'inset(50%)' || el.className?.includes?.('sr-only'),
              /*
               * WCAG 2.2 SC 2.5.8 exempts targets that are "in a sentence or
               * whose size is otherwise constrained by the line-height of
               * non-target text". A Privacy Policy link inside a paragraph of
               * legal copy is exactly that, so flagging it as an undersized
               * target would be reporting a non-violation. Detected by asking
               * whether the link's parent also holds its own text.
               */
              inlineInText: (() => {
                if (el.tagName !== 'A') return false
                const parent = el.parentElement
                if (!parent) return false
                for (const n of parent.childNodes) {
                  if (n.nodeType === 3 && n.textContent.trim().length > 1) return true
                }
                return false
              })(),
              indicator:
                (cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0) ||
                cs.boxShadow !== 'none',
              w: Math.round(hit.width),
              h: Math.round(hit.height),
              ownW: Math.round(own.width),
              ownH: Math.round(own.height),
            }
          })
          if (!info) {
            // Focus left the document. Give it a few presses to come back before
            // concluding there is nothing focusable here.
            if (++misses > 4 && stops.length === 0) break
            if (misses > 4) break
            continue
          }
          misses = 0
          // A dev-tools portal is not part of the product; never count it.
          if (info.tag === 'nextjs-portal' || /tanstack query devtools/i.test(info.label)) continue
          const key = `${info.tag}|${info.label}`
          /*
           * Stop on a genuine CYCLE — focus returning to the first stop — not on
           * any repeated label. Breaking on any repeat ended the walk at the
           * second "Get started" (header and footer both have one), leaving
           * every later tab stop unexamined for undersized or invisible targets.
           */
          if (stops.length > 1 && key === stops[0].key) break
          stops.push({ key, ...info })
          // NO second Tab here. The loop already presses once per iteration, so
          // pressing again after a recorded stop advanced twice and skipped the
          // element in between — this walk was examining every OTHER tab stop
          // and reporting the halved count as full coverage.
        }

        // A page with no keyboard entry point at all is a defect, not a clean pass.
        if (stops.length === 0) {
          focusProblems.push({
            route: label,
            theme,
            viewport: viewport.name,
            kind: 'no-tab-stops',
            detail: 'nothing focusable on the page',
          })
        }

        for (const s of stops) {
          if (!s.visible && !s.srOnly) {
            focusProblems.push({
              route: label,
              theme,
              viewport: viewport.name,
              kind: 'focus-on-invisible-element',
              detail: `${s.tag} "${s.label}"`,
            })
          }
          // Touch-target floor (SC 2.5.8), mobile only, measured on the hit area,
          // with the spec's inline-in-a-sentence exception honoured.
          if (
            viewport.name === 'mobile' &&
            s.visible &&
            !s.srOnly &&
            !s.inlineInText &&
            (s.w < 24 || s.h < 24)
          ) {
            focusProblems.push({
              route: label,
              theme,
              viewport: viewport.name,
              kind: 'tiny-target',
              detail: `${s.tag} "${s.label}" ${s.w}x${s.h}`,
            })
          }
        }

        const bad = res.reduce((a, v) => a + v.nodes, 0)
        console.log(
          `${bad ? '✗' : '✓'} ${label} [${theme}/${viewport.name}] — ${stops.length} tab stops, ${bad} axe node(s)`,
        )
        await ctx.close()
      }
    }
  }

  await browser.close()
  await server.stop()

  if (args.json) {
    console.log(JSON.stringify({ violations, focusProblems }, null, 2))
  }

  if (violations.length) {
    console.log(`\naxe violations (${violations.length} findings):`)
    const byRule = {}
    for (const v of violations) (byRule[v.id] ||= []).push(v)
    for (const [id, list] of Object.entries(byRule)) {
      const total = list.reduce((a, v) => a + v.nodes, 0)
      console.log(`  ${id} [${list[0].impact}] — ${total} node(s) across ${list.length} page/theme combos`)
      console.log(`    ${list[0].help}`)
      console.log(`    e.g. ${list[0].route} ${list[0].theme}/${list[0].viewport} :: ${list[0].target}`)
    }
  }

  if (focusProblems.length) {
    const uniq = [...new Map(focusProblems.map((f) => [f.kind + f.detail, f])).values()]
    console.log(`\nkeyboard findings (${uniq.length} unique):`)
    for (const f of uniq.slice(0, 30)) {
      console.log(`  [${f.kind}] ${f.detail} — ${f.route} ${f.theme}/${f.viewport}`)
    }
  }

  const failed = violations.length + focusProblems.length
  if (failed) {
    console.log(`\nFAIL — ${violations.length} axe finding(s), ${focusProblems.length} keyboard finding(s) across ${checks} page renders.`)
    process.exit(1)
  }
  // Zero findings across zero renders is not a pass — it is a gate that never
  // ran. Reporting it green is how a broken harness masquerades as a clean app.
  if (!checks || process.exitCode === 2) {
    console.log(`\nFAIL — the gate did not complete (${checks} page renders).`)
    process.exit(2)
  }
  console.log(`\nPASS — 0 axe violations and 0 keyboard findings across ${checks} page renders.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(2)
})
