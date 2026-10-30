import { I18nextProvider } from "react-i18next";
import { getContact } from "@/entities/profile";
import { getI18n, type Language } from "@/shared/i18n";
import { Footer } from "@/widgets/footer";
import { Header } from "@/widgets/header";

export function Frame({ language, children }: { language: Language; children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={getI18n(language)}>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col xl:border-x xl:border-text/10">
        <Header language={language} />
        <div className="flex-1 px-6 md:px-12">{children}</div>
        <Footer contact={getContact(language)} />
      </div>
    </I18nextProvider>
  );
}
