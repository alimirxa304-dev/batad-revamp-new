import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { getCoursesByCity, findCityById } from "@/action/cities";
import { getCourses } from "@/action/courses";
import AlternatePathsSetter from "@/components/common/AlternatePathsSetter";
import {
  SITE_URL,
  cleanMeta,
  BRAND_NAME,
  cleanJsonLd,
  parseKeywords,
  safeDecodeSlug,
  safeJsonLdString,
  encodeSlugSegment,
  resolveSocialImage,
  buildCitySocialTitle,
  buildOrganizationNode,
  buildWebsiteNode,
  buildFAQPageSchema,
  buildCourseItemListSchema,
} from "@/lib/seoMeta";
import CourseByCityDetails from "./City";

// Single source of truth for resolving /city/[id]/[slug], shared by generateMetadata
// and the page component (cache() dedupes the underlying fetches across both calls
// within one request) so they can never disagree on whether a city exists.
//
// Contract:
//  - slug (and id) match a real city exactly      -> returns the city object
//  - id belongs to a real city but slug is stale   -> permanentRedirect() to the canonical URL
//  - id doesn't belong to any city                 -> notFound()
//  - the API itself fails (network/parse error)    -> the error propagates to error.jsx
const resolveCityForRequest = cache(async (locale, routeId, routeSlug) => {
  const decodedSlug = safeDecodeSlug(routeSlug);

  const cityRes = await getCoursesByCity(locale, decodedSlug);
  const city = cityRes?.success && cityRes?.data?.id ? cityRes.data : null;

  if (city) {
    const canonicalSlug = (locale === "ar" ? city.slug_ar : city.slug_en) || decodedSlug;
    const idMatches = String(city.id) === String(routeId);
    const slugMatches = decodedSlug === canonicalSlug;
    if (idMatches && slugMatches) {
      return city;
    }
    permanentRedirect(`/${locale}/city/${city.id}/${encodeURIComponent(canonicalSlug)}`);
  }

  // Slug didn't resolve — the id might still belong to a real city under a
  // different slug (renamed city, typo, truncated link, ...).
  const match = await findCityById(locale, routeId);
  if (!match) {
    notFound();
  }
  permanentRedirect(`/${locale}/city/${match.id}/${encodeURIComponent(match.slug)}`);
});

// No city-specific asset exists in public/asstes yet, so this reuses the same generic
// fallback already used (and approved) for course images — a real, existing file, not
// a place-specific photo (e.g. london.jpg) that would be wrong for every other city.
const FALLBACK_CITY_IMAGE_PATH = "/asstes/details.jpg";

// City.jsx renders this many course cards before any "Show More" click (visibleCount
// initial state) — matches what's actually visible on first load, not the full result set.
const INITIAL_VISIBLE_COURSES = 6;

function buildCityDescription(data) {
  return cleanMeta(data?.meta?.description || data?.details);
}

// Exactly mirrors the query City.jsx itself builds client-side (type -> taxonomy
// rename, city_id set from the route) so the server's initial fetch and any
// subsequent client-side refetch (filters, show more) never disagree. city_id is
// sent as-is — same as before — it's the API's job to decide priority vs. exclusion;
// this never adds a client-side filter on top of it.
function buildCourseListQuery(searchParams, cityId) {
  const query = new URLSearchParams();
  for (const [key, rawValue] of Object.entries(searchParams || {})) {
    if (rawValue == null) continue;
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    if (value == null) continue;
    query.set(key === "type" ? "taxonomy" : key, value);
  }
  if (cityId != null) query.set("city_id", cityId);
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

// Real, visible top-level links from MainNavBar.jsx's <nav aria-label="Main navigation">.
// Excludes "Training Programs" — that's a <button> dropdown trigger with no direct href,
// not a navigable link itself.
function buildSiteNavigationNode(siteUrl, locale) {
  const items = [
    { name: locale === "ar" ? "الرئيسية" : "Home", path: "" },
    { name: locale === "ar" ? "المدن" : "Cities", path: "/show_cities" },
    { name: locale === "ar" ? "الاستشارات" : "Consulting", path: "/consulting" },
    { name: locale === "ar" ? "المدونة" : "Blog", path: "/blog" },
    { name: locale === "ar" ? "اتصل بنا" : "Contact Us", path: "/contact_us" },
  ];
  return {
    "@type": "SiteNavigationElement",
    "@id": `${siteUrl}#main-navigation`,
    name: items.map((item) => item.name),
    url: items.map((item) => `${siteUrl}/${locale}${item.path}`),
  };
}

// 6 general questions about training in a city. The question set is templated by
// design (Google's own FAQPage examples work this way), but every answer weaves
// the real city name into the answer TEXT itself — not just the question — so the
// rendered FAQ content is never a byte-identical copy across different cities.
function buildCityFaqSchema({ locale, cityName, cityUrl }) {
  if (!cityName) return undefined;

  const qa =
    locale === "ar"
      ? [
          [
            `كام مدة الدورات التدريبية في ${cityName}؟`,
            `معظم الدورات التي تقدمها الأكاديمية البريطانية للتدريب والتطوير في ${cityName} تستمر من أسبوع إلى أسبوعين، بجداول أسبوعية مرنة تناسب المهنيين العاملين.`,
          ],
          [
            `هل الدورات التدريبية في ${cityName} معتمدة دوليًا؟`,
            `نعم، الدورات التي تحمل شارة "معتمدة" في ${cityName} تمنح شهادة معترف بها دوليًا من الأكاديمية البريطانية للتدريب والتطوير عند إتمام الدورة بنجاح.`,
          ],
          [
            `هل التدريب في ${cityName} حضوري أم أونلاين؟`,
            `تتوفر جلسات التدريب في ${cityName} بشكل حضوري؛ يمكنك مراجعة التواريخ المتاحة لكل دورة في هذه الصفحة لمعرفة الجدول الزمني الدقيق في ${cityName}.`,
          ],
          [
            `إيه الفرق بين البرامج التدريبية في ${cityName} والمدن الأخرى؟`,
            `المحتوى التدريبي الذي تقدمه الأكاديمية البريطانية للتدريب والتطوير واحد في كل وجهات التدريب، ومنها ${cityName}؛ والفرق الأساسي بين المدن هو مكان الانعقاد والجدول المحلي وتواريخ الجلسات المتاحة.`,
          ],
          [
            `إزاي أقدر أسجل في دورة في ${cityName}؟`,
            `يمكنك التسجيل في أي دورة في ${cityName} مباشرة من هذه الصفحة باختيار الدورة والتاريخ المناسبين، ثم إكمال نموذج التسجيل.`,
          ],
          [
            `بأي لغة تُقدَّم الدورات في ${cityName}؟`,
            `تُقدَّم الدورات في ${cityName} بشكل أساسي باللغتين الإنجليزية والعربية حسب الدورة والمدرب؛ يمكنك مراجعة صفحة تفاصيل الدورة لمعرفة لغة التقديم المؤكدة.`,
          ],
        ]
      : [
          [
            `How long do the training courses in ${cityName} last?`,
            `Most training courses offered by the British Academy for Training & Development in ${cityName} run for one to two weeks, with flexible weekly schedules to fit working professionals' availability.`,
          ],
          [
            `Are the training courses in ${cityName} internationally certified?`,
            `Yes. Courses delivered in ${cityName} that carry the "certified" badge award an internationally recognized certificate from the British Academy for Training & Development upon successful completion.`,
          ],
          [
            `Is the training in ${cityName} in-person or online?`,
            `Training sessions in ${cityName} are delivered in person; check each course's available dates on this page for the exact schedule in ${cityName}.`,
          ],
          [
            `What is the difference between the training programs offered in ${cityName} and other cities?`,
            `The course curriculum offered by the British Academy for Training & Development is consistent across all training destinations, including ${cityName}; the difference between cities is mainly the venue, local schedule, and available session dates.`,
          ],
          [
            `How can I register for a course in ${cityName}?`,
            `You can register for any course in ${cityName} directly from this page by selecting your preferred course and available date, then completing the registration form.`,
          ],
          [
            `What language are the courses in ${cityName} taught in?`,
            `Courses in ${cityName} are primarily delivered in English and Arabic, depending on the specific course and trainer; check the course details page for the confirmed language of instruction.`,
          ],
        ];

  return buildFAQPageSchema(
    qa.map(([question, answer]) => ({ question, answer })),
    cityUrl
  );
}

function buildCityGraph({ city, locale, routeId, routeSlug, siteUrl, cityCourses }) {
  const cityId = routeId || city.id;
  const citySlug = routeSlug || (locale === "ar" ? city.slug_ar : city.slug_en);
  if (!city?.name || !cityId || !citySlug) return null;

  const cityUrl = `${siteUrl}/${locale}/city/${cityId}/${citySlug}`;
  const organizationId = `${siteUrl}#organization`;
  const websiteId = `${siteUrl}#website`;
  const placeId = `${cityUrl}#place`;
  const primaryImageId = `${cityUrl}#primaryimage`;

  const cityImageUrl = resolveSocialImage({ image: city.image, fallbackImage: FALLBACK_CITY_IMAGE_PATH, siteUrl });
  const pageDescription = buildCityDescription(city) || city.name;

  const website = buildWebsiteNode(siteUrl);
  const organization = buildOrganizationNode(siteUrl);

  const cityImage = {
    "@type": "ImageObject",
    "@id": primaryImageId,
    url: cityImageUrl,
    contentUrl: cityImageUrl,
  };

  const itemListSchema = buildCourseItemListSchema({
    courses: cityCourses,
    locale,
    siteUrl,
    id: `${cityUrl}#course-list`,
    name:
      locale === "ar"
        ? `الدورات التدريبية المتاحة في ${city.name}`
        : `Training courses available in ${city.name}`,
    description:
      locale === "ar"
        ? `استعرض الدورات التدريبية التي تقدمها الأكاديمية البريطانية في ${city.name}.`
        : `Browse the training courses offered by the British Academy in ${city.name}.`,
    organizationId,
    extra: { spatialCoverage: { "@id": placeId } },
  });

  const webPage = {
    "@type": "WebPage",
    "@id": `${cityUrl}#webpage`,
    url: cityUrl,
    name: city.name,
    description: pageDescription,
    isPartOf: { "@id": websiteId },
    about: { "@id": placeId },
    // Only points at the course list when one actually exists — never a dangling @id.
    mainEntity: itemListSchema ? { "@id": `${cityUrl}#course-list` } : undefined,
    primaryImageOfPage: { "@id": primaryImageId },
    breadcrumb: { "@id": `${cityUrl}#breadcrumb` },
    inLanguage: locale,
  };

  const siteNavigation = buildSiteNavigationNode(siteUrl, locale);
  const faqSchema = buildCityFaqSchema({ locale, cityName: city.name, cityUrl });

  const breadcrumbEntries = [
    { name: locale === "ar" ? "الرئيسية" : "Home", url: `${siteUrl}/${locale}` },
    { name: locale === "ar" ? "جميع المدن" : "All Cities", url: `${siteUrl}/${locale}/show_cities` },
    { name: city.name, url: cityUrl },
  ];

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${cityUrl}#breadcrumb`,
    itemListElement: breadcrumbEntries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.url,
    })),
  };

  // The API returns only a localized country name (city.country.name), never an ISO code
  // ("GB" etc.) — using the real name as Text is valid PostalAddress usage and, unlike the
  // old Laravel schema, is never a hardcoded/wrong value for non-UK cities.
  // addressRegion is intentionally omitted: there is no state/province field anywhere in
  // the API response, so — unlike the old schema — this never reuses the city name as a
  // fake region. Only one Place node exists in the whole graph; ItemList references it by
  // @id via spatialCoverage instead of duplicating it.
  const place = {
    "@type": "Place",
    "@id": placeId,
    name: city.name,
    url: cityUrl,
    image: { "@id": primaryImageId },
    address: {
      "@type": "PostalAddress",
      addressLocality: city.name,
      addressCountry: city.country?.name,
    },
  };

  const graph = cleanJsonLd([
    website,
    organization,
    cityImage,
    webPage,
    siteNavigation,
    breadcrumb,
    place,
    itemListSchema,
    faqSchema,
  ]);
  if (!graph) return null;

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export async function generateMetadata({ params, searchParams }) {
  const { locale, id, slug } = await params;
  const sp = await searchParams;
  // Any filter param on top of the fixed city id/slug (category_id, specialization_id,
  // featured, has_approval, discounted, tag, min_price, max_price, type) makes this one
  // of an unbounded number of filtered result combinations — only the bare
  // /city/[id]/[slug] page is meant to be indexed. Same rule already applied to
  // /search_course. Doesn't touch the FAQ/ItemList JSON-LD graph built in the page body.
  const isFiltered = Object.keys(sp || {}).length > 0;
  const robots = { index: !isFiltered, follow: true };
  // Resolves to a real, canonical-matched city, or calls notFound()/permanentRedirect()
  // internally — this function never falls through with an unresolved city, and a real
  // API failure propagates up to error.jsx instead of landing here as a caught error.
  const city = await resolveCityForRequest(locale, id, slug);

  const meta = city.meta || {};
  const title = meta.title || city.name;
  const description = buildCityDescription(city) || city.name;
  const keywords = parseKeywords(meta.keyword);
  // Separate from `title` (the plain <title>/search-result title) on purpose — social
  // shares benefit from a descriptive, branded line ("Manchester" alone tells a
  // Facebook/X preview nothing about the page), while the <title> stays as the
  // API-provided/city-name value it already was.
  const socialTitle = buildCitySocialTitle({ locale, cityName: city.name });

  const resolvedImageUrl = resolveSocialImage({
    image: city?.image,
    fallbackImage: FALLBACK_CITY_IMAGE_PATH,
    siteUrl: SITE_URL,
  });
  // details.jpg (the fallback almost every city currently resolves to — see
  // resolveSocialImage) is a real 1200x400 asset, not the commonly-recommended
  // 1200x630 — no asset at that exact ratio exists in public/ yet, and inventing one
  // isn't something to fake here. Declaring its real dimensions (rather than a false
  // 630) is still strictly more correct for platforms that read these hints.
  const ogImage = { url: resolvedImageUrl, width: 1200, height: 400, alt: socialTitle };
  const urlSlug = encodeSlugSegment(slug);
  const pageUrl = `${SITE_URL}/${locale}/city/${id}/${urlSlug}`;
  const enUrlSlug = encodeSlugSegment(city.slug_en);
  const arUrlSlug = encodeSlugSegment(city.slug_ar);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: keywords || undefined,
    robots,
    alternates: {
      canonical: `/${locale}/city/${id}/${urlSlug}`,
      languages: {
        en: `${SITE_URL}/en/city/${city.id}/${enUrlSlug}`,
        ar: `${SITE_URL}/ar/city/${city.id}/${arUrlSlug}`,
        "x-default": `${SITE_URL}/en/city/${city.id}/${enUrlSlug}`,
      },
    },
    openGraph: {
      title: socialTitle,
      description,
      type: "article",
      url: pageUrl,
      siteName: BRAND_NAME,
      locale: locale === "ar" ? "ar_AR" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_AR"],
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
  };
}

export default async function CourseByCityPage({ params, searchParams }) {
  const { locale, id, slug } = await params;
  const sp = await searchParams;

  // Same resolver as generateMetadata (deduped by cache()) — by the time this
  // returns, city.id/slug are guaranteed to match the URL exactly. Any mismatch,
  // missing city, or real API failure was already handled (redirect/404/throw)
  // before we get here — no more "metadata found it, the page didn't" split brain,
  // and no more catching failures into an empty 200 page.
  const [city, coursesRes] = await Promise.all([
    resolveCityForRequest(locale, id, slug),
    getCourses(locale, buildCourseListQuery(sp, id)),
  ]);

  const coursesData = coursesRes?.data || { courses: [] };
  const cityDescription = buildCityDescription(city);
  const canonicalEnPath = `/city/${city.id}/${city.slug_en}`;
  const canonicalArPath = `/city/${city.id}/${city.slug_ar}`;

  const citySchema = buildCityGraph({
    city,
    locale,
    routeId: city.id,
    routeSlug: locale === "ar" ? city.slug_ar : city.slug_en,
    siteUrl: SITE_URL,
    cityCourses: (coursesData.courses || []).slice(0, INITIAL_VISIBLE_COURSES),
  });

  return (
    <>
      {citySchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(citySchema) }}
        />
      )}
      {city.slug_en && city.slug_ar && (
        <AlternatePathsSetter enPath={canonicalEnPath} arPath={canonicalArPath} />
      )}
      <CourseByCityDetails
        initialCity={city}
        initialCityDescription={cityDescription}
        initialCoursesData={coursesData}
        cityId={city.id}
      />
    </>
  );
}
