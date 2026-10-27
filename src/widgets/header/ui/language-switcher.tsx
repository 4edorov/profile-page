import { Link, useLocation } from "react-router";
import { LANGUAGE_NAMES, LANGUAGES, type Language } from "@/shared/i18n";
import { switchLanguagePath } from "@/shared/routing";
import { GlobeIcon } from "./icons";

/**
 * A link to the current Page in each other Language, shown by that Language's
 * code. Its accessible name starts with that visible code, so voice control
 * finds it by what is on screen, and goes on with the full name.
 */
export function LanguageSwitcher({ current }: { current: Language }) {
  const { pathname } = useLocation();
  return LANGUAGES.filter((language) => language !== current).map((language) => (
    <Link
      key={language}
      to={switchLanguagePath(pathname, language)}
      hrefLang={language}
      lang={language}
      aria-label={`${language.toUpperCase()} ${LANGUAGE_NAMES[language]}`}
      title={LANGUAGE_NAMES[language]}
      className="flex h-10 items-center gap-1.5 rounded-md px-2 text-sm font-medium hover:text-primary"
    >
      <GlobeIcon />
      {language.toUpperCase()}
    </Link>
  ));
}
