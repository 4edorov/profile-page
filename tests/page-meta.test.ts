import type { LoaderFunctionArgs } from "react-router";
import { expect, test } from "vitest";
import { getAbout, getOwner } from "@/entities/profile";
import { LANGUAGES, type Language } from "@/shared/i18n";
import { PAGE_IDS, type PageId } from "@/shared/routing";
import { pageMeta } from "@/shared/seo";
import { findRoute, routeModule } from "./route-modules";

const ABOUT = { name: "Ada Lovelace", headline: "Analyst", summary: "Notes on the Analytical Engine." };

function url(pageId: PageId, language: Language): string {
  return `https://example.com/${language}/${pageId === "home" ? "" : pageId}`;
}

test.each<[PageId, Language, string, string]>([
  ["home", "en", "Ada Lovelace — Analyst", "Notes on the Analytical Engine."],
  ["home", "ru", "Ada Lovelace — Analyst", "Notes on the Analytical Engine."],
  ["about", "en", "About — Ada Lovelace", "About Ada Lovelace, Analyst: experience, stack and way of working."],
  ["about", "ru", "Обо мне — Ada Lovelace", "О себе: Ada Lovelace, Analyst. Опыт, стек и подход к работе."],
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
    { property: "og:image", content: expect.stringMatching(/^https:\/\/example\.com\/.+\.jpg$/) as unknown },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:type", content: "image/jpeg" },
    { property: "og:image:alt", content: "Ada Lovelace" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image:alt", content: "Ada Lovelace" },
  ]);
});

function ownMeta(pageId: PageId, language: Language) {
  const request = new Request(url(pageId, language));
  const { loader, meta } = routeModule(findRoute(`${language}/${pageId}`));
  if (!loader || !meta) {
    throw new Error(`The ${pageId} Page's route module needs a loader and a meta`);
  }
  const loaderData = loader({ request, params: {}, context: {} } as LoaderFunctionArgs);
  return meta({ loaderData, location: { pathname: new URL(request.url).pathname } });
}

test("no Page Metadata without loader data", () => {
  expect(pageMeta("home")({ loaderData: undefined, location: { pathname: "/en/" } })).toEqual([]);
});

test.each(PAGE_IDS.flatMap((pageId) => LANGUAGES.map((language) => [pageId, language] as const)))(
  "the %s Page's own meta, fed its own loader in %s, is canonical for that Page and names the owner",
  (pageId, language) => {
    const tags = ownMeta(pageId, language);
    expect(tags).toContainEqual({ tagName: "link", rel: "canonical", href: url(pageId, language) });
    expect(tags).toContainEqual({
      property: "og:title",
      content: expect.stringContaining(getAbout(language).name) as unknown,
    });
  },
);

test.each<[Language, Language]>([
  ["en", "ru"],
  ["ru", "en"],
])(
  "the Home Page in %s describes the owner to search engines from its Profile Content, as the same Person in every Language",
  (language, other) => {
    const about = getAbout(language);
    expect(ownMeta("home", language)).toContainEqual({
      "script:ld+json": {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        url: url("home", language),
        inLanguage: language,
        mainEntity: {
          "@type": "Person",
          "@id": "https://example.com/en/#owner",
          name: about.name,
          alternateName: [getAbout(other).name],
          jobTitle: about.headline,
          description: about.summary,
          image: expect.stringMatching(/^https:\/\/example\.com\/.+\.jpg$/) as unknown,
          url: url("home", language),
          sameAs: getOwner("en").sameAs,
          knowsAbout: about.stack,
        },
      },
    });
  },
);

test.each(
  PAGE_IDS.filter((pageId) => pageId !== "home").flatMap((pageId) =>
    LANGUAGES.map((language) => [pageId, language] as const),
  ),
)("the %s Page in %s does not describe the owner", (pageId, language) => {
  expect(ownMeta(pageId, language).some((tag) => "script:ld+json" in tag)).toBe(false);
});
