import { cache } from "react";
import CoursesPage from "./Courses";
import { getCourses } from "@/action/courses";
import { getMeta } from "@/action/meta";
import {
    SITE_URL,
    cleanJsonLd,
    buildAlternates,
    safeJsonLdString,
    buildOrganizationNode,
    buildWebsiteNode,
    buildBreadcrumbSchema,
    buildCourseItemListSchema,
} from "@/lib/seoMeta";

const META_SLUG = "our-top-training-courses-british-academy-for-training-development";

// Mirrors the type -> taxonomy rename already used by city/[id]/[slug]/page.jsx's own
// buildCourseListQuery, applied here to this page's own searchParams (no fixed
// city_id/category_id to inject — this page filters purely from the URL).
function buildCourseListQuery(searchParams) {
    const query = new URLSearchParams();
    for (const [key, rawValue] of Object.entries(searchParams || {})) {
        if (rawValue == null) continue;
        const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
        if (value == null || value === "") continue;
        query.set(key === "type" ? "taxonomy" : key, value);
    }
    const qs = query.toString();
    return qs ? `?${qs}` : "";
}

// generateMetadata and the page body both need the same filtered course list — cache()
// dedupes it to one request per render (same pattern as city/[id]/[slug]/page.jsx).
const getCachedCourses = cache((locale, queryString) => getCourses(locale, queryString));

// Resolves a human title fragment from whatever filter is actually present in the URL,
// using ONLY the category/specialization/city names already embedded in the courses
// response's own sidebar lists (data.categories / data.cities) — the exact same lookup
// Filters.jsx already does client-side — so this never needs an extra API call.
function buildDynamicTitle({ searchParams, coursesData }) {
    const search = searchParams?.search;
    if (search) return `Search results for "${search}"`;

    const categoryId = searchParams?.category_id;
    const specializationId = searchParams?.specialization_id;
    const cityId = searchParams?.city_id;

    if (categoryId) {
        const category = coursesData?.categories?.find((c) => String(c.id) === String(categoryId));
        if (category?.name) return `${category.name} Training Courses`;
    }
    if (specializationId) {
        for (const category of coursesData?.categories || []) {
            const spec = category.specializations?.find((s) => String(s.id) === String(specializationId));
            if (spec?.name) return `${spec.name} Training Courses`;
        }
    }
    if (cityId) {
        const city = coursesData?.cities?.find((c) => String(c.id) === String(cityId));
        if (city?.name) return `Training Courses in ${city.name}`;
    }
    return undefined;
}

// Same shape as city/[id]/[slug]'s graph, minus Place/FAQPage — WebSite/Organization/
// BreadcrumbList/ItemList are all shared helpers from lib/seoMeta.js. `courses` here
// MUST be the same, already-filtered coursesData the page body renders (never a
// separate unfiltered fetch) — otherwise the ItemList would advertise a different course
// set than what's actually visible to a visitor on a filtered ?featured=1-style URL,
// which would be wrong regardless of whether the page happens to be noindex.
function buildSearchCourseGraph({ courses, locale, siteUrl, pageTitle }) {
    const pageUrl = `${siteUrl}/${locale}/search_course`;
    const organizationId = `${siteUrl}#organization`;
    const websiteId = `${siteUrl}#website`;

    const website = buildWebsiteNode(siteUrl);
    const organization = buildOrganizationNode(siteUrl);

    const itemList = buildCourseItemListSchema({
        courses,
        locale,
        siteUrl,
        id: `${pageUrl}#course-list`,
        name: pageTitle,
        description:
            locale === "ar"
                ? "نتائج البحث عن الدورات التدريبية المطابقة للفلاتر المطبَّقة حاليًا."
                : "Search results for training courses matching the currently applied filters.",
        organizationId,
    });

    const webPage = {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        isPartOf: { "@id": websiteId },
        mainEntity: itemList ? { "@id": `${pageUrl}#course-list` } : undefined,
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        inLanguage: locale,
    };

    const breadcrumb = buildBreadcrumbSchema(
        [
            { name: locale === "ar" ? "الرئيسية" : "Home", url: `${siteUrl}/${locale}` },
            { name: locale === "ar" ? "بحث عن دورات" : "Search Courses", url: pageUrl },
        ],
        pageUrl
    );

    const graph = cleanJsonLd([website, organization, webPage, breadcrumb, itemList]);
    if (!graph) return null;

    return { "@context": "https://schema.org", "@graph": graph };
}

export async function generateMetadata({ params, searchParams }) {
    const { locale } = await params;
    const sp = await searchParams;
    const queryString = buildCourseListQuery(sp);

    // Any filter param (type, category_id, specialization_id, city_id, featured,
    // has_approval, discounted, tag, min_price, max_price, month, year, search, lang)
    // turns this into one of an unbounded number of filtered result combinations —
    // only the bare /search_course listing is meant to be indexed. `follow: true` so
    // Google still crawls through to the real course_details/course_training pages
    // linked from filtered results.
    const hasFilters = Object.keys(sp || {}).length > 0;
    const robots = { index: !hasFilters, follow: true };

    const fallback = {
        metadataBase: new URL(SITE_URL),
        title: "Search Training Courses",
        description: "Search for training courses by keyword, category, city, or date at the British Academy for Training & Development.",
        robots,
        alternates: { canonical: `/${locale}/search_course`, ...buildAlternates("/search_course") },
        icons: {
            icon: "/favicon.ico",
            shortcut: "/favicon.ico",
            apple: "/favicon.ico",
        },
    };

    try {
        const coursesRes = await getCachedCourses(locale, queryString);
        const dynamicTitle = buildDynamicTitle({ searchParams: sp, coursesData: coursesRes?.data });
        if (dynamicTitle) fallback.title = dynamicTitle;
    } catch {
        // Keep the generic fallback.title above.
    }

    fallback.openGraph = {
        title: fallback.title,
        description: fallback.description,
        type: "website",
        siteName: "British Academy for Training & Development",
        images: [{ url: "/og-image.png", width: 1200, height: 630, alt: fallback.title }],
    };
    fallback.twitter = {
        card: "summary_large_image",
        title: fallback.title,
        description: fallback.description,
        images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    };

    try {
        const res = await getMeta(locale, META_SLUG);
        const meta = res?.meta;
        // A real, admin-authored CMS title/description always wins over the dynamic
        // filter-based one — but a dynamic title from an actual URL filter still beats
        // the plain generic CMS fallback text when there's no CMS override for title.
        if (!meta) return fallback;

        const title = meta?.title || fallback.title;
        const description = meta?.description?.replace(/<[^>]*>?/gm, '') || fallback.description;

        let keywords = meta?.keyword;
        if (keywords && typeof keywords === 'string' && keywords.startsWith("[")) {
            try {
                const parsed = JSON.parse(keywords);
                keywords = parsed.map(k => k.value).join(", ");
            } catch (e) {
                console.error("Error parsing keywords:", e);
            }
        }

        return {
            metadataBase: new URL(SITE_URL),
            title,
            description,
            keywords: keywords || undefined,
            robots,
            alternates: { canonical: `/${locale}/search_course`, ...buildAlternates("/search_course") },
            icons: {
                icon: "/favicon.ico",
                shortcut: "/favicon.ico",
                apple: "/favicon.ico",
            },
            openGraph: {
                title,
                description,
                type: "website",
                siteName: "British Academy for Training & Development",
                images: [{ url: '/og-image.png', width: 1200, height: 630, alt: title }],
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [{ url: '/og-image.png', width: 1200, height: 630 }],
            },
        };
    } catch (error) {
        console.error("Metadata error:", error);
        return fallback;
    }
}

export default async function SearchCoursePage({ params, searchParams }) {
    const { locale } = await params;
    const sp = await searchParams;
    const queryString = buildCourseListQuery(sp);

    let coursesData = { courses: [] };
    try {
        const res = await getCachedCourses(locale, queryString);
        coursesData = res?.data || coursesData;
    } catch (error) {
        console.error("Failed to fetch courses:", error);
    }

    const dynamicTitle = buildDynamicTitle({ searchParams: sp, coursesData });
    const pageTitle = dynamicTitle || (locale === "ar" ? "بحث عن دورات تدريبية" : "Search Training Courses");
    const searchCourseSchema = buildSearchCourseGraph({
        courses: coursesData?.courses,
        locale,
        siteUrl: SITE_URL,
        pageTitle,
    });

    return (
        <>
            {searchCourseSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: safeJsonLdString(searchCourseSchema) }}
                />
            )}
            <CoursesPage initialCoursesData={coursesData} />
        </>
    );
}
