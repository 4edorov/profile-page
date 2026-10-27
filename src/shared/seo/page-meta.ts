import type { MetaDescriptor } from "react-router";
import { DEFAULT_LANGUAGE, getI18n, LANGUAGES, languageFromPath, OG_LOCALES } from "@/shared/i18n";
import { absoluteUrl, pagePath, type PageId } from "@/shared/routing";

/**
 * What Page Metadata needs from a Page's loader data. Typed structurally
 * because `shared` can't import `entities` (see docs/adr/0004-feature-sliced-design.md).
 */
interface PageMetaData {
  about: { name: string; headline: string; summary: string };
}

interface PageMetaArgs {
  loaderData: PageMetaData | undefined;
  location: { pathname: string };
}

/**
 * A Page's `meta`: title, description, canonical, hreflang alternates and
 * Open Graph tags, in the Language of the URL. Every Page's `loader` must
 * return `about`.
 */
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
    const ogImage = absoluteUrl("/og-image.png");
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
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${name} — ${headline}` },
      { property: "og:locale", content: OG_LOCALES[language] },
      ...LANGUAGES.filter((alternate) => alternate !== language).map((alternate) => ({
        property: "og:locale:alternate",
        content: OG_LOCALES[alternate],
      })),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ];
  };
}
