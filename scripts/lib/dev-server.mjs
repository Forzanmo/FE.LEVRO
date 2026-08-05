import { spawn } from 'node:child_process'
import net from 'node:net'

/**
 * Resolves a base URL for the verification gates, starting a dev server if it
 * has to.
 *
 * `check-contrast` and `check-a11y` used to hardcode `http://localhost:3000`
 * with no fallback. They fail closed, which is right — but it meant that unless
 * you happened to have a dev server on exactly that port, both exited 2 with
 * "no text runs were measured". The two gates that prove this product's core
 * accessibility claims could not be run unattended, and so were left out of
 * `npm run verify` entirely. A gate nobody can run is not a gate.
 *
 * Resolution order:
 *   1. `--base` on the command line (explicit always wins)
 *   2. `LEVVRO_BASE_URL` in the environment (for CI)
 *   3. an already-running Levvro dev server on a common port (the local case)
 *   4. one this function starts and stops itself (the CI / cold case)
 */

const PROBE_PORTS = [3000, 3001, 3002, 3003, 3004, 3005]
const READY_TIMEOUT_MS = 180_000
/**
 * Generous, because it is only ever spent on a port something is already
 * listening on (see `isListening`). A dev server compiling a route for the
 * first time regularly takes several seconds to finish streaming its HTML; at
 * the old 1500ms this probe declared a perfectly healthy server dead and went
 * off to spawn a second one beside it, and the two then fought for the CPU.
 */
const PROBE_TIMEOUT_MS = 20_000
const CONNECT_TIMEOUT_MS = 400

/** Cheap "is anything on this port at all", so dead ports cost 400ms, not 20s. */
function isListening(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' })
    const done = (result) => {
      socket.destroy()
      resolve(result)
    }
    socket.setTimeout(CONNECT_TIMEOUT_MS, () => done(false))
    socket.once('connect', () => done(true))
    socket.once('error', () => done(false))
  })
}

/**
 * Is something at this URL, and is it us?
 *
 * The abort signal has to stay armed until the BODY is read, not just until the
 * headers land. Clearing it early is what hung this gate: `fetch` resolves as
 * soon as the response head arrives, so a dev server that stalls part-way
 * through streaming its HTML left `res.text()` awaiting bytes that never came,
 * with nothing to interrupt it. Three a11y runs sat blocked here for hours and
 * were mistaken for lost runs.
 */
async function probe(base) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)
  try {
    const res = await fetch(base, { signal: controller.signal })
    if (!res.ok) return false
    // Confirm it is this app: another project on 3000 would otherwise be
    // measured and reported as a pass.
    const html = await res.text()
    return html.includes('Levvro')
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

async function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, () => {
      const { port } = server.address()
      server.close(() => resolve(port))
    })
  })
}

async function waitForReady(base, child) {
  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`dev server exited early with code ${child.exitCode}`)
    }
    if (await probe(base)) return
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`dev server did not become ready within ${READY_TIMEOUT_MS}ms`)
}

/**
 * @param {string|null} explicitBase `--base` from argv, or null.
 * @returns {Promise<{ base: string, started: boolean, stop: () => Promise<void> }>}
 */
export async function resolveBase(explicitBase) {
  const noop = async () => {}

  if (explicitBase) return { base: explicitBase, started: false, stop: noop }

  if (process.env.LEVVRO_BASE_URL) {
    return { base: process.env.LEVVRO_BASE_URL, started: false, stop: noop }
  }

  for (const port of PROBE_PORTS) {
    if (!(await isListening(port))) continue
    const base = `http://localhost:${port}`
    if (await probe(base)) {
      console.log(`Using the dev server already running at ${base}`)
      return { base, started: false, stop: noop }
    }
  }

  const port = await freePort()
  const base = `http://localhost:${port}`
  console.log(`No dev server found — starting one at ${base}…`)

  // `shell: true` for Windows, where `npm` is a .cmd shim.
  const child = spawn('npm', ['run', 'dev', '--', '-p', String(port)], {
    shell: true,
    stdio: 'ignore',
    env: { ...process.env, BROWSER: 'none' },
  })

  let stopped = false
  const stop = async () => {
    if (stopped) return
    stopped = true
    // `next dev` spawns workers; on Windows only taskkill /T reliably takes the
    // tree down, and a stray server would hold the port for the next run.
    if (process.platform === 'win32') {
      await new Promise((resolve) => {
        spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], {
          stdio: 'ignore',
          shell: true,
        }).on('close', resolve)
      })
    } else {
      child.kill('SIGTERM')
    }
  }

  // Never leave a server behind, however the gate ends.
  const onExit = () => {
    void stop()
  }
  process.once('exit', onExit)
  process.once('SIGINT', onExit)
  process.once('SIGTERM', onExit)

  try {
    await waitForReady(base, child)
  } catch (error) {
    await stop()
    throw error
  }

  return { base, started: true, stop }
}
