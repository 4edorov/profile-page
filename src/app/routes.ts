import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";
// Relative, not `@/`: React Router loads this file with its own resolver, which ignores the alias.
import { LANGUAGES } from "../shared/i18n";
import { PAGE_IDS, PAGE_PATHS } from "../shared/routing/pages";

const NOT_FOUND_PAGE = "../pages/not-found/ui/page.tsx";

// A tree per Language, not a `:lang` param, so an unknown URL hydrates against the same routes as the 404 HTML nginx serves.
export default [
  route("sitemap.xml", "routes/sitemap.ts"),
  route("robots.txt", "routes/robots.ts"),
  ...LANGUAGES.map((language) =>
    route(language, "routes/language.tsx", { id: language }, [
      ...PAGE_IDS.map((id) => {
        const file = `../pages/${id}/ui/page.tsx`;
        const path = PAGE_PATHS[id];
        const options = { id: `${language}/${id}` };
        return path ? route(path, file, options) : index(file, options);
      }),
      route("*", NOT_FOUND_PAGE, { id: `${language}/not-found` }),
    ]),
  ),
  layout("routes/language.tsx", { id: "outside-language" }, [route("*", NOT_FOUND_PAGE, { id: "not-found" })]),
] satisfies RouteConfig;
