import type { Config } from "@react-router/dev/config";
import { LANGUAGES } from "./src/shared/i18n";
import { notFoundPath, PAGE_IDS, pagePath } from "./src/shared/routing";

export default {
  ssr: false,
  appDirectory: "src/app",
  routeDiscovery: { mode: "initial" },
  prerender: () => [
    ...LANGUAGES.flatMap((language) => [...PAGE_IDS.map((id) => pagePath(language, id)), notFoundPath(language)]),
    notFoundPath(),
    "/sitemap.xml",
    "/robots.txt",
  ],
} satisfies Config;
