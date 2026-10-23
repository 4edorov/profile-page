import type { Config } from "@react-router/dev/config";
import { PAGES } from "./src/app/pages";
import { LANGUAGES } from "./src/shared/i18n";
import { notFoundPath, pagePath } from "./src/shared/routing";

export default {
  // Static build: no runtime server. See docs/adr/0001-prerendered-spa.md.
  ssr: false,
  // The FSD app layer. See docs/adr/0004-feature-sliced-design.md.
  appDirectory: "src/app",
  routeDiscovery: { mode: "initial" },
  prerender: () => [
    ...LANGUAGES.flatMap((language) => [...PAGES.map((page) => pagePath(language, page.path)), notFoundPath(language)]),
    notFoundPath(),
    "/sitemap.xml",
    "/robots.txt",
  ],
} satisfies Config;
