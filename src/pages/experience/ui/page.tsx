import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { ABOUT_META_FIELDS, ExperienceTimeline, getExperience, pickAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { Heading } from "@/shared/ui/typography";

export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: pickAbout(language, ABOUT_META_FIELDS), experience: getExperience(language) };
}

export const meta = pageMeta("experience");

export default function Experience({ loaderData }: PageProps<typeof loader>) {
  const { experience } = loaderData;
  const { t } = useTranslation();
  return (
    <main className="py-12">
      <Heading level="page" as="h1">
        {t("pages.experience")}
      </Heading>
      <ExperienceTimeline entries={experience} topicPage className="mt-8" />
    </main>
  );
}
