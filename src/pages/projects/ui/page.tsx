import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { getAbout, getProjects } from "@/entities/profile";
import { getI18n, languageFromPath } from "@/shared/i18n";
import { PAGE_PATHS, type PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";

// Runs at build time only: the result is baked into the prerendered HTML.
export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromPath(new URL(request.url).pathname);
  return { language, about: getAbout(language), projects: getProjects(language) };
}

export function meta({ loaderData }: PageProps<typeof loader>) {
  const { language, about } = loaderData;
  const t = getI18n(language).t;
  return pageMeta({
    language,
    path: PAGE_PATHS.projects,
    title: t("meta.title", { page: t("pages.projects"), name: about.name }),
    description: t("meta.projects", { name: about.name, headline: about.headline }),
  });
}

export default function Projects({ loaderData }: PageProps<typeof loader>) {
  const { projects } = loaderData;
  const { t } = useTranslation();
  return (
    <main className="py-12">
      <h1 className="text-3xl font-bold">{t("pages.projects")}</h1>
      <ul className="mt-6 space-y-8">
        {projects.map((entry) => (
          <li key={entry.id}>
            <h2 className="text-xl font-semibold">{entry.name}</h2>
            <p className="mt-2">{entry.summary}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {entry.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            {entry.url && (
              <a href={entry.url} className="mt-2 inline-block text-primary underline underline-offset-4">
                {t("projects.visit", { name: entry.name })}
              </a>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
