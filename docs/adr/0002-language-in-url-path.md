# The Language lives in the URL path, and nowhere else

Every Page URL starts with its Language (`/en/...`, `/ru/...`), and that path segment is the only source of truth for the current Language: no browser detection, cookie or `localStorage` inside the app. Shared links then always open in the Language they were shared in, each Language gets its own prerendered HTML with correct `hreflang` alternates, and the language switcher is just a link. Detecting the Language happens in exactly one place, nginx's redirect from `/` based on `Accept-Language`.

## Consequences

- Routes are generated as one static tree per Language rather than a `:lang` param. With a param, an unknown first segment (`/foo`, `/de/projects`) would match Page routes, and the 404 HTML nginx serves there would hydrate against different routes than it was prerendered with. With static trees, every unknown URL matches the same catch-all as its 404 page. As a side effect, switching Language always loads fresh Page data, because it moves to different routes.
- Code reads the Language from the URL (`languageFromPath`, `languageFromRequest`, `useLanguage`), never from route params.
