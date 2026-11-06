import type { MetaDescriptor } from "react-router";
import { DEFAULT_LANGUAGE, getI18n, type Language, LANGUAGES, languageFromPath, OG_LOCALES } from "@/shared/i18n";
import { absoluteUrl, pagePath, type PageId } from "@/shared/routing";
import previewImage from "./preview-image.jpg";

interface AboutMeta {
  name: string;
  headline: string;
  summary: string;
}

// Structural, because `shared` can't import `entities` (ADR 0004).
type PageMetaData =
  | { about: AboutMeta; owner?: undefined }
  | {
      about: AboutMeta & { stack: string[]; portrait: string };
      owner: { alternateNames: string[]; sameAs: string[] };
    };

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
      { property: "og:image", content: absoluteUrl(previewImage) },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:alt", content: name },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image:alt", content: name },
      ...(loaderData.owner ? [ownerProfilePage(loaderData, language, url)] : []),
    ];
  };
}

function ownerProfilePage(
  { about, owner }: Extract<PageMetaData, { owner: object }>,
  language: Language,
  url: string,
): MetaDescriptor {
  return {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url,
      inLanguage: language,
      mainEntity: {
        "@type": "Person",
        "@id": `${absoluteUrl(pagePath(DEFAULT_LANGUAGE, "home"))}#owner`,
        name: about.name,
        alternateName: owner.alternateNames,
        jobTitle: about.headline,
        description: about.summary,
        image: absoluteUrl(about.portrait),
        url,
        sameAs: owner.sameAs,
        knowsAbout: about.stack,
      },
    },
  };
}
