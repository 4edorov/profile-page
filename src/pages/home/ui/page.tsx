import { useTranslation } from "react-i18next";
import { Link, type LoaderFunctionArgs } from "react-router";
import { getAbout, getExperience, getLearning, getProjects, PeriodLabel } from "@/entities/profile";
import { languageFromRequest, useLanguage } from "@/shared/i18n";
import { PAGE_PATHS, pagePath, type PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";

// Runs at build time only: the result is baked into the prerendered HTML.
export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return {
    about: getAbout(language),
    experience: getExperience(language).filter((entry) => entry.featured),
    projects: getProjects(language).filter((entry) => entry.featured),
    learning: getLearning(language).filter((entry) => entry.featured),
  };
}

export const meta = pageMeta("home");

export default function Home({ loaderData }: PageProps<typeof loader>) {
  const { about, experience, projects, learning } = loaderData;
  const language = useLanguage();
  const { t } = useTranslation();
  return (
    <main className="divide-y divide-text/10">
      <section aria-labelledby="about-heading" className="py-12">
        <h1 id="about-heading" className="text-3xl font-bold">
          {about.name}
        </h1>
        <p className="mt-1 text-lg text-text/70">{about.headline}</p>
        <p className="mt-6">{about.summary}</p>
        <MoreLink to={pagePath(language, PAGE_PATHS.about)}>{t("home.more.about")}</MoreLink>
      </section>

      <TopicSection
        id="experience"
        heading={t("pages.experience")}
        more={{ to: pagePath(language, PAGE_PATHS.experience), label: t("home.more.experience") }}
      >
        {experience.map((entry) => (
          <li key={entry.id}>
            <h3 className="font-semibold">
              {entry.role} · {entry.organisation}
            </h3>
            <PeriodLabel period={entry} />
            <p className="mt-1">{entry.summary}</p>
          </li>
        ))}
      </TopicSection>

      <TopicSection
        id="projects"
        heading={t("pages.projects")}
        more={{ to: pagePath(language, PAGE_PATHS.projects), label: t("home.more.projects") }}
      >
        {projects.map((entry) => (
          <li key={entry.id}>
            <h3 className="font-semibold">{entry.name}</h3>
            <p className="mt-1">{entry.summary}</p>
          </li>
        ))}
      </TopicSection>

      <TopicSection
        id="learning"
        heading={t("pages.learning")}
        more={{ to: pagePath(language, PAGE_PATHS.learning), label: t("home.more.learning") }}
      >
        {learning.map((entry) => (
          <li key={entry.id}>
            <h3 className="font-semibold">
              {entry.title} · {entry.provider}
            </h3>
            <PeriodLabel period={entry} />
            <p className="mt-1">{entry.summary}</p>
          </li>
        ))}
      </TopicSection>
    </main>
  );
}

/** A Topic's Section: a heading, a list of its Featured Entries and a link to its Topic Page. */
function TopicSection({
  id,
  heading,
  more,
  children,
}: {
  id: string;
  heading: string;
  more: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-heading`} className="py-12">
      <h2 id={`${id}-heading`} className="text-xl font-semibold">
        {heading}
      </h2>
      <ul className="mt-3 space-y-4">{children}</ul>
      <MoreLink to={more.to}>{more.label}</MoreLink>
    </section>
  );
}

function MoreLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="mt-4 inline-block text-primary underline underline-offset-4">
      {children}
    </Link>
  );
}
