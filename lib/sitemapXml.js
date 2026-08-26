function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function toIsoLastmod(value) {
  const date = value ? new Date(value) : null;
  return date && !isNaN(date.getTime())
    ? date.toISOString()
    : new Date().toISOString();
}

// Pairs same-id items across both locale responses (courses/categories/
// specializations/blogs/cities all share the same id across `?lang=en` and
// `?lang=ar`, just with a localized slug) so every <url> can carry full en+ar
// hreflang alternates, not just its own locale. `xDefaultLocale` matches the
// x-default convention every real page's generateMetadata already uses
// (see buildAlternates in this same lib, and city/course_details/etc.) —
// x-default points at the English URL (falling back to ar if an item has no
// en match).
export function buildLocalizedEntries({
  enItems = [],
  arItems = [],
  toPath,
  locale,
  xDefaultLocale = "en",
}) {
  const enById = new Map(enItems.map((item) => [String(item?.id), item]));
  const arById = new Map(arItems.map((item) => [String(item?.id), item]));
  const sourceItems = locale === "en" ? enItems : arItems;

  const entries = [];
  for (const item of sourceItems) {
    const id = String(item?.id);
    const enItem = enById.get(id);
    const arItem = arById.get(id);
    const enPath = enItem ? toPath(enItem, "en") : null;
    const arPath = arItem ? toPath(arItem, "ar") : null;
    const loc = locale === "en" ? enPath : arPath;
    if (!loc) continue;

    const alternates = {};
    if (enPath) alternates.en = enPath;
    if (arPath) alternates.ar = arPath;
    const xDefaultPath =
      xDefaultLocale === "ar" ? arPath || enPath : enPath || arPath;
    if (xDefaultPath) alternates["x-default"] = xDefaultPath;

    entries.push({
      loc,
      lastmod: toIsoLastmod(item?.updated_at),
      alternates,
    });
  }
  return entries;
}

// Google officially ignores <changefreq>/<priority> (per Search Central docs),
// so entries only carry <loc>/<lastmod>/hreflang alternates.
export function buildUrlsetXml(entries) {
  const body = entries
    .map(({ loc, lastmod, alternates }) => {
      const links = alternates
        ? Object.entries(alternates)
            .map(
              ([hreflang, href]) =>
                `<xhtml:link rel="alternate" hreflang="${escapeXml(hreflang)}" href="${escapeXml(href)}"/>`
            )
            .join("\n")
        : "";
      return `<url>
<loc>${escapeXml(loc)}</loc>
<lastmod>${lastmod}</lastmod>
${links}
</url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>`;
}

export function buildSitemapIndexXml(sitemaps) {
  const body = sitemaps
    .map(
      ({ loc, lastmod }) => `<sitemap>
<loc>${escapeXml(loc)}</loc>
<lastmod>${lastmod}</lastmod>
</sitemap>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</sitemapindex>`;
}
