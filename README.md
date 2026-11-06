# profile-page

A professional Profile Site. It's an SPA built with React 19, React Router 8 and TypeScript, and every Page is prerendered to static HTML at build time. It's served by nginx on a self-hosted server. Domain terms are defined in [GLOSSARY.md](GLOSSARY.md), and architectural decisions are recorded in [docs/adr/](docs/adr/).

## Stack

- **React Router 8 framework mode** with `ssr: false` and `prerender`: static HTML for every Page in every Language. See [ADR-0001](docs/adr/0001-prerendered-spa.md).
- **Language in the URL path**. See [ADR-0002](docs/adr/0002-language-in-url-path.md).
- **react-i18next** for UI Strings, with bundled and typed resources.
- **Tailwind CSS 4**, limited to four colors per Theme (Background, Surface, Text, Primary), plus the green of the Open to Work light, in `src/app/app.css`. Every visit starts in Light, whatever the system setting. The Header switches the Theme, and the choice is never stored.
- **Vite 8**, **Vitest**, **ESLint** (type-aware typescript-eslint, react-hooks, jsx-a11y), **Prettier**, **Steiger** and **knip**.
- **Self-hosted nginx**, deployed manually over SSH, one tagged Version at a time. See [ADR-0003](docs/adr/0003-self-hosted-manual-deploy.md).

## Development

Requires Node 24 (`nvm use`) and pnpm 10.

```sh
pnpm install
pnpm dev          # http://localhost:5173/en/
pnpm check        # lint + typecheck + test
SITE_URL=https://example.com pnpm build   # writes build/client/
```

`SITE_URL` is the public origin. It's used for canonical URLs, `hreflang` links, Open Graph tags and the sitemap. A build fails without it. Set it in a committed `.env.production` file (`SITE_URL=https://your.domain`) so builds and deploys pick it up automatically.

`pnpm install` also installs a Husky pre-commit hook that runs `pnpm check` on the working tree and blocks the commit if it fails. It only checks; run `pnpm format` to fix formatting. `git commit --no-verify` skips it, but `pnpm run deploy` runs `pnpm check` itself, so deploy stays the gate.

`pnpm install` also installs a pre-push hook that rejects a branch changing more than 500 lines (added + removed) since it branched from `origin/main`, with `pnpm-lock.yaml` excluded, so every PR stays reviewable. Split bigger work into sequential PRs; `git push --no-verify` is the owner's override.

### Updating dependencies

Dependencies are updated once a month, by the owner or an agent. At 09:00 on the 1st, a scheduled Claude Code routine opens an "Update dependencies (YYYY-MM)" issue labelled `ready-for-agent`. Work it on a `<n>-update-deps` branch like any other issue.

1. Run `pnpm outdated` and `pnpm audit`. If both are clean, close the issue with their output as a comment, with no PR.
2. Run `pnpm update -i --latest` and select the patch and minor updates. Range operators are kept, so `typescript` stays on `~`: its minors can break.
   - `@types/node` follows the Node major in `engines`, not the latest.
   - Take pnpm's minor and patch updates in `packageManager`, and Node's patches with `nvm install`. Node and pnpm majors get their own issue, since they move `engines`, `.nvmrc`, `@types/node` and this README together.
3. Give each major its own PR. If its ecosystem isn't ready (say, typescript-eslint doesn't support it yet), open a standing `ready-for-human` issue such as "Upgrade to TypeScript 7", and comment on it each month with what still blocks it.
4. Fix every high or critical `pnpm audit` finding, dev-only ones included, since dev tools run on the machine that deploys. Update the package that pulls it in, or, if that has no fix yet, add a `pnpm.overrides` entry until it does. Lower severities can wait for a fix.
5. Remove every `pnpm.peerDependencyRules`, `pnpm.packageExtensions` and `pnpm.overrides` entry that's no longer needed: a stale one hides the next real conflict.
6. Run `pnpm check`. If a package that reaches the build changed (any `dependencies` entry, or a build tool such as Vite, Tailwind or `@react-router/dev`), also build, run `pnpm preview`, and check a Page in both Languages and both Themes, and the Technology Cloud.
7. Open the PR. Once it's merged, if a package that reaches the build changed, cut a patch Version (see "Cutting a Version") for the owner to deploy.

An agent stops, comments on the issue and relabels it `ready-for-human` when a high or critical finding has no fix or safe override, when a major needs code changes or would take the branch over 500 lines, or when verification fails for an unclear reason.

There's no dependency-update bot (Dependabot version updates or Renovate). With no CI (see [ADR-0003](docs/adr/0003-self-hosted-manual-deploy.md)), its PRs would arrive with no checks run, and each would still have to be checked out and tested locally. GitHub's Dependabot alerts, which only notify, cover security advisories between runs. Neither `pnpm outdated` nor `pnpm audit` is part of `pnpm check`: both need the network, and the hook has to stay fast and work offline.

## Layout

Code under `src/` follows Feature-Sliced Design. See [ADR-0004](docs/adr/0004-feature-sliced-design.md).

| Path                                              | What                                                                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `src/shared/routing/pages.ts`                     | Every Page's path, in Header order. Routes, prerendering, the sitemap and the Header are derived from it.                             |
| `src/app/routes.ts`                               | One route tree per Language, plus a top-level 404.                                                                                    |
| `src/app/layouts/frame.tsx`                       | Every Page's frame: the Header, the Page and the Footer in a 1280px column.                                                           |
| `src/pages/<page>/ui/page.tsx`                    | Each Page's route module: `loader`, `meta` and component. `<page>` is its key in `PAGE_PATHS`, except `not-found`.                    |
| `src/shared/i18n/locales/*.json`                  | UI Strings.                                                                                                                           |
| `content/{en,ru}/<topic>.json`                    | Profile Content, one file per Topic. Its types live in `src/entities/profile`.                                                        |
| `content/technologies.json`                       | The Technologies, written once for every Language; `stack` marks the Stack.                                                           |
| `content/portrait.jpg`                            | The Portrait, written once for every Language: a JPEG at least 768×1024; the About Page shows its 3:4 middle.                         |
| `src/shared/seo/preview-image.jpg`                | The Preview Image, the same for every Page and Language: a 1200×630 JPEG of at most 300 KB, without text.                             |
| `public/favicon.*`, `public/apple-touch-icon.png` | The favicon as SVG, and drawn from it once: a 32×32 + 48×48 ICO and a 180×180 square PNG for iOS. Redraw both after changing the SVG. |
| `CHANGELOG.md`                                    | What changed on the live site, one section per Version.                                                                               |
| `deploy/nginx/`                                   | nginx site config and shared snippet.                                                                                                 |
| `scripts/deploy.sh`                               | Build and deploy over SSH.                                                                                                            |

### Adding a Page

1. Create `src/pages/<page>/ui/page.tsx` with a `loader` (runs at build time), `meta` (use `pageMeta` from `@/shared/seo`) and a component, typed with `PageProps<typeof loader>`. Add `src/pages/<page>/index.ts` with only `export {};`: Steiger requires every slice to have a public API, but `src/app/routes.ts` points at the route module by path, so nothing is imported through it.
2. Add its path to `PAGE_PATHS` in `src/shared/routing/pages.ts`, keyed by the slice's name. Routes, prerendering, the sitemap and the Header pick it up from there.
3. Add its UI Strings to both `src/shared/i18n/locales/*.json`, and any Profile Content to both `content/*/`.
4. Use `src/shared/ui` for headings, muted text, links and icon buttons rather than hand-written Tailwind classes.

### Both Languages must always be complete

A UI String key that's missing from `ru.json` is a type error. Profile Content files, ids and shapes must match across Languages (only the number of Accents in the tagline and the query of a Contact link's URL, such as LinkedIn's `?locale=`, may differ), and `tests/*-parity.test.ts` checks this. Either failure blocks `pnpm check`, and therefore blocks deploy.

## Server setup (once)

1. Copy `deploy/nginx/profile-site-pages.conf` to `/etc/nginx/snippets/profile-site-pages.conf`.
2. Copy `deploy/nginx/profile-site.conf` into your nginx sites (for example `/etc/nginx/sites-available/`, then symlink it into `sites-enabled/`). It serves `4edorov.com` from `/var/www/profile-site` (must match `DEPLOY_PATH`), redirects `www` and http to `https://4edorov.com`, and uses the existing Certbot certificate in `/etc/letsencrypt/live/4edorov.com/`.
3. Disable the old site (`rm /etc/nginx/sites-enabled/4edorov.com`) so its server names don't conflict, then run `nginx -t && systemctl reload nginx` and `certbot renew --dry-run`.
4. Create the web root, owned by the deploy user (`sudo install -d -o <user> -g <user> -m 755 /var/www/profile-site`), and make sure the server has `rsync` installed.

The nginx config handles:

- the `/` redirect by `Accept-Language`
- the trailing-slash rules (`/en` → `/en/` and `/en/x/` → `/en/x`)
- the 404 page for each Language
- a 404 for `/index.html`, React Router's SPA fallback, which no Page uses
- long-term caching of `/assets/*`, with `no-cache` for HTML
- `X-Robots-Tag: noindex` on the `.data` files client navigation fetches, so search engines index only Pages

## Cutting a Version

Every deploy is of a Version, numbered major.minor.patch as **Version** in [GLOSSARY.md](GLOSSARY.md) defines. A Version is cut in a release PR and tagged on `main` by the owner:

1. On a `<n>-release-<version>` branch, run `pnpm version <version> --no-git-tag-version`, which sets `version` in `package.json` without committing or tagging.
2. In `CHANGELOG.md`, add a `## [<version>] - YYYY-MM-DD` section dated the day the owner will tag it, and its link at the bottom. Write it from the PRs merged since the last tag (`git log --merges --oneline "$(git describe --tags --abbrev=0)"..origin/main`), in [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) groups, in English, for a visitor: leave out changes that only touch tooling, hooks or tests.
3. Open the PR. Once it's merged, the owner tags the merge commit and deploys:

```sh
git switch main && git pull
git tag -a v1.0.0 -m "1.0.0"
git push origin v1.0.0
pnpm run deploy
```

The tag goes on `main`'s merge commit, not the release branch's commit, because the deploy script deploys only a HEAD that carries the tag.

## Deploy

```sh
cp .env.deploy.example .env.deploy   # once; gitignored
pnpm run deploy --dry-run            # see what would change
pnpm run deploy
```

The deploy script:

- refuses to run with uncommitted changes, or unless HEAD carries the tag `v<version>` from `package.json` and that tag is on `origin`
- refuses to run unless the server has `rsync` and the deploy user can write to `DEPLOY_PATH`
- runs `pnpm check` and the build
- rsyncs `build/client/` in place over SSH in three passes (new assets, then pages, then removal of stale files)
- writes the deployed Version and its commit to `/VERSION`

To roll back, check out an earlier Version's tag (`git checkout v1.0.0`) and deploy again.
