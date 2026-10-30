import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { ABOUT_META_FIELDS, getProjects, pickAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { Link } from "@/shared/ui/link";
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
      <ul className="mt-6 space-y-8">
        {projects.map((entry) => (
          <li key={entry.id}>
            <Heading level="entry" as="h2">
              {entry.name}
            </Heading>
            <p className="mt-2">{entry.summary}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {entry.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            {entry.url && (
              <Link to={entry.url} className="mt-2 inline-block">
                {t("projects.visit", { name: entry.name })}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
