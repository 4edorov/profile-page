import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { ABOUT_META_FIELDS, getLearning, LEARNING_KINDS, PeriodLabel, pickAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { Heading } from "@/shared/ui/typography";

// Runs at build time only: the result is baked into the prerendered HTML.
export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: pickAbout(language, ABOUT_META_FIELDS), learning: getLearning(language) };
}

export const meta = pageMeta("learning");

export default function Learning({ loaderData }: PageProps<typeof loader>) {
  const { learning } = loaderData;
  const { t } = useTranslation();
  // `getLearning` already orders Entries by kind, so grouping keeps their order.
  const groups = LEARNING_KINDS.map((kind) => ({
    kind,
    entries: learning.filter((entry) => entry.kind === kind),
  })).filter((group) => group.entries.length > 0);
  return (
    <main className="py-12">
      <Heading level="page" as="h1">
        {t("pages.learning")}
      </Heading>
      <div className="mt-4 divide-y divide-text/10">
        {groups.map(({ kind, entries }) => (
          <section key={kind} aria-labelledby={`${kind}-heading`} className="py-8">
            <Heading level="section" as="h2" id={`${kind}-heading`}>
              {t(`learning.kinds.${kind}`)}
            </Heading>
            <ul className="mt-3 space-y-6">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <Heading level="entry" as="h3">
                    {entry.title} · {entry.provider}
                  </Heading>
                  <PeriodLabel period={entry} />
                  <p className="mt-2">{entry.summary}</p>
                  {entry.details.length > 0 && (
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {entry.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
