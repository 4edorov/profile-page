// Relative, not `@/`: React Router loads this file with its own resolver, which ignores the alias.
import { PAGE_IDS, PAGE_PATHS, type PageId } from "../shared/routing/pages";

/** Route module of each Page inside its slice, relative to `src/app/`. */
const PAGE_FILES: Record<PageId, string> = {
  home: "../pages/home/ui/page.tsx",
  about: "../pages/about/ui/page.tsx",
  experience: "../pages/experience/ui/page.tsx",
  projects: "../pages/projects/ui/page.tsx",
  learning: "../pages/learning/ui/page.tsx",
  resume: "../pages/resume/ui/page.tsx",
};

/**
 * The single list of Pages, excluding the Not Found Page. Routes (`routes.ts`),
 * prerendering (`react-router.config.ts`) and the sitemap are all derived from it.
 */
export const PAGES: readonly Page[] = PAGE_IDS.map((id) => ({ id, path: PAGE_PATHS[id], file: PAGE_FILES[id] }));

export interface Page {
  id: PageId;
  /** Path below the Language prefix; `""` is the Language root. */
  path: string;
  /** Route module inside the Page's slice, relative to `src/app/`. */
  file: string;
}
