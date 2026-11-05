import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { ABOUT_META_FIELDS, getLearning, LearningGroups, pickAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { Heading } from "@/shared/ui/typography";

export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: pickAbout(language, ABOUT_META_FIELDS), learning: getLearning(language) };
}

export const meta = pageMeta("learning");

export default function Learning({ loaderData }: PageProps<typeof loader>) {
  const { learning } = loaderData;
  const { t } = useTranslation();
  return (
    <main className="py-12">
      <Heading level="page" as="h1">
        {t("pages.learning")}
      </Heading>
      <div className="mt-4 divide-y divide-text/10">
        <LearningGroups groups={learning} topicPage />
      </div>
    </main>
  );
}
