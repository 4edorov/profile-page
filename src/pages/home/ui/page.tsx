import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { getAbout, getExperience, getLearning, getProjects, PeriodLabel, Tagline } from "@/entities/profile";
import { languageFromRequest, useLanguage } from "@/shared/i18n";
import { pagePath, type PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { Link } from "@/shared/ui/link";
import { Heading, Text } from "@/shared/ui/typography";

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
      <section aria-labelledby="about-heading" className="grid min-h-[80svh] gap-12 py-12 md:grid-cols-2">
        <div className="flex flex-col items-start justify-center">
          <Heading level="hero" as="h1" id="about-heading">
            {about.name}
          </Heading>
          <Text size="lead" weight="semibold" className="mt-4">
            {about.headline}
          </Text>
          <Text tone="muted" size="lg" as="ul" className="mt-2 flex flex-wrap gap-x-2">
            {about.stack.map((item) => (
              // The dot is decoration: its alt text is empty, so screen readers skip it.
              // Browsers without alt text drop the dot, but the gap keeps the items apart.
              <li key={item} className="not-last:after:ml-2 not-last:after:content-['·'_/_'']">
                {item}
              </li>
            ))}
          </Text>
          <Text size="display" weight="bold" className="mt-8">
            <Tagline tagline={about.tagline} />
          </Text>
          <Text size="lead" className="mt-4">
            {about.summary}
          </Text>
          <MoreLink to={pagePath(language, "about")}>{t("home.more.about")}</MoreLink>
        </div>
        {/* Reserved for the About animation; hidden below 768px. */}
        <div aria-hidden="true" className="hidden md:block" />
      </section>

      <TopicSection
        id="experience"
        heading={t("pages.experience")}
        more={{ to: pagePath(language, "experience"), label: t("home.more.experience") }}
      >
        {experience.map((entry) => (
          <li key={entry.id}>
            <Heading level="entry" as="h3">
              {entry.role} · {entry.organisation}
            </Heading>
            <PeriodLabel period={entry} />
            <p className="mt-1">{entry.summary}</p>
          </li>
        ))}
      </TopicSection>

      <TopicSection
        id="projects"
        heading={t("pages.projects")}
        more={{ to: pagePath(language, "projects"), label: t("home.more.projects") }}
      >
        {projects.map((entry) => (
          <li key={entry.id}>
            <Heading level="entry" as="h3">
              {entry.name}
            </Heading>
            <p className="mt-1">{entry.summary}</p>
          </li>
        ))}
      </TopicSection>

      <TopicSection
        id="learning"
        heading={t("pages.learning")}
        more={{ to: pagePath(language, "learning"), label: t("home.more.learning") }}
      >
        {learning.map((entry) => (
          <li key={entry.id}>
            <Heading level="entry" as="h3">
              {entry.title} · {entry.provider}
            </Heading>
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
      <Heading level="section" as="h2" id={`${id}-heading`}>
        {heading}
      </Heading>
      <ul className="mt-3 space-y-4">{children}</ul>
      <MoreLink to={more.to}>{more.label}</MoreLink>
    </section>
  );
}

function MoreLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="mt-4 inline-block">
      {children}
    </Link>
  );
}
