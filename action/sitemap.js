"use server";

const SITEMAP_API_BASE = (process.env.NEXT_PUBLIC_API_KEY || "").replace(/\/api\/v\d+\/?$/, "");
const SITEMAP_REVALIDATE_SECONDS = 21600; // 6 hours

async function fetchSitemapResource(resource, lang) {
  try {
    const response = await fetch(
      `${SITEMAP_API_BASE}/api/sitemap/${resource}?lang=${lang}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
      }
    );

    if (!response.ok) {
      throw new Error(`Sitemap API "${resource}" (${lang}) returned ${response.status}`);
    }

    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (error) {
    console.error(`[sitemap] Failed to load "${resource}" (${lang}):`, error);
    return [];
  }
}

export async function getSitemapCourses(lang) {
  return fetchSitemapResource("courses", lang);
}

export async function getSitemapCategories(lang) {
  return fetchSitemapResource("categories", lang);
}

export async function getSitemapSpecializations(lang) {
  return fetchSitemapResource("specializations", lang);
}

export async function getSitemapBlogs(lang) {
  return fetchSitemapResource("blogs", lang);
}

// The /cities catalog has a confirmed stale duplicate: id 74 and id 34 are both
// named "Manchester" with the identical slug "Training-Course-in-Manchester". id 74
// has courses_count: 0 (empty, no real content) while id 34 has real courses — and
// /cities/{slug}'s own single-city lookup already resolves that slug to id 34, which
// is why /city/74/... already permanentRedirect()s to /city/34/... on the live site
// (see city/[id]/[slug]/page.jsx's resolveCityForRequest). Excluded here (sitemap
// only) so the sitemap never submits a URL that immediately redirects away — the API
// /cities listing itself is untouched, so show_cities' live display is unaffected.
const SITEMAP_CITY_EXCLUDE_IDS = new Set([74]);

// No dedicated /api/sitemap/cities endpoint exists (unlike courses/categories/
// specializations/blogs), so this pages through the same cursor-paginated
// /cities listing action/cities.js's getCities() already uses, collecting
// every page rather than just the first ~12-city batch.
export async function getSitemapCities(lang) {
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
  const cities = [];
  let cursor;
  for (let page = 0; page < 20; page++) {
    try {
      const queryParams = cursor ? `?cursor=${cursor}` : "";
      const response = await fetch(`${API_KEY}/cities${queryParams}`, {
        headers: { "Content-Type": "application/json", "Accept-Language": lang ?? "en" },
        next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
      });
      if (!response.ok) break;
      const json = await response.json();
      const pageCities = json?.data?.cities || [];
      cities.push(...pageCities);
      if (!json?.data?.has_more || !json?.data?.next_cursor) break;
      cursor = json.data.next_cursor;
    } catch (error) {
      console.error(`[sitemap] Failed to load "cities" (${lang}) page ${page}:`, error);
      break;
    }
  }
  return cities.filter((c) => !SITEMAP_CITY_EXCLUDE_IDS.has(c?.id));
}
