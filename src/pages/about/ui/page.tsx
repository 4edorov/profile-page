import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { getAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { Link } from "@/shared/ui/link";
import { Heading } from "@/shared/ui/typography";

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
      <Heading level="page" as="h1">
        {t("pages.about")}
      </Heading>
      <div className="mt-6 space-y-4">
        {about.bio.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {/* The text version of the Technology Cloud, for screen readers, keyboards and phones. */}
      <section aria-labelledby="technologies-heading" className="mt-12">
        <Heading level="section" as="h2" id="technologies-heading">
          {t("about.technologiesHeading")}
        </Heading>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {about.technologies.map((technology) => (
            <li key={technology.name}>
              {technology.url === null ? technology.name : <Link to={technology.url}>{technology.name}</Link>}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
