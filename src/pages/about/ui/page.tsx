import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { getAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";

// Runs at build time only: the result is baked into the prerendered HTML.
export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: getAbout(language) };
}

export const meta = pageMeta("about");

export default function About({ loaderData }: PageProps<typeof loader>) {
  const { about } = loaderData;
  const { t } = useTranslation();
  return (
    <main className="py-12">
      <h1 className="text-3xl font-bold">{t("pages.about")}</h1>
      <div className="mt-6 space-y-4">
        {about.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
