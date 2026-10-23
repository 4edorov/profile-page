import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { Language } from "@/shared/i18n";
import { pagePath } from "@/shared/routing";
import { LanguageSwitcher } from "./language-switcher";

export function Header({ language }: { language: Language }) {
  const { t } = useTranslation();
  return (
    <header className="mx-auto flex max-w-2xl items-center justify-between p-8 pb-0">
      <Link to={pagePath(language, "")} className="font-semibold">
        {t("nav.home")}
      </Link>
      <LanguageSwitcher current={language} />
    </header>
  );
}
