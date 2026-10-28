import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { getAbout, getExperience, PeriodLabel } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { Heading } from "@/shared/ui/typography";

// Runs at build time only: the result is baked into the prerendered HTML.
export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: getAbout(language), experience: getExperience(language) };
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
      <ul className="mt-6 space-y-8">
        {experience.map((entry) => (
          <li key={entry.id}>
            <Heading level="entry" as="h2">
              {entry.role} · {entry.organisation}
            </Heading>
            <PeriodLabel period={entry} />
            <p className="mt-2">{entry.summary}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {entry.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
