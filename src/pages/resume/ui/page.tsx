import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { getAbout } from "@/entities/profile";
import { languageFromRequest } from "@/shared/i18n";
import { pageMeta } from "@/shared/seo";

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
      <h1 className="text-3xl font-bold">{t("pages.resume")}</h1>
      <p className="mt-6">{t("resume.placeholder")}</p>
    </main>
  );
}
