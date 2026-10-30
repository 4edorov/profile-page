export const LANGUAGES = ["en", "ru"] as const;

export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = "en";

export const LANGUAGE_NAMES: Record<Language, string> = {
  en: "English",
  ru: "Русский",
};

export const OG_LOCALES: Record<Language, string> = {
  en: "en_US",
  ru: "ru_RU",
};

export function isLanguage(value: unknown): value is Language {
  return LANGUAGES.includes(value as Language);
}

export function languageInPath(pathname: string): Language | undefined {
  const segment = pathname.split("/")[1];
  return isLanguage(segment) ? segment : undefined;
}

export function languageFromPath(pathname: string): Language {
  return languageInPath(pathname) ?? DEFAULT_LANGUAGE;
}

export function languageFromRequest(request: Request): Language {
  return languageFromPath(new URL(request.url).pathname);
}
