import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { getAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { TiltedPanel } from "@/shared/ui/panel";
import { Heading } from "@/shared/ui/typography";

// Runs at build time only: the result is baked into the prerendered HTML.
export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: getAbout(language) };
}

export const meta = pageMeta("about");

/**
 * The Introduction, the Bio and the Portrait, each on a tilted panel. In
 * reading order, which is also the order below 768px; wider, the Portrait
 * moves up beside the Introduction.
 */
export default function About({ loaderData }: PageProps<typeof loader>) {
  const { about } = loaderData;
  const { t } = useTranslation();
  return (
    <main className="grid gap-12 py-12 md:grid-cols-3 md:gap-x-16 md:gap-y-20">
      <TiltedPanel
        as="section"
        labelledBy="introduction-heading"
        tilt={2}
        className="md:col-span-2 md:col-start-2 md:row-start-1"
      >
        <Heading level="page" as="h1" id="introduction-heading" className="text-center">
          {t("about.introductionHeading")}
        </Heading>
        <Paragraphs paragraphs={about.introduction} />
      </TiltedPanel>
      <TiltedPanel as="section" labelledBy="bio-heading" tilt={-2.5} className="md:col-span-2 md:row-start-2 md:ml-16">
        <Heading level="section" as="h2" id="bio-heading" className="text-center">
          {t("about.bioHeading")}
        </Heading>
        <Paragraphs paragraphs={about.bio} />
      </TiltedPanel>
      <TiltedPanel
        tilt={-3}
        className="w-full max-w-sm justify-self-center p-4 md:col-start-1 md:row-start-1 md:max-w-none md:self-start md:p-6"
      >
        {about.portrait === null ? (
          // Until the owner adds the Portrait: an empty frame that screen readers skip.
          <div aria-hidden="true" className="aspect-[3/4] w-full border border-text/20" />
        ) : (
          <img src={about.portrait} alt={about.name} className="aspect-[3/4] w-full object-cover" />
        )}
      </TiltedPanel>
    </main>
  );
}

function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="mt-6 space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
