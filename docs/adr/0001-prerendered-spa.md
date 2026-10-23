# Prerendered SPA: React Router with `ssr: false` plus `prerender`

The Profile Site is a static build with no runtime server, but every Page in every Language (and each 404) is prerendered to its own HTML file at build time and then hydrated as an SPA. A plain client-only SPA would serve the same `index.html` for every URL, which breaks link previews (LinkedIn, Telegram read Open Graph tags from the HTML), weakens SEO for recruiters searching the owner's name, and needs host-side rewrites for deep links. Runtime SSR would need a Node server we don't want to run. Loaders therefore run only at build time; their results are baked into the HTML and `.data` files.

## Consequences

- Prerendering only accepts 200 responses, so a 404 is an ordinary Page prerendered at `/404`, `/en/404`, `/ru/404`, and nginx returns it with a 404 status.
- Prerendered HTML must hydrate against the same routes it was rendered with, even when nginx serves it for another URL. That is why routes are static per Language (see ADR-0002).
