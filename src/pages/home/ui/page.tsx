import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import {
  ABOUT_META_FIELDS,
  ExperienceTimeline,
  getExperience,
  getLearning,
  getProjects,
  LearningGroups,
  pickAbout,
  ProjectEntries,
  Tagline,
  TechnologyCloud,
  TechnologyMarquee,
} from "@/entities/profile";
import { languageFromRequest, useLanguage } from "@/shared/i18n";
import { pagePath, type PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { Link } from "@/shared/ui/link";
import { Heading, Text } from "@/shared/ui/typography";

export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return {
    about: pickAbout(language, [...ABOUT_META_FIELDS, "stack", "technologies", "tagline"]),
    experience: getExperience(language, { featuredOnly: true }),
    projects: getProjects(language, { featuredOnly: true }).flatMap((group) => group.entries),
    learning: getLearning(language, { featuredOnly: true }),
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
        <div className="flex min-w-0 flex-col items-start justify-center">
          <Heading level="hero" as="h1" id="about-heading">
            {about.name}
          </Heading>
          <Text size="lead" weight="semibold" className="mt-4">
            {about.headline}
          </Text>
          <Text tone="muted" size="lg" as="ul" className="mt-2 flex flex-wrap gap-x-2">
            {about.stack.map((item) => (
              // The dot's alt text is empty so screen readers skip it; browsers without alt text drop it, and the gap still separates items.
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
          <div className="mt-8 w-full md:hidden">
            <TechnologyMarquee technologies={about.technologies} />
          </div>
        </div>
        <div className="hidden items-center md:flex">
          <TechnologyCloud technologies={about.technologies} />
        </div>
      </section>

      <TopicSection
        id="experience"
        heading={t("pages.experience")}
        more={{ to: pagePath(language, "experience"), label: t("home.more.experience") }}
      >
        <ExperienceTimeline entries={experience} className="mt-6" />
      </TopicSection>

      <TopicSection
        id="projects"
        heading={t("pages.projects")}
        more={{ to: pagePath(language, "projects"), label: t("home.more.projects") }}
      >
        <ProjectEntries entries={projects} className="mt-6" />
      </TopicSection>

      <TopicSection
        id="learning"
        heading={t("pages.learning")}
        more={{ to: pagePath(language, "learning"), label: t("home.more.learning") }}
      >
        <LearningGroups groups={learning} />
      </TopicSection>
    </main>
  );
}

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
      {children}
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
