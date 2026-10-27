# Feature-Sliced Design in `src/`, with React Router's app directory as the FSD app layer

Code is organised by Feature-Sliced Design (`app`, `pages`, `widgets`, `features`, `entities`, `shared` under `src/`) so that what each part may depend on is explicit and checkable, by people and agents alike. React Router also wants an `app/` directory, so `appDirectory` is set to `src/app`: `root.tsx` and `routes.ts` belong to the FSD app layer, and `routes.ts` points straight at each Page's route module inside its `pages/` slice, which owns that Page's `loader`, `meta` and component. The layer rules are enforced by Steiger as part of `pnpm lint`, because the local checks are the only gate (see ADR-0003).

## Considered Options

- **A root `app/` of thin route files re-exporting from `src/pages`**: rejected. It gives two different "app" folders, and Pages would have to import their generated `Route` types from the re-exporting file in a higher folder.
- **FSD layers inside today's `app/`**: rejected because it produces `app/app/`.
- **eslint-plugin-boundaries or conventions only**: rejected in favour of Steiger, which knows slices and public APIs without hand-written boundary config.

## Consequences

- `routes.ts` refers to a Page's internal file (`../pages/home/ui/page.tsx`) rather than its `index.ts`. React Router strips `loader` from the client bundle by analysing a route module's own exports, which re-exports would make fragile. Steiger only checks imports, so this path string is not a public-API violation. Each Page still has an `index.ts` for anything the app layer imports, such as the Not Found Page rendered by the root error boundary.
- React Router only generates `./+types/*` for route modules inside `appDirectory`, so Pages get no generated route types. They type `loader` with React Router's `LoaderFunctionArgs` and `meta` and the component with `PageProps<typeof loader>` from `shared/routing`. Pages use no route params, so little is lost; moving `appDirectory` to `src` would have moved `root.tsx` and `routes.ts` out of the FSD app layer.
- Language lives in `shared/i18n` despite being a domain concept, because SEO and URL helpers in `shared` depend on it and `shared` cannot import from `entities`.
- Profile Content stays as JSON in the root `content/` folder; only its types and loading code live in `entities/profile`.
