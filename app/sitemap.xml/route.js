import { SITE_URL } from "@/lib/seoMeta";
import { buildSitemapIndexXml } from "@/lib/sitemapXml";
import { routing } from "@/i18n/routing";

export const revalidate = 21600; // 6 hours

// Single top-level sitemap index (the one URL robots.txt actually points to),
// listing all 6 sub-sitemap types across both locales (12 entries total) —
// supersedes the old per-locale /en/sitemap.xml and /ar/sitemap.xml indexes,
// which only ever listed that one locale's own 4 sub-sitemaps.
const SITEMAP_TYPES = [
  "courses",
  "specializations",
  "cities",
  "posts",
  "pages",
  "categories",
];

export async function GET() {
  const now = new Date().toISOString();
  const sitemaps = routing.locales.flatMap((locale) =>
    SITEMAP_TYPES.map((type) => ({
      loc: `${SITE_URL}/${locale}/sitemap-${type}.xml`,
      lastmod: now,
    }))
  );

  return new Response(buildSitemapIndexXml(sitemaps), {
    headers: { "Content-Type": "application/xml" },
  });
}
