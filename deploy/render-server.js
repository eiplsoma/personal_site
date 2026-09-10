// Minimal, dependency-free static file server for the Render preview
// deploy only. Serves the `out/` static export behind HTTP Basic Auth
// so a handful of people can preview the site before it's public.
// Not used by the production VPS deploy - that stays plain nginx.
const http = require("http")
const fs = require("fs")
const path = require("path")

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

http
  .createServer((req, res) => {
    const expected = "Basic " + Buffer.from(`${USER}:${PASS}`).toString("base64")
    if (!PASS || req.headers.authorization !== expected) {
      res.writeHead(401, { "WWW-Authenticate": 'Basic realm="preview"' })
      return res.end("Authentication required")
    }

    const urlPath = decodeURIComponent(req.url.split("?")[0])
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
