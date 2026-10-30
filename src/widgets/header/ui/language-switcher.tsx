import { Link, useLocation } from "react-router";
import { LANGUAGE_NAMES, LANGUAGES, type Language } from "@/shared/i18n";
import { switchLanguagePath } from "@/shared/routing";
import { ICON_CONTROL_LOOK } from "@/shared/ui/button";
import { GlobeIcon } from "./icons";

export function LanguageSwitcher({ current }: { current: Language }) {
  const { pathname } = useLocation();
  return LANGUAGES.filter((language) => language !== current).map((language) => (
    <Link
      key={language}
      to={switchLanguagePath(pathname, language)}
      hrefLang={language}
      lang={language}
      // Starts with the visible code, so voice control finds the link by what is on screen.
      aria-label={`${language.toUpperCase()} ${LANGUAGE_NAMES[language]}`}
      title={LANGUAGE_NAMES[language]}
      className={`${ICON_CONTROL_LOOK} gap-1.5 px-2 text-sm font-medium`}
    >
      <GlobeIcon />
      {language.toUpperCase()}
    </Link>
  ));
}
