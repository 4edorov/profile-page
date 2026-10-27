// Relative, not `@/`: react-router.config.ts loads this file with its own resolver, which ignores the alias.
import { languageInPath, type Language } from "../i18n";
import { PAGE_PATHS, type PageId } from "./pages";

/** Canonical path of a Page in a Language: `/en/` for the Home Page, `/en/projects` otherwise. */
export function pagePath(language: Language, pageId: PageId): string {
  const path = PAGE_PATHS[pageId];
  return path ? `/${language}/${path}` : `/${language}/`;
}

/** Where the Not Found Page for a Language is prerendered; without a Language, the top-level one. */
export function notFoundPath(language?: Language): string {
  return language ? `/${language}/404` : "/404";
}

/**
 * Same Page in another Language: swaps the leading `/:lang` segment. Outside
 * any Language (the top-level 404) there is no same Page, so it is that
 * Language's Home Page.
 */
export function switchLanguagePath(pathname: string, language: Language): string {
  if (!languageInPath(pathname)) {
    return pagePath(language, "home");
  }
  return pathname.replace(/^\/[^/]+/, `/${language}`);
}

export function absoluteUrl(path: string): string {
  return `${import.meta.env.SITE_URL}${path}`;
}
