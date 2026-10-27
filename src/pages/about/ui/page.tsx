import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { getAbout } from "@/entities/profile";
import { getI18n, languageFromPath } from "@/shared/i18n";
import { PAGE_PATHS, type PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";

// Runs at build time only: the result is baked into the prerendered HTML.
export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromPath(new URL(request.url).pathname);
  return { language, about: getAbout(language) };
}

export function meta({ loaderData }: PageProps<typeof loader>) {
  const { language, about } = loaderData;
  const t = getI18n(language).t;
  return pageMeta({
    language,
    path: PAGE_PATHS.about,
    title: t("meta.title", { page: t("pages.about"), name: about.name }),
    description: about.summary,
  });
}

export default function About({ loaderData }: PageProps<typeof loader>) {
  const { about } = loaderData;
  const { t } = useTranslation();
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">{t("pages.about")}</h1>
      <div className="mt-6 space-y-4">
        {about.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
