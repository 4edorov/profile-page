import { I18nextProvider } from "react-i18next";
import { getI18n, type Language } from "@/shared/i18n";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

/**
 * Every Page's frame in one Language: the Header, the Page itself and the
 * Footer, in a column at most 1280px wide whose edges show on wider screens.
 */
export function Frame({ language, children }: { language: Language; children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={getI18n(language)}>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col xl:border-x xl:border-text/10">
        <Header language={language} />
        <div className="flex-1 px-6 md:px-12">{children}</div>
        <Footer language={language} />
      </div>
    </I18nextProvider>
  );
}
