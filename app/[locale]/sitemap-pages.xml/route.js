import { SITE_URL } from "@/lib/seoMeta";
import { buildUrlsetXml, toIsoLastmod } from "@/lib/sitemapXml";
import { routing } from "@/i18n/routing";

export const revalidate = 21600; // 6 hours

// WHITELIST ONLY — do NOT auto-generate from folder structure.
// Auth/account/utility pages (signIn, signUp, registerCourse, etc.) must
// NEVER appear here. Add new pages manually and deliberately.
//
// Fixed, non-dynamic pages only — no query-param variants (e.g. /search_course
// itself, never /search_course?type=3), per the "filtered pages excluded"
// decision. None of these come from a per-page CMS record, so there's no real
// updated_at to read; lastmod falls back to build/request time for all of them
// (see final report — this is a real data limitation, not a bug).
const STATIC_PATHS = [
  "",
  "/page/Academy-Vision",
  "/page/our-services",
  "/page/FAQ",
  "/privacy",
  "/consulting",
  "/contact_us",
  "/year_plan",
  "/blog",
  "/search_course",
];

export async function GET(_request, { params }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    return new Response("Not Found", { status: 404 });
  }

  const lastmod = toIsoLastmod();
  const entries = STATIC_PATHS.map((path) => ({
    loc: `${SITE_URL}/${locale}${path}`,
    lastmod,
    alternates: {
      en: `${SITE_URL}/en${path}`,
      ar: `${SITE_URL}/ar${path}`,
      "x-default": `${SITE_URL}/en${path}`,
    },
  }));

  return new Response(buildUrlsetXml(entries), {
    headers: { "Content-Type": "application/xml" },
  });
}
