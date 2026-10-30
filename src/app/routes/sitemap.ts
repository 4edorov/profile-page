import { LANGUAGES } from "@/shared/i18n";
import { absoluteUrl, PAGE_IDS, pagePath } from "@/shared/routing";

export function loader() {
  const urls = PAGE_IDS.flatMap((id) =>
    LANGUAGES.map((language) => {
      const alternates = LANGUAGES.map(
        (alternate) =>
          `    <xhtml:link rel="alternate" hreflang="${alternate}" href="${absoluteUrl(pagePath(alternate, id))}"/>`,
      ).join("\n");
      return `  <url>\n    <loc>${absoluteUrl(pagePath(language, id))}</loc>\n${alternates}\n  </url>`;
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
