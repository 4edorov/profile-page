import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { getAbout, getLearning, LEARNING_KINDS, PeriodLabel } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";

// Runs at build time only: the result is baked into the prerendered HTML.
export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: getAbout(language), learning: getLearning(language) };
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
      <h1 className="text-3xl font-bold">{t("pages.learning")}</h1>
      <div className="mt-4 divide-y divide-text/10">
        {groups.map(({ kind, entries }) => (
          <section key={kind} aria-labelledby={`${kind}-heading`} className="py-8">
            <h2 id={`${kind}-heading`} className="text-xl font-semibold">
              {t(`learning.kinds.${kind}`)}
            </h2>
            <ul className="mt-3 space-y-6">
              {entries.map((entry) => (
                <li key={entry.id}>
                  <h3 className="font-semibold">
                    {entry.title} · {entry.provider}
                  </h3>
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
