import type { Language } from "@/shared/i18n";

/**
 * Canonical path of a Page, given its path below the Language prefix
 * (`""` is the Language root): `/en/` for the root, `/en/projects` otherwise.
 */
export function pagePath(language: Language, path: string): string {
  return path ? `/${language}/${path}` : `/${language}/`;
}

/** Where the Not Found Page for a Language is prerendered; without a Language, the top-level one. */
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
