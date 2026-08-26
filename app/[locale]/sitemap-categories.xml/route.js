import { SITE_URL, encodeSlugSegment } from "@/lib/seoMeta";
import { getSitemapCategories } from "@/action/sitemap";
import { buildUrlsetXml, buildLocalizedEntries } from "@/lib/sitemapXml";
import { routing } from "@/i18n/routing";

export const revalidate = 21600; // 6 hours

// Course categories (category/[id]/[slug]) only — the /api/sitemap/categories
// backend resource is entirely separate from blog post categories, which come
// from the /posts response's own embedded `categories` array and live at
// blog/[id]/[slug] instead. Blog categories are intentionally excluded here.
export async function GET(_request, { params }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    return new Response("Not Found", { status: 404 });
  }

  const [enItems, arItems] = await Promise.all([
    getSitemapCategories("en"),
    getSitemapCategories("ar"),
  ]);

  const toPath = (item, lang) =>
    item?.id != null && item?.slug
      ? `${SITE_URL}/${lang}/category/${item.id}/${encodeSlugSegment(item.slug)}`
      : null;

  const entries = buildLocalizedEntries({ enItems, arItems, toPath, locale });

  return new Response(buildUrlsetXml(entries), {
    headers: { "Content-Type": "application/xml" },
  });
}
