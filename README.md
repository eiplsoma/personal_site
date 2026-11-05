# personal-site

Source for [eiplsoma.hu](https://eiplsoma.hu), a personal portfolio site.

## Stack

- Next.js (App Router, `output: 'export'` — fully static, no server runtime)
- TypeScript, React
- xterm.js for the interactive terminal page (`/terminal`)
- HU/EN i18n via a static route tree (English unprefixed, Hungarian under `/hu`)
- IBM Plex fonts, self-hosted at build time via `next/font` (no requests to
  third-party font servers at runtime)

## Structure

- `/` — the regular site: about, background, skills, work and principles.
- `/terminal` — an interactive terminal (xterm.js) with a small set of
  Unix-like commands (`ls`, `cat`, `cd`, `whoami`, `pwd`, `history`) for
  exploring the CV content and jumping to the rest of the site.
- `/site` — the former address of the regular site; nginx answers it with a
  permanent (301) redirect to `/`.
- `/concept` — an alternate, "system status dashboard"-styled landing view.
- `/projects` — standalone project write-ups.
- `/cv-tool` — a client-side CV builder/editor (localStorage-backed, no
  server): JSON import/export, an AI-translation round-trip (copy a prompt
  out, paste the translated JSON back in), and print-to-PDF via the
  browser's print dialog — separate from the main portfolio content.
- `/hu` — Hungarian translation of `/`, `/concept`, `/projects`
  (`/hu/concept`, `/hu/projects`), with `hreflang` alternates (including
  `x-default`) linking the language versions.
- `/sitemap.xml` — generated at build time from the route list in
  `app/sitemap.ts`.
- `content/cv.en.json` / `content/cv.hu.json` — the CV content that both the
  terminal and the regular site render from.

## CI

`.github/workflows/ci.yml` runs on every pull request to `main`: ESLint plus
a TypeScript typecheck (`Lint & typecheck`) and a production build of the
static export (`Build static export`). `main` is protected by a repository
ruleset: changes land through a pull request, both checks must pass, and
merges are squash-only.

Dependabot (`docker`, `npm`, `github-actions`, weekly) opens the dependency
PRs. `.github/workflows/dependabot-automerge.yml` turns on GitHub auto-merge
for the patch and minor ones, which then merge only after the required
checks pass; major version bumps are left for manual review.

## Deploy

`.github/workflows/deploy.yml`, on every push to `main`, runs `lint` (ESLint) → `build-and-push` →
`deploy`. `build-and-push` builds the static export, packages it into an
`nginx:alpine` image, and pushes it to GHCR; `deploy` connects to a
self-hosted VPS over a Cloudflare Tunnel with key-based authentication and
restarts the container there. Deploy secrets are scoped to a
GitHub `environment`, not the whole repo. `.github/workflows/ghcr-cleanup.yml`
prunes old image versions on a weekly schedule.

The image's nginx config (`deploy/nginx.conf`) also sets a baseline of
security response headers (`deploy/security-headers.conf`) on every response
and tells browsers to revalidate HTML and other unhashed files on each use
(`Cache-Control: no-cache`; HTML also carries `no-transform` so it is delivered
exactly as built), while the content-hashed `_next/static` files are
cached as immutable. `nginx -t` runs during the image build, so an invalid
config fails the build rather than the running container.

A static export has no server to mint per-request nonces, so a
Content-Security-Policy is generated per page at build time:
`scripts/generate-csp.mjs` runs after `next build`, hashes every inline
script in each page and writes one nginx `location` per page
(`deploy/generated/`, not committed). Inline scripts are allowed only by
hash, so scripts need no `'unsafe-inline'`. The policy is enforced;
`CSP_MODE=report-only` switches the build to report-only for debugging.

`render.yaml` + `deploy/render-server.js` is a separate, password-gated
preview deploy on Render (free tier) — for sharing the site pre-public,
independent of the production VPS path.

## Local development

```
pnpm install
pnpm dev
```

```
pnpm build
```

produces the static export in `out/` and generates the nginx CSP config
(`pnpm build` is needed before building the Docker image).
