// Minimal, dependency-free static file server for the Render preview
// deploy only. Serves the `out/` static export behind HTTP Basic Auth
// so a handful of people can preview the site before it's public.
// Not used by the production VPS deploy - that stays plain nginx.
const http = require("http")
const fs = require("fs")
const path = require("path")
const crypto = require("crypto")

const ROOT = path.resolve(__dirname, "..", "out")
const USER = process.env.PREVIEW_USER || "guest"
const PASS = process.env.PREVIEW_PASS || ""

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
}

// Constant-time comparison so a wrong Basic Auth header can't be distinguished
// from a right one by response timing.
function safeEqual(a, b) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

// Minimal in-memory brute-force throttle: 10 failed attempts per IP per
// 5-minute window, then 429. Map is capped so a flood of spoofed IPs can't
// grow it unbounded on this long-running free-tier process.
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_MAP_CAP = 1000
const failedAttempts = new Map()

function isRateLimited(ip) {
  const entry = failedAttempts.get(ip)
  if (!entry || Date.now() - entry.windowStart > RATE_LIMIT_WINDOW_MS) return false
  return entry.count >= RATE_LIMIT_MAX
}

function recordFailedAttempt(ip) {
  const now = Date.now()
  const entry = failedAttempts.get(ip)
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    if (failedAttempts.size >= RATE_LIMIT_MAP_CAP) failedAttempts.clear()
    failedAttempts.set(ip, { count: 1, windowStart: now })
  } else {
    entry.count++
  }
}

http
  .createServer((req, res) => {
    // Render sets the FIRST entry of X-Forwarded-For to the real client IP
    // itself (confirmed via Render staff, feedback.render.com/features/p/
    // send-the-correct-xforwardedfor: "we set the first IP in the list to
    // the real client IP") - it does not append like a standard reverse
    // proxy. So position 0 is the one hop the client can't forge; anything
    // after it is whatever the client itself sent and must not be trusted.
    const xff = req.headers["x-forwarded-for"]
    const ip = xff ? xff.split(",")[0].trim() : req.socket.remoteAddress || "unknown"
    if (isRateLimited(ip)) {
      res.writeHead(429, { "Retry-After": "300" })
      return res.end("Too many attempts")
    }

    const expected = "Basic " + Buffer.from(`${USER}:${PASS}`).toString("base64")
    if (!PASS || !safeEqual(req.headers.authorization || "", expected)) {
      recordFailedAttempt(ip)
      res.writeHead(401, { "WWW-Authenticate": 'Basic realm="preview"' })
      return res.end("Authentication required")
    }

    let urlPath
    try {
      urlPath = decodeURIComponent(req.url.split("?")[0])
    } catch {
      // Malformed percent-encoding throws synchronously and, uncaught,
      // would crash this whole process (killing the site for every
      // visitor) on a single bad request - a 400 is the correct response
      // to a malformed request line, not a process crash.
      res.writeHead(400)
      return res.end("Bad request")
    }
    const base = path.resolve(ROOT, urlPath === "/" ? "index.html" : `.${urlPath}`)
    // Path-traversal guard: reject anything that resolves outside ROOT
    // (e.g. "/../render-server.js") before ever touching the filesystem.
    if (base !== ROOT && !base.startsWith(ROOT + path.sep)) {
      res.writeHead(403)
      return res.end("Forbidden")
    }
    const isFile = (p) => fs.existsSync(p) && fs.statSync(p).isFile()
    const found = [base, `${base}.html`, path.join(base, "index.html")].find(isFile)
    const filePath = found || path.join(ROOT, "404.html")

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500)
        return res.end("Server error")
      }
      res.writeHead(found ? 200 : 404, { "Content-Type": MIME[path.extname(filePath)] || "application/octet-stream" })
      res.end(data)
    })
  })
  .listen(process.env.PORT || 10000)
