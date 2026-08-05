#!/usr/bin/env node
/**
 * Renders every raster form of the Levvro mark from one source: `app/icon.svg`.
 *
 * Outputs:
 *   src/app/favicon.ico          16/32/48/256, PNG payloads in an ICO container
 *   src/app/apple-icon.png       180x180
 *   src/app/opengraph-image.png  1200x630 social card
 *   src/app/twitter-image.png    the same card
 *   public/icon-512.png          512x512, for a future web-app manifest
 *
 * Run after any change to the mark or the palette:
 *   node scripts/build-brand-assets.mjs
 *
 * This exists because the alternative is drift, and the drift already happened:
 * `favicon.ico` sat in `src/app/` carrying the pre-navy mark through an entire
 * redesign. Nothing imports it, no gate visits it, and Next lists it FIRST in
 * the document head — so browsers and crawlers kept getting a black circle while
 * every surface a human looked at was correct. One command, one source.
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = join(import.meta.dirname, '..')
const p = (...s) => join(ROOT, ...s)
const svg = readFileSync(p('src', 'app', 'icon.svg'), 'utf8')

const browser = await chromium.launch()

/** Render the icon SVG at an exact pixel size, transparent outside the tile. */
async function renderIcon(size) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  await page.setContent(
    `<style>html,body{margin:0;padding:0}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`,
  )
  await page.waitForTimeout(120)
  const buf = await page.screenshot({ omitBackground: true })
  await page.close()
  return buf
}

/* --------------------------------- favicon.ico ---------------------------- */
/*
 * One entry per size rather than a lone 256: a 16px browser tab should get a
 * bitmap rendered at 16px, not the browser's downscale of a 256px one, which
 * turns the book cut-out to mush.
 */
const ICO_SIZES = [16, 32, 48, 256]
const pngs = []
for (const size of ICO_SIZES) pngs.push(await renderIcon(size))

const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(ICO_SIZES.length, 4)

const entries = []
let offset = 6 + 16 * ICO_SIZES.length
ICO_SIZES.forEach((size, i) => {
  const e = Buffer.alloc(16)
  e.writeUInt8(size >= 256 ? 0 : size, 0) // 0 means 256 in the ICO spec
  e.writeUInt8(size >= 256 ? 0 : size, 1)
  e.writeUInt8(0, 2) // palette entries
  e.writeUInt8(0, 3) // reserved
  e.writeUInt16LE(1, 4) // colour planes
  e.writeUInt16LE(32, 6) // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8)
  e.writeUInt32LE(offset, 12)
  offset += pngs[i].length
  entries.push(e)
})
writeFileSync(p('src', 'app', 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]))
console.log(`✓ src/app/favicon.ico (${ICO_SIZES.join('/')})`)

writeFileSync(p('src', 'app', 'apple-icon.png'), await renderIcon(180))
console.log('✓ src/app/apple-icon.png (180)')
writeFileSync(p('public', 'icon-512.png'), await renderIcon(512))
console.log('✓ public/icon-512.png (512)')

/* ------------------------------- social card ------------------------------ */
/*
 * The card renders in an isolated page, so `next/font` is not in play. The
 * faces are embedded as base64 — otherwise the most-shared asset in the product
 * ships in whatever sans the renderer happens to have installed.
 */
const b64 = (f) => readFileSync(p('src', 'assets', 'fonts', f)).toString('base64')
const poppins700 = b64('poppins-700.woff2')
const poppins600 = b64('poppins-600.woff2')
const geist = b64('geist-sans.woff2')

const CARD = `
<style>
  @font-face{font-family:Poppins;font-weight:700;src:url(data:font/woff2;base64,${poppins700}) format('woff2')}
  @font-face{font-family:Poppins;font-weight:600;src:url(data:font/woff2;base64,${poppins600}) format('woff2')}
  @font-face{font-family:Geist;font-weight:100 900;src:url(data:font/woff2;base64,${geist}) format('woff2')}
  html,body{margin:0;padding:0}
  .card{width:1200px;height:630px;position:relative;overflow:hidden;
    background:#0b2540;color:#fff;font-family:Geist,ui-sans-serif,system-ui,sans-serif;
    display:flex;flex-direction:column;justify-content:space-between;
    padding:72px 80px;box-sizing:border-box}
  /* Same layer stack as the hero: one light from the upper right, the chevron
     field over it. */
  .light{position:absolute;inset:0;background:
    radial-gradient(58% 46% at 84% 0%, rgba(33,183,165,.26), transparent 70%),
    radial-gradient(70% 60% at 4% 108%, rgba(9,29,51,.9), transparent 72%)}
  .field{position:absolute;inset:0;background:#fff;opacity:.055;
    -webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='14' viewBox='0 0 28 14'%3E%3Cpath d='M0 10.5 L7 3.5 L14 10.5 M14 10.5 L21 3.5 L28 10.5' fill='none' stroke='%23fff' stroke-width='0.9' stroke-linecap='square'/%3E%3C/svg%3E");
    -webkit-mask-size:28px 14px}
  .row{position:relative;display:flex;align-items:center;gap:16px}
  .row svg{width:44px;height:auto}
  .word{font-family:Poppins;font-size:34px;font-weight:600;letter-spacing:-.01em}
  .word i{font-style:normal;color:#45c9b7}
  h1{position:relative;margin:0;font-family:Poppins;font-size:74px;line-height:1.08;
     letter-spacing:-.02em;font-weight:700;max-width:16ch}
  p{position:relative;margin:20px 0 0;font-size:27px;line-height:1.45;color:#aebccc;max-width:44ch}
  .rule{position:relative;width:88px;height:5px;background:#45c9b7;border-radius:3px;margin-bottom:26px}
</style>
<div class="card">
  <div class="light"></div><div class="field"></div>
  <div class="row">
    ${svg.replace('<rect width="128" height="128" rx="28" fill="#0a2540"/>', '')}
    <span class="word">Levvr<i>o</i></span>
  </div>
  <div>
    <div class="rule"></div>
    <h1>Know exactly what your CV proves.</h1>
    <p>AI coaching that shows which skills your CV evidences &mdash; and the line that decided each verdict.</p>
  </div>
</div>`

const card = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await card.setContent(CARD)
await card.waitForTimeout(400)
const shot = await card.screenshot()
writeFileSync(p('src', 'app', 'opengraph-image.png'), shot)
writeFileSync(p('src', 'app', 'twitter-image.png'), shot)
console.log('✓ src/app/opengraph-image.png + twitter-image.png (1200x630)')

await browser.close()
