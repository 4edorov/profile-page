import type { LoaderFunctionArgs, MetaDescriptor } from "react-router";
import { expect, test } from "vitest";
import * as about from "@/pages/about/ui/page";
import * as experience from "@/pages/experience/ui/page";
import * as home from "@/pages/home/ui/page";
import * as learning from "@/pages/learning/ui/page";
import * as projects from "@/pages/projects/ui/page";
import * as resume from "@/pages/resume/ui/page";
import { LANGUAGES, type Language } from "@/shared/i18n";
import { PAGE_IDS, type PageId } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";

const ABOUT = { name: "Ada Lovelace", headline: "Analyst", summary: "Notes on the Analytical Engine." };

// `SITE_URL` is set in vitest.config.ts.
function url(pageId: PageId, language: Language): string {
  return `https://example.com/${language}/${pageId === "home" ? "" : pageId}`;
}

test.each<[PageId, Language, string, string]>([
  ["home", "en", "Ada Lovelace — Analyst", "Notes on the Analytical Engine."],
  ["home", "ru", "Ada Lovelace — Analyst", "Notes on the Analytical Engine."],
  ["about", "en", "About — Ada Lovelace", "Notes on the Analytical Engine."],
  ["about", "ru", "Обо мне — Ada Lovelace", "Notes on the Analytical Engine."],
  ["experience", "en", "Experience — Ada Lovelace", "Work experience of Ada Lovelace, Analyst."],
  ["experience", "ru", "Опыт — Ada Lovelace", "Опыт работы: Ada Lovelace, Analyst."],
  ["projects", "en", "Projects — Ada Lovelace", "Projects by Ada Lovelace, Analyst."],
  ["projects", "ru", "Проекты — Ada Lovelace", "Проекты: Ada Lovelace, Analyst."],
  [
    "learning",
    "en",
    "Learning — Ada Lovelace",
    "Education, courses, certifications and books of Ada Lovelace, Analyst.",
  ],
  ["learning", "ru", "Обучение — Ada Lovelace", "Образование, курсы, сертификаты и книги: Ada Lovelace, Analyst."],
  ["resume", "en", "Resume — Ada Lovelace", "The resume of Ada Lovelace, Analyst."],
  ["resume", "ru", "Резюме — Ada Lovelace", "Резюме: Ada Lovelace, Analyst."],
])("Page Metadata of the %s Page in %s", (pageId, language, title, description) => {
  const other = language === "en" ? "ru" : "en";
  const ogLocales = { en: "en_US", ru: "ru_RU" };
  const meta = pageMeta(pageId)({
    loaderData: { about: ABOUT },
    location: { pathname: new URL(url(pageId, language)).pathname },
  });
  expect(meta).toEqual([
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url(pageId, language) },
    { tagName: "link", rel: "alternate", hrefLang: "en", href: url(pageId, "en") },
    { tagName: "link", rel: "alternate", hrefLang: "ru", href: url(pageId, "ru") },
    { tagName: "link", rel: "alternate", hrefLang: "x-default", href: url(pageId, "en") },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url(pageId, language) },
    { property: "og:locale", content: ogLocales[language] },
    { property: "og:locale:alternate", content: ogLocales[other] },
  ]);
});

test("no Page Metadata without loader data", () => {
  expect(pageMeta("home")({ loaderData: undefined, location: { pathname: "/en/" } })).toEqual([]);
});

interface PageModule {
  loader: (args: LoaderFunctionArgs) => unknown;
  meta: (args: { loaderData: unknown; location: { pathname: string } }) => MetaDescriptor[];
}

const MODULES: Record<PageId, PageModule> = {
  home: home as unknown as PageModule,
  about: about as unknown as PageModule,
  experience: experience as unknown as PageModule,
  projects: projects as unknown as PageModule,
  learning: learning as unknown as PageModule,
  resume: resume as unknown as PageModule,
};

test.each(PAGE_IDS.flatMap((pageId) => LANGUAGES.map((language) => [pageId, language] as const)))(
  "the %s Page's own meta, fed its own loader in %s, is canonical for that Page",
  (pageId, language) => {
    const request = new Request(url(pageId, language));
    const { loader, meta } = MODULES[pageId];
    const loaderData = loader({ request, params: {}, context: {} } as LoaderFunctionArgs);
    const tags = meta({ loaderData, location: { pathname: new URL(request.url).pathname } });
    expect(tags).toContainEqual({ tagName: "link", rel: "canonical", href: url(pageId, language) });
  },
);
