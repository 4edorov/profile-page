import { LANGUAGES } from "../languages";
import { absoluteUrl, PAGES, pagePath } from "../pages";

// Prerendered to `/sitemap.xml`; lists every Page in every Language with hreflang alternates.
export function loader() {
  const urls = PAGES.flatMap((page) =>
    LANGUAGES.map((language) => {
      const alternates = LANGUAGES.map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate}" href="${absoluteUrl(pagePath(alternate, page))}"/>`,
      ).join("\n");
      return `  <url>\n    <loc>${absoluteUrl(pagePath(language, page))}</loc>\n${alternates}\n  </url>`;
    }),
  );
  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...urls,
    `</urlset>`,
    ``,
  ].join("\n");
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
