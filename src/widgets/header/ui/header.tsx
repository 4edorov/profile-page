import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import type { Language } from "@/shared/i18n";
import { PAGE_IDS, PAGE_PATHS, pagePath } from "@/shared/routing";
import { LanguageSwitcher } from "./language-switcher";

export function Header({ language }: { language: Language }) {
  const { t } = useTranslation();
  return (
    <header className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-4 p-8 pb-0">
      <nav aria-label={t("nav.pages")}>
        <ul className="flex flex-wrap gap-x-4 gap-y-1">
          {PAGE_IDS.map((id) => (
            <li key={id}>
              <NavLink
                to={pagePath(language, PAGE_PATHS[id])}
                end
                className="underline-offset-4 hover:underline aria-[current=page]:font-semibold"
              >
                {t(`pages.${id}`)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <LanguageSwitcher current={language} />
    </header>
  );
}
