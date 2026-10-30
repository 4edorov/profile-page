import type { MetaDescriptor } from "react-router";
import { DEFAULT_LANGUAGE, getI18n, LANGUAGES, languageFromPath, OG_LOCALES } from "@/shared/i18n";
import { absoluteUrl, pagePath, type PageId } from "@/shared/routing";

// Structural, because `shared` can't import `entities` (ADR 0004).
interface PageMetaData {
  about: { name: string; headline: string; summary: string };
}

interface PageMetaArgs {
  loaderData: PageMetaData | undefined;
  location: { pathname: string };
}

export function pageMeta(pageId: PageId) {
  return ({ loaderData, location }: PageMetaArgs): MetaDescriptor[] => {
    if (!loaderData) {
      return [];
    }
    const language = languageFromPath(location.pathname);
    const { t } = getI18n(language);
    const { name, headline, summary } = loaderData.about;
    const values = { page: t(`pages.${pageId}`), name, headline, summary };
    const title = t(`meta.${pageId}.title`, values);
    const description = t(`meta.${pageId}.description`, values);
    const url = absoluteUrl(pagePath(language, pageId));
    return [
      { title },
      { name: "description", content: description },
      { tagName: "link", rel: "canonical", href: url },
      ...LANGUAGES.map((alternate) => ({
        tagName: "link",
        rel: "alternate",
        hrefLang: alternate,
        href: absoluteUrl(pagePath(alternate, pageId)),
      })),
      {
        tagName: "link",
        rel: "alternate",
        hrefLang: "x-default",
        href: absoluteUrl(pagePath(DEFAULT_LANGUAGE, pageId)),
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
  };
}
