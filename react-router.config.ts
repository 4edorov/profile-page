import type { Config } from "@react-router/dev/config";
import { LANGUAGES } from "./src/shared/i18n";
import { notFoundPath, PAGE_IDS, pagePath } from "./src/shared/routing";

export default {
  // Static build: no runtime server. See docs/adr/0001-prerendered-spa.md.
  ssr: false,
  // The FSD app layer. See docs/adr/0004-feature-sliced-design.md.
  appDirectory: "src/app",
  routeDiscovery: { mode: "initial" },
  prerender: () => [
    ...LANGUAGES.flatMap((language) => [...PAGE_IDS.map((id) => pagePath(language, id)), notFoundPath(language)]),
    notFoundPath(),
    "/sitemap.xml",
    "/robots.txt",
  ],
} satisfies Config;
