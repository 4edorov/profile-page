import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { ABOUT_META_FIELDS, getLearning, LearningEntry, pickAbout } from "@/entities/profile";
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
        {learning.map(({ kind, entries }) => (
          <section key={kind} aria-labelledby={`${kind}-heading`} className="py-8">
            <Heading level="section" as="h2" id={`${kind}-heading`}>
              {t(`learning.kinds.${kind}`)}
            </Heading>
            <ul className="mt-3 space-y-6">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <LearningEntry entry={entry} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
