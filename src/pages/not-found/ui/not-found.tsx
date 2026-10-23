import { I18nextProvider, useTranslation } from "react-i18next";
import { Link } from "react-router";
import { getI18n, type Language } from "@/shared/i18n";
import { pagePath } from "@/shared/routing";

/** The Not Found Page in the given Language; usable inside or outside the Language layout. */
export function NotFound({ language }: { language: Language }) {
  return (
    <I18nextProvider i18n={getI18n(language)}>
      <NotFoundContent language={language} />
    </I18nextProvider>
  );
}

function NotFoundContent({ language }: { language: Language }) {
  const { t } = useTranslation();
  return (
    <main className="mx-auto max-w-2xl p-8">
      <title>{t("notFound.title")}</title>
      <meta name="robots" content="noindex" />
      <h1 className="text-2xl font-semibold">{t("notFound.title")}</h1>
      <p className="mt-4">{t("notFound.message")}</p>
      <Link className="mt-6 inline-block underline" to={pagePath(language, "")}>
        {t("notFound.backHome")}
      </Link>
    </main>
  );
}
