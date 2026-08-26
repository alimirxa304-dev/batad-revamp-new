import { SITE_URL } from "@/lib/seoMeta";
import { getSitemapBlogs } from "@/action/sitemap";
import { buildUrlsetXml, buildLocalizedEntries } from "@/lib/sitemapXml";
import { routing } from "@/i18n/routing";

export const revalidate = 21600; // 6 hours

export async function GET(_request, { params }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    return new Response("Not Found", { status: 404 });
  }

  const [enItems, arItems] = await Promise.all([
    getSitemapBlogs("en"),
    getSitemapBlogs("ar"),
  ]);

  const toPath = (item, lang) =>
    item?.slug ? `${SITE_URL}/${lang}/post/${encodeURIComponent(item.slug)}` : null;

  const entries = buildLocalizedEntries({ enItems, arItems, toPath, locale });

  return new Response(buildUrlsetXml(entries), {
    headers: { "Content-Type": "application/xml" },
  });
}
