import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { Language } from "@/shared/i18n";
import { pagePath } from "@/shared/routing";

/** The Not Found Page's content in the given Language, shown inside its Frame. */
export function NotFound({ language }: { language: Language }) {
  const { t } = useTranslation();
  return (
    <main className="py-12">
      <title>{t("notFound.title")}</title>
      <meta name="robots" content="noindex" />
      <h1 className="text-2xl font-semibold">{t("notFound.title")}</h1>
      <p className="mt-4">{t("notFound.message")}</p>
      <Link className="mt-6 inline-block text-primary underline underline-offset-4" to={pagePath(language, "home")}>
        {t("notFound.backHome")}
      </Link>
    </main>
  );
}
