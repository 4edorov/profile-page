import type { MetaDescriptor } from "react-router";
import { DEFAULT_LANGUAGE, LANGUAGES, OG_LOCALES, type Language } from "@/shared/i18n";
import { absoluteUrl, pagePath } from "@/shared/routing";

interface PageMetaOptions {
  language: Language;
  /** The Page's path below the Language prefix; `""` is the Language root. */
  path: string;
  title: string;
  description: string;
}

/** Title, description, canonical, hreflang alternates and Open Graph tags for a Page. */
export function pageMeta({ language, path, title, description }: PageMetaOptions): MetaDescriptor[] {
  const url = absoluteUrl(pagePath(language, path));
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    ...LANGUAGES.map((alternate) => ({
      tagName: "link",
      rel: "alternate",
      hrefLang: alternate,
      href: absoluteUrl(pagePath(alternate, path)),
    })),
    {
      tagName: "link",
      rel: "alternate",
      hrefLang: "x-default",
      href: absoluteUrl(pagePath(DEFAULT_LANGUAGE, path)),
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
