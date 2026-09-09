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
- `/hu` — Hungarian translation of `/site`.
- `content/cv.en.json` / `content/cv.hu.json` — the CV content that both the
  terminal and the regular site render from.

## Deploy

`.github/workflows/deploy.yml` builds the static export, packages it into an
`nginx:alpine` image, pushes it to GHCR, then deploys to a self-hosted VPS
over a Cloudflare Tunnel (no port 22 exposed, SSH-key-only auth on a
dedicated tunnel hostname with no Cloudflare Access application attached).
Deploy secrets are scoped to a GitHub `environment`, not the whole repo.

## Local development

```
pnpm install
pnpm dev
```

```
pnpm build
```

produces the static export in `out/`.
