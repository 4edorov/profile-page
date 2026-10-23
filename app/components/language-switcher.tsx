import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { LANGUAGE_NAMES, LANGUAGES, type Language } from "../languages";
import { switchLanguagePath } from "../pages";

export function LanguageSwitcher({ current }: { current: Language }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  return (
    <nav aria-label={t("nav.languageSwitcher")}>
      <ul className="flex gap-3 text-sm">
        {LANGUAGES.map((language) => (
          <li key={language}>
            {language === current ? (
              <span aria-current="true" className="font-semibold">
                {LANGUAGE_NAMES[language]}
              </span>
            ) : (
              <Link
                to={switchLanguagePath(pathname, language)}
                hrefLang={language}
                lang={language}
                className="underline-offset-4 hover:underline"
              >
                {LANGUAGE_NAMES[language]}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
