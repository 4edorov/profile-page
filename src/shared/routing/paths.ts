// Relative, not `@/`: react-router.config.ts loads this file with its own resolver, which ignores the alias.
import { languageInPath, type Language } from "../i18n";
import { PAGE_PATHS, type PageId } from "./pages";

export function pagePath(language: Language, pageId: PageId): string {
  const path = PAGE_PATHS[pageId];
  return path ? `/${language}/${path}` : `/${language}/`;
}

export function notFoundPath(language?: Language): string {
  return language ? `/${language}/404` : "/404";
}

export function switchLanguagePath(pathname: string, language: Language): string {
  if (!languageInPath(pathname)) {
    return pagePath(language, "home");
  }
  return pathname.replace(/^\/[^/]+/, `/${language}`);
}

export function absoluteUrl(path: string): string {
  return `${import.meta.env.SITE_URL}${path}`;
}
