export const LANGUAGES = ["en", "ru"] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";

/** Each Language's name written in that Language, for the switcher. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  ru: "Русский",
};

/** Open Graph `og:locale` value per Language. */
export const OG_LOCALES: Record<Language, string> = {
  en: "en_US",
  ru: "ru_RU",
};

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}

/**
 * The Language of a URL is its first path segment; anything else (only
 * possible outside the Language routes, e.g. the top-level 404) is the
 * Default Language.
 */
export function languageFromPath(pathname: string): Language {
  const segment = pathname.split("/")[1];
  return isLanguage(segment) ? segment : DEFAULT_LANGUAGE;
}
