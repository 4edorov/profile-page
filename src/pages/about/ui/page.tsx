import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { ABOUT_META_FIELDS, pickAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import type { PageProps } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { TiltedPanel } from "@/shared/ui/panel";
import { Heading } from "@/shared/ui/typography";

export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: pickAbout(language, [...ABOUT_META_FIELDS, "introduction", "bio", "portrait"]) };
}

export const meta = pageMeta("about");

export default function About({ loaderData }: PageProps<typeof loader>) {
  const { about } = loaderData;
  const { t } = useTranslation();
  return (
    // In reading order; from `md` up, the grid moves the Portrait up beside the Introduction.
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
        tilt={3}
        inset="photo"
        className="w-full max-w-sm justify-self-center md:col-start-1 md:row-start-1 md:max-w-none md:self-start"
      >
        {/* Lazy: below `md` it is the last panel, well below the fold. */}
        <img
          src={about.portrait}
          alt={about.name}
          loading="lazy"
          decoding="async"
          className="aspect-[3/4] w-full object-cover"
        />
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
