import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { getAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import { pageMeta } from "@/shared/seo";
import { Heading } from "@/shared/ui/typography";

// Runs at build time only: the result is baked into the prerendered HTML.
export function loader({ request }: LoaderFunctionArgs) {
  const language = languageFromRequest(request);
  return { about: getAbout(language) };
}

export const meta = pageMeta("resume");

// The Resume itself, a hand-made PDF per Language, arrives with its viewer.
// See docs/adr/0005-hand-made-resume.md.
export default function Resume() {
  const { t } = useTranslation();
  return (
    <main className="py-12">
      <Heading level="page" as="h1">
        {t("pages.resume")}
      </Heading>
      <p className="mt-6">{t("resume.placeholder")}</p>
    </main>
  );
}
