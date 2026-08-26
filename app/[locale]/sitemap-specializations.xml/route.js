import { SITE_URL, encodeSlugSegment } from "@/lib/seoMeta";
import { getSitemapSpecializations } from "@/action/sitemap";
import { buildUrlsetXml, buildLocalizedEntries } from "@/lib/sitemapXml";
import { routing } from "@/i18n/routing";

export const revalidate = 21600; // 6 hours

export async function GET(_request, { params }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    return new Response("Not Found", { status: 404 });
  }

  const [enItems, arItems] = await Promise.all([
    getSitemapSpecializations("en"),
    getSitemapSpecializations("ar"),
  ]);

  const toPath = (item, lang) =>
    item?.id != null && item?.slug
      ? `${SITE_URL}/${lang}/course_training/${item.id}/${encodeSlugSegment(item.slug)}`
      : null;

  const entries = buildLocalizedEntries({ enItems, arItems, toPath, locale });

  return new Response(buildUrlsetXml(entries), {
    headers: { "Content-Type": "application/xml" },
  });
}
