# personal-site

Source for [eiplsoma.hu](https://eiplsoma.hu), a personal portfolio site.

## Stack

- Next.js (App Router, `output: 'export'` — fully static, no server runtime)
- TypeScript, React
- xterm.js for the interactive terminal landing page
- HU/EN i18n via a static route tree (English unprefixed, Hungarian under `/hu`)

## Structure

- `/` — an interactive terminal (xterm.js) with a small set of Unix-like
  commands (`ls`, `cat`, `cd`, `whoami`, `pwd`, `history`) for exploring the
  CV content and jumping to the rest of the site.
- `/site` — the regular, non-terminal version of the site.
- `/concept` — an alternate, "system status dashboard"-styled landing view.
- `/projects` — standalone project write-ups.
- `/cv-tool` — a client-side CV builder/editor (localStorage-backed, no
  server): JSON import/export, an AI-translation round-trip (copy a prompt
  out, paste the translated JSON back in), and print-to-PDF via the
  browser's print dialog — separate from the main portfolio content.
- `/hu` — Hungarian translation of `/site`, `/concept`, `/projects`.
- `content/cv.en.json` / `content/cv.hu.json` — the CV content that both the
  terminal and the regular site render from.

## Deploy

`.github/workflows/deploy.yml` runs `lint` (ESLint) → `build-and-push` →
`deploy`. `build-and-push` builds the static export, packages it into an
`nginx:alpine` image, and pushes it to GHCR; `deploy` connects to a
self-hosted VPS over a Cloudflare Tunnel (no port 22 exposed, SSH-key-only
auth on a dedicated tunnel hostname with no Cloudflare Access application
attached) and restarts the container there. Deploy secrets are scoped to a
GitHub `environment`, not the whole repo. `.github/workflows/ghcr-cleanup.yml`
prunes old image versions on a weekly schedule. Dependabot watches `docker`,
`npm`, and `github-actions` dependencies.

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
