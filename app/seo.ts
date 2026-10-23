import type { MetaDescriptor } from "react-router";
import { DEFAULT_LANGUAGE, LANGUAGES, OG_LOCALES, type Language } from "./languages";
import { absoluteUrl, pagePath, type Page } from "./pages";

interface PageMetaOptions {
  language: Language;
  page: Pick<Page, "path">;
  title: string;
  description: string;
}

/** Title, description, canonical, hreflang alternates and Open Graph tags for a Page. */
export function pageMeta({ language, page, title, description }: PageMetaOptions): MetaDescriptor[] {
  const url = absoluteUrl(pagePath(language, page));
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    ...LANGUAGES.map((alternate) => ({
      tagName: "link",
      rel: "alternate",
      hrefLang: alternate,
      href: absoluteUrl(pagePath(alternate, page)),
    })),
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: absoluteUrl(pagePath(DEFAULT_LANGUAGE, page)),
    },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:locale", content: OG_LOCALES[language] },
    ...LANGUAGES.filter((alternate) => alternate !== language).map((alternate) => ({
      property: "og:locale:alternate",
      content: OG_LOCALES[alternate],
    })),
  ];
}
