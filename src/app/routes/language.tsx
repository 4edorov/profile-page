import { I18nextProvider } from "react-i18next";
import { Outlet } from "react-router";
import { getI18n, useLanguage } from "@/shared/i18n";
import { Header } from "@/widgets/header";

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
