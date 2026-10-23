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
    path: PAGE_PATHS.resume,
    title: t("meta.title", { page: t("pages.resume"), name: about.name }),
    description: t("meta.resume", { name: about.name, headline: about.headline }),
  });
}

// The Resume itself, a hand-made PDF per Language, arrives with its viewer.
// See docs/adr/0005-hand-made-resume.md.
export default function Resume() {
  const { t } = useTranslation();
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">{t("pages.resume")}</h1>
      <p className="mt-6">{t("resume.placeholder")}</p>
    </main>
  );
}
