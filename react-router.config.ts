import type { Config } from "@react-router/dev/config";
import { LANGUAGES } from "./app/languages";
import { notFoundPath, PAGES, pagePath } from "./app/pages";

export default {
  // Static build: no runtime server. See docs/adr/0001-prerendered-spa.md.
  ssr: false,
  routeDiscovery: { mode: "initial" },
  prerender: () => [
    ...LANGUAGES.flatMap((language) => [...PAGES.map((page) => pagePath(language, page)), notFoundPath(language)]),
    notFoundPath(),
    "/sitemap.xml",
    "/robots.txt",
  ],
} satisfies Config;
