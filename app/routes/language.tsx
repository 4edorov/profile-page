import { I18nextProvider, useTranslation } from "react-i18next";
import { Link, Outlet } from "react-router";
import { LanguageSwitcher } from "../components/language-switcher";
import { getI18n } from "../i18n";
import type { Language } from "../languages";
import { pagePath } from "../pages";
import { useLanguage } from "../use-language";

/** Layout for every Page in one Language. */
export default function LanguageLayout() {
  const language = useLanguage();
  return (
    <I18nextProvider i18n={getI18n(language)}>
      <Header language={language} />
      <Outlet />
    </I18nextProvider>
  );
}

function Header({ language }: { language: Language }) {
  const { t } = useTranslation();
  return (
    <header className="mx-auto flex max-w-2xl items-center justify-between p-8 pb-0">
      <Link to={pagePath(language, { path: "" })} className="font-semibold">
        {t("nav.home")}
      </Link>
      <LanguageSwitcher current={language} />
    </header>
  );
}
