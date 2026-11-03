import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { ABOUT_META_FIELDS, type Assignment, getExperience, PeriodLabel, pickAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { Heading, Text } from "@/shared/ui/typography";

const ASSIGNMENT_LISTS = ["responsibilities", "achievements", "team", "tools"] as const satisfies (keyof Assignment)[];

export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: pickAbout(language, ABOUT_META_FIELDS), experience: getExperience(language) };
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
      <ul className="mt-6 space-y-10">
        {experience.map((entry) => (
          <li key={entry.id}>
            <Heading level="entry" as="h2">
              {entry.role} · {entry.organisation}
            </Heading>
            <Text tone="muted" size="sm">
              {entry.location} · <PeriodLabel period={entry} />
            </Text>
            <ul className="mt-4 space-y-6">
              {entry.assignments.map((assignment) => (
                <li key={assignment.name}>
                  <Heading level="entry" as="h3">
                    {assignment.name}
                  </Heading>
                  <p className="mt-1">{assignment.description}</p>
                  {ASSIGNMENT_LISTS.filter((list) => assignment[list].length > 0).map((list) => (
                    <div key={list} className="mt-3">
                      <Heading level="small" as="h4">
                        {t(`experience.assignment.${list}`)}
                      </Heading>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        {assignment[list].map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
