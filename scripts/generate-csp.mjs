// Generates a per-page Content-Security-Policy for the static export.
//
// Next.js nonces need server-side rendering (per request), which a fully
// static `output: 'export'` site cannot do. The standard static alternative
// is a hash-based CSP: every inline <script> that Next.js emits is allowed by
// its SHA-256 hash and nothing else inline may run, so `'unsafe-inline'` is
// not needed for scripts. Inline script bodies differ per page, so this runs
// after `next build` and writes one nginx `location` block per page.
//
// Output: deploy/generated/csp-locations.conf (gitignored), copied into the
// image and included by deploy/nginx.conf. The build fails loudly if the
// output would be empty or unsafe.
//
// Mode: the policy is delivered as Content-Security-Policy-Report-Only by
// default (violations are only reported in the browser console, nothing is
// blocked). Run with CSP_MODE=enforce to emit the enforcing header instead.

import { createHash } from "node:crypto"
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, join, relative, sep } from "node:path"
import process from "node:process"

const OUT_DIR = "out"
const DEST = join("deploy", "generated", "csp-locations.conf")
const HEADERS_INCLUDE = "/etc/nginx/security-headers.conf"

const ENFORCE = process.env.CSP_MODE === "enforce"
const CSP_HEADER = ENFORCE ? "Content-Security-Policy" : "Content-Security-Policy-Report-Only"

// <script type="..."> values that are data blocks, not executable code.
const EXECUTABLE_TYPES = new Set(["", "text/javascript", "application/javascript", "module"])

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === "_next") continue
      yield* walk(full)
    } else if (entry.name.endsWith(".html")) {
      yield full
    }
  }
}

function fail(message) {
  process.stderr.write(`generate-csp: ${message}\n`)
  process.exit(1)
}

function inlineScriptHashes(html, file) {
  const hashes = new Set()
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
  let match
  while ((match = scriptRe.exec(html)) !== null) {
    const attrs = match[1]
    const body = match[2]
    if (/\bsrc\s*=/i.test(attrs)) continue // external file, allowed by 'self'
    const type = (/\btype\s*=\s*["']([^"']*)["']/i.exec(attrs)?.[1] ?? "").toLowerCase()
    if (!EXECUTABLE_TYPES.has(type)) continue // e.g. application/ld+json
    if (body.trim() === "") continue // executes nothing
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`)
  }

  // CSP blocks inline event handlers and javascript: URLs outright, so the
  // markup (outside script bodies) must not contain any.
  const markup = html.replace(scriptRe, "")
  if (/\son[a-z]+\s*=\s*["']/i.test(markup)) fail(`${file}: inline event handler attribute found`)
  if (/href\s*=\s*["']\s*javascript:/i.test(markup)) fail(`${file}: javascript: URL found`)

  return [...hashes].sort()
}

function policy(hashes) {
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ")
}

// One nginx location. add_header directives of an outer level are dropped as
// soon as a location defines its own, so each block repeats the shared
// security headers and the cache rule: HTML is revalidated on every use
// (no-cache) and must reach the browser byte for byte (no-transform), because
// the hashes above are computed from exactly this markup.
function block(matcher, csp, { internal = false, tryFiles = null } = {}) {
  return [
    `location ${matcher} {`,
    ...(internal ? ["    internal;"] : []),
    `    include ${HEADERS_INCLUDE};`,
    `    add_header Cache-Control "no-cache, no-transform" always;`,
    `    add_header ${CSP_HEADER} "${csp}" always;`,
    ...(tryFiles ? [`    try_files ${tryFiles} =404;`] : []),
    "}",
  ].join("\n")
}

const blocks = []
const summary = []

for (const file of walk(OUT_DIR)) {
  const rel = relative(OUT_DIR, file).split(sep).join("/") // e.g. "hu/projects.html"
  if (rel === "_not-found.html") continue

  const hashes = inlineScriptHashes(readFileSync(file, "utf8"), rel)
  if (hashes.length === 0) fail(`${rel}: no inline script hashes found - the Next.js output format changed?`)
  const csp = policy(hashes)
  summary.push(`${rel}: ${hashes.length} script hashes`)

  if (rel === "404.html") {
    blocks.push(block("= /404.html", csp, { internal: true }))
    continue
  }

  const target = `/${rel}`
  const route = rel === "index.html" ? "/" : `/${rel.slice(0, -".html".length)}`
  // The extensionless route and the literal .html file get the same policy,
  // so neither is an unprotected way to reach the page.
  blocks.push(block(`= ${route}`, csp, { tryFiles: target }))
  blocks.push(block(`= ${target}`, csp, { tryFiles: target }))
}

if (!summary.some((line) => line.startsWith("404.html"))) fail("out/404.html missing")
if (!summary.some((line) => line.startsWith("index.html"))) fail("out/index.html missing")
if (blocks.length < 8) fail("suspiciously few pages found")

mkdirSync(dirname(DEST), { recursive: true })
writeFileSync(
  DEST,
  `# GENERATED by scripts/generate-csp.mjs - do not edit, do not commit.\n\n${blocks.join("\n\n")}\n`,
)
process.stdout.write(
  `generate-csp: wrote ${DEST} (${ENFORCE ? "enforcing" : "report-only"})\n  ${summary.join("\n  ")}\n`,
)
