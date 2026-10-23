/**
 * The single list of Pages, excluding the Not Found Page. Routes (`routes.ts`),
 * prerendering (`react-router.config.ts`) and the sitemap are all derived from it.
 */
export const PAGES = [{ id: "home", path: "", file: "../pages/home/ui/page.tsx" }] as const satisfies readonly Page[];

export interface Page {
  id: string;
  /** Path below the Language prefix; `""` is the Language root. */
  path: string;
  /** Route module inside the Page's slice, relative to `src/app/`. */
  file: string;
}
