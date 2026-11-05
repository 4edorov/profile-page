import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { ABOUT_META_FIELDS, getProjects, pickAbout, ProjectGroups } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { Heading } from "@/shared/ui/typography";

export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: pickAbout(language, ABOUT_META_FIELDS), projects: getProjects(language) };
}

export const meta = pageMeta("projects");

export default function Projects({ loaderData }: PageProps<typeof loader>) {
  const { projects } = loaderData;
  const { t } = useTranslation();
  return (
    <main className="py-12">
      <Heading level="page" as="h1">
        {t("pages.projects")}
      </Heading>
      <div className="mt-4 divide-y divide-text/10">
        <ProjectGroups groups={projects} />
      </div>
    </main>
  );
}
