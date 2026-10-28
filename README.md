# profile-page

A professional Profile Site. It's an SPA built with React 19, React Router 8 and TypeScript, and every Page is prerendered to static HTML at build time. It's served by nginx on a self-hosted server. Domain terms are defined in [GLOSSARY.md](GLOSSARY.md), and architectural decisions are recorded in [docs/adr/](docs/adr/).

## Stack

- **React Router 8 framework mode** with `ssr: false` and `prerender`: static HTML for every Page in every Language. See [ADR-0001](docs/adr/0001-prerendered-spa.md).
- **Language in the URL path**. See [ADR-0002](docs/adr/0002-language-in-url-path.md).
- **react-i18next** for UI Strings, with bundled and typed resources.
- **Tailwind CSS 4**, limited to three colors per Theme (Background, Text, Primary) in `src/app/app.css`. Every visit starts in Light, whatever the system setting. The Header switches the Theme, and the choice is never stored.
- **Vite 8**, **Vitest**, **ESLint** (typescript-eslint, react-hooks, jsx-a11y) and **Prettier**.
- **Self-hosted nginx**, deployed manually over SSH. See [ADR-0003](docs/adr/0003-self-hosted-manual-deploy.md).

## Development

Requires Node 24 (`nvm use`) and pnpm 10.

```sh
pnpm install
pnpm dev          # http://localhost:5173/en/
pnpm check        # lint + typecheck + test
SITE_URL=https://example.com pnpm build   # writes build/client/
```

`SITE_URL` is the public origin. It's used for canonical URLs, `hreflang` links, Open Graph tags and the sitemap. A build fails without it. Set it in a committed `.env.production` file (`SITE_URL=https://your.domain`) so builds and deploys pick it up automatically.

## Layout

Code under `src/` follows Feature-Sliced Design. See [ADR-0004](docs/adr/0004-feature-sliced-design.md).

| Path                             | What                                                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `src/shared/routing/pages.ts`    | Every Page's path, in Header order. Routes, prerendering, the sitemap and the Header are derived from it.          |
| `src/app/routes.ts`              | One route tree per Language, plus a top-level 404.                                                                 |
| `src/app/layouts/frame.tsx`      | Every Page's frame: the Header, the Page and the Footer in a 1280px column.                                        |
| `src/pages/<page>/ui/page.tsx`   | Each Page's route module: `loader`, `meta` and component. `<page>` is its key in `PAGE_PATHS`, except `not-found`. |
| `src/shared/i18n/locales/*.json` | UI Strings.                                                                                                        |
| `content/{en,ru}/<topic>.json`   | Profile Content, one file per Topic. Its types live in `src/entities/profile`.                                     |
| `deploy/nginx/`                  | nginx site config and shared snippet.                                                                              |
| `scripts/deploy.sh`              | Build and deploy over SSH.                                                                                         |

### Adding a Page

1. Create `src/pages/<page>/ui/page.tsx` with a `loader` (runs at build time), `meta` (use `pageMeta` from `@/shared/seo`) and a component, typed with `PageProps<typeof loader>`.
2. Add its path to `PAGE_PATHS` in `src/shared/routing/pages.ts`, keyed by the slice's name. Routes, prerendering, the sitemap and the Header pick it up from there.
3. Add its UI Strings to both `src/shared/i18n/locales/*.json`, and any Profile Content to both `content/*/`.

### Both Languages must always be complete

A UI String key that's missing from `ru.json` is a type error. Profile Content files, ids and shapes must match across Languages, and `tests/*-parity.test.ts` checks this. Either failure blocks `pnpm check`, and therefore blocks deploy.

## Server setup (once)

1. Copy `deploy/nginx/profile-site-pages.conf` to `/etc/nginx/snippets/profile-site-pages.conf`.
2. Copy `deploy/nginx/profile-site.conf` into your nginx sites (for example `/etc/nginx/sites-available/`, then symlink it into `sites-enabled/`). Replace `profile.example.com` with your domain and `/var/www/profile-site` with your web root.
3. Add TLS your usual way (for example `certbot --nginx -d your.domain`), then run `nginx -t && systemctl reload nginx`.
4. Make sure the deploy user can write to the web root over SSH, and that the server has `rsync` installed.

The nginx config handles:

- the `/` redirect by `Accept-Language`
- the trailing-slash rules (`/en` → `/en/` and `/en/x/` → `/en/x`)
- the 404 page for each Language
- long-term caching of `/assets/*`, with `no-cache` for HTML

## Deploy

```sh
cp .env.deploy.example .env.deploy   # once; gitignored
pnpm run deploy --dry-run            # see what would change
pnpm run deploy
```

The deploy script:

- refuses to run with uncommitted changes
- runs `pnpm check` and the build
- rsyncs `build/client/` in place over SSH in three passes (new assets, then pages, then removal of stale files)
- writes the deployed commit to `/VERSION`

To roll back, check out an earlier commit and deploy again.
