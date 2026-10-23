import { useTranslation } from "react-i18next";
import { getProfile } from "@/entities/profile";
import { getI18n, languageFromPath } from "@/shared/i18n";
import { pageMeta } from "@/shared/seo";
import type { Route } from "./+types/page";

// Runs at build time only: the result is baked into the prerendered HTML.
export function loader({ request }: Route.LoaderArgs) {
  const language = languageFromPath(new URL(request.url).pathname);
  return { language, profile: getProfile(language) };
}

export function meta({ loaderData }: Route.MetaArgs) {
  const { language, profile } = loaderData;
  const t = getI18n(language).t;
  return pageMeta({
    language,
    path: "",
    title: t("home.title", { name: profile.name, headline: profile.headline }),
    description: profile.summary,
  });
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { profile } = loaderData;
  const { t } = useTranslation();
  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">{profile.name}</h1>
      <p className="mt-1 text-lg text-neutral-600 dark:text-neutral-400">{profile.headline}</p>
      <p className="mt-6">{profile.summary}</p>
      <section className="mt-8" aria-labelledby="links-heading">
        <h2 id="links-heading" className="text-xl font-semibold">
          {t("home.linksHeading")}
        </h2>
        <ul className="mt-3 space-y-1">
          {profile.links.map((link) => (
            <li key={link.id}>
              <a href={link.url} className="underline underline-offset-4">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
