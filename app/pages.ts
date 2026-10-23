import type { Language } from "./languages";

/**
 * The single list of Pages. Routes (`app/routes.ts`), prerendering
 * (`react-router.config.ts`) and the sitemap are all derived from it.
 */
export const PAGES = [{ id: "home", path: "", file: "routes/home.tsx" }] as const satisfies readonly Page[];

export interface Page {
  id: string;
  /** Path below the Language prefix; `""` is the Language root. */
  path: string;
  /** Route module, relative to `app/`. */
  file: string;
}

/** Canonical path: `/en/` for the Language root, `/en/projects` otherwise. */
export function pagePath(language: Language, page: Pick<Page, "path">): string {
  return page.path ? `/${language}/${page.path}` : `/${language}/`;
}

/** Where the 404 for a Language is prerendered; without a Language, the top-level one. */
export function notFoundPath(language?: Language): string {
  return language ? `/${language}/404` : "/404";
}

/** Same Page in another Language: swaps the leading `/:lang` segment. */
export function switchLanguagePath(pathname: string, language: Language): string {
  return pathname.replace(/^\/[^/]+/, `/${language}`);
}

export function absoluteUrl(path: string): string {
  return `${import.meta.env.SITE_URL}${path}`;
}
