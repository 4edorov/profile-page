import { index, route, type RouteConfig } from "@react-router/dev/routes";
import { LANGUAGES } from "./languages";
import { PAGES } from "./pages";

// One static route tree per Language instead of a `:lang` param, so a URL
// with an unknown Language never matches Page routes. Every unknown URL then
// hydrates against the same routes as the 404 HTML nginx serves for it.
export default [
  route("sitemap.xml", "routes/sitemap.ts"),
  route("robots.txt", "routes/robots.ts"),
  ...LANGUAGES.map((language) =>
    route(language, "routes/language.tsx", { id: language }, [
      ...PAGES.map((page) =>
        page.path
          ? route(page.path, page.file, { id: `${language}/${page.id}` })
          : index(page.file, { id: `${language}/${page.id}` }),
      ),
      // Also prerendered as `/<language>/404`.
      route("*", "routes/not-found.tsx", { id: `${language}/not-found` }),
    ]),
  ),
  // Everything outside the Language routes; prerendered as `/404`.
  route("*", "routes/not-found.tsx", { id: "not-found" }),
] satisfies RouteConfig;
