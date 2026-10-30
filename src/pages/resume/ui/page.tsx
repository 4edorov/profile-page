import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { ABOUT_META_FIELDS, pickAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import { pageMeta } from "@/shared/seo";
import { Heading } from "@/shared/ui/typography";

export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: pickAbout(language, ABOUT_META_FIELDS) };
}

export const meta = pageMeta("resume");

export default function Resume() {
  const { t } = useTranslation();
  return (
    <main className="py-12">
      <Heading level="page" as="h1">
        {t("pages.resume")}
      </Heading>
      <p className="mt-6">{t("resume.placeholder")}</p>
    </main>
  );
}
