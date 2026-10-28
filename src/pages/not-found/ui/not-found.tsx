import { useTranslation } from "react-i18next";
import type { Language } from "@/shared/i18n";
import { pagePath } from "@/shared/routing";
import { Link } from "@/shared/ui/link";
import { Heading } from "@/shared/ui/typography";

/** The Not Found Page's content in the given Language, shown inside its Frame. */
export function NotFound({ language }: { language: Language }) {
  const { t } = useTranslation();
  return (
    <main className="py-12">
      <title>{t("notFound.title")}</title>
      <meta name="robots" content="noindex" />
      <Heading level="page" as="h1">
        {t("notFound.title")}
      </Heading>
      <p className="mt-4">{t("notFound.message")}</p>
      <Link to={pagePath(language, "home")} className="mt-6 inline-block">
        {t("notFound.backHome")}
      </Link>
    </main>
  );
}
