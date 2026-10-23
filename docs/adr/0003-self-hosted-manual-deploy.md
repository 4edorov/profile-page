# Self-hosted nginx, deployed manually over SSH, no CI

The Profile Site is served by nginx on the owner's own server with a custom domain, and deployed by running `pnpm run deploy` locally: it refuses to run with uncommitted changes, runs lint, typecheck, tests and the build, then rsyncs the build in place over SSH. There is no CI, so those local checks are the only gate. The nginx config is versioned in `deploy/nginx/` but installed by hand, so a routine deploy can never break the server config.

## Considered Options

- **Atomic releases** (upload to `releases/<timestamp>`, swap a `current` symlink): rejected as more machinery than a personal site needs. The in-place rsync instead runs in three passes (new hashed assets, then HTML and data, then delete stale files) so visitors mid-deploy never get HTML referencing missing assets.
- **GitHub Pages / Netlify / Cloudflare Pages**: rejected in favour of the owner's existing server. Owning nginx also gives the server-side `Accept-Language` redirect and per-Language 404s.

## Consequences

Rollback means checking out an earlier commit and deploying again. `/VERSION` on the live site shows the commit that is deployed.
