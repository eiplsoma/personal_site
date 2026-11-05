# personal-site

Source for [eiplsoma.hu](https://eiplsoma.hu), a personal portfolio site.

## Stack

- Next.js (App Router, `output: 'export'` — fully static, no server runtime)
- TypeScript, React
- xterm.js for the interactive terminal page (`/terminal`)
- HU/EN i18n via a static route tree (English unprefixed, Hungarian under `/hu`)

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
self-hosted VPS over a Cloudflare Tunnel (no port 22 exposed, SSH-key-only
auth on a dedicated tunnel hostname with no Cloudflare Access application
attached) and restarts the container there. Deploy secrets are scoped to a
GitHub `environment`, not the whole repo. `.github/workflows/ghcr-cleanup.yml`
prunes old image versions on a weekly schedule.

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

produces the static export in `out/`.
