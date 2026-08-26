import { cache } from "react";
import { getCities } from "@/action/cities";
import { getMeta } from "@/action/meta";
import ShowCities from "./Cities";
import {
    SITE_URL,
    cleanJsonLd,
    safeJsonLdString,
    buildOrganizationNode,
    buildWebsiteNode,
    buildBreadcrumbSchema,
    buildLinkItemListSchema,
} from "@/lib/seoMeta";

const META_SLUG = "all-training-cities-british-academy-for-training-development";

// Same shape as city/[id]/[slug]'s own graph (WebSite/Organization/BreadcrumbList, all
// shared helpers from lib/seoMeta.js) — the ItemList here is a plain list of city
// name+links, not courses, so it uses buildLinkItemListSchema rather than
// buildCourseItemListSchema (that one nests a full Course entity per item, which a city
// isn't).
function buildShowCitiesGraph({ cities, locale, siteUrl }) {
    const pageUrl = `${siteUrl}/${locale}/show_cities`;
    const websiteId = `${siteUrl}#website`;

    const website = buildWebsiteNode(siteUrl);
    const organization = buildOrganizationNode(siteUrl);

    const itemList = buildLinkItemListSchema({
        items: (cities || [])
            .filter((c) => c?.id && c?.name && c?.slug)
            .map((c) => ({
                name: c.name,
                url: `${siteUrl}/${locale}/city/${c.id}/${encodeURIComponent(c.slug)}`,
            })),
        locale,
        id: `${pageUrl}#city-list`,
        name: locale === "ar" ? "المدن التدريبية المتاحة" : "Available Training Cities",
        description:
            locale === "ar"
                ? "استعرض كل المدن التي تقدم فيها الأكاديمية البريطانية دورات تدريبية."
                : "Browse every city where the British Academy for Training & Development offers training courses.",
    });

    const webPage = {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: locale === "ar" ? "استكشف الدورات التدريبية حسب المدينة" : "Explore Training Courses by City",
        isPartOf: { "@id": websiteId },
        mainEntity: itemList ? { "@id": `${pageUrl}#city-list` } : undefined,
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
        inLanguage: locale,
    };

    const breadcrumb = buildBreadcrumbSchema(
        [
            { name: locale === "ar" ? "الرئيسية" : "Home", url: `${siteUrl}/${locale}` },
            { name: locale === "ar" ? "كل المدن" : "All Cities", url: pageUrl },
        ],
        pageUrl
    );

    const graph = cleanJsonLd([website, organization, webPage, breadcrumb, itemList]);
    if (!graph) return null;

    return { "@context": "https://schema.org", "@graph": graph };
}

// generateMetadata and the page body both need the same city list (metadata only for
// the fallback title's city count) — cache() dedupes it to one request per render.
const getCachedCities = cache((locale) => getCities(locale));

export async function generateMetadata({ params, searchParams }) {
    const { locale } = await params;
    const sp = await searchParams;
    // Any filter param (specialization, city, search — set via Header.jsx's dropdowns
    // and search box, all written to the URL through updateFilter) makes this one of
    // an unbounded number of filtered result combinations — only the bare
    // /show_cities listing is meant to be indexed. Same rule already applied to
    // /search_course.
    const isFiltered = Object.keys(sp || {}).length > 0;
    const robots = { index: !isFiltered, follow: true };

    // metadataBase/alternates/icons kept identical between this fallback and the
    // "real CMS meta found" branch below — the fallback previously omitted them, which
    // meant a canonical/alternates were silently inherited from the parent layout
    // instead of self-referencing this page whenever the CMS page lookup 404s (which
    // it currently always does for this slug — see META_SLUG above).
    const fallback = {
        metadataBase: new URL(SITE_URL),
        title: "Explore Training Courses by City",
        description: "Browse training courses offered by the British Academy for Training & Development across our global training destinations.",
        robots,
        icons: {
            icon: "/favicon.ico",
            shortcut: "/favicon.ico",
            apple: "/favicon.ico",
        },
        alternates: {
            canonical: `/${locale}/show_cities`,
            languages: {
                en: `${SITE_URL}/en/show_cities`,
                ar: `${SITE_URL}/ar/show_cities`,
                "x-default": `${SITE_URL}/en/show_cities`,
            },
        },
    };

    try {
        const citiesRes = await getCachedCities(locale);
        const cityCount = citiesRes?.data?.stats?.cities;
        if (cityCount) {
            fallback.title = `Explore Training Courses in ${cityCount}+ Cities`;
        }
    } catch {
        // Keep the generic fallback.title above.
    }

    fallback.openGraph = {
        title: fallback.title,
        description: fallback.description,
        type: "website",
        locale: locale === "ar" ? "ar_AR" : "en_US",
        alternateLocale: locale === "ar" ? ["en_US"] : ["ar_AR"],
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
              icons: {
                icon: "/favicon.ico",
                shortcut: "/favicon.ico",
                apple: "/favicon.ico",
            },
              alternates: {
                    canonical: `/${locale}/show_cities`,
                    languages: {
                      en: `${SITE_URL}/en/show_cities`,
                      ar: `${SITE_URL}/ar/show_cities`,
                      "x-default": `${SITE_URL}/en/show_cities`,
                    },
                  },
   openGraph: {
                title,
                description,
                type: "website",
                     locale: locale === "ar" ? "ar_AR" : "en_US",
        alternateLocale: locale === "ar" ? ["en_US"] : ["ar_AR"],
                siteName: "British Academy for Training & Development",
                images: [
                    {
                        url: '/og-image.png',
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
            },

            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [{ url: '/og-image.png', width: 1200, height: 630 }],
            },        };
    } catch (error) {
        console.error("Metadata error:", error);
        return fallback;
    }
}


const ShowCitiesPage = async ({ params }) => {
    const { locale } = await params;
    let citiesData = { cities: [], stats: {} };
    try {
        const res = await getCachedCities(locale);
        citiesData = res?.data || citiesData;
    } catch (error) {
        console.error("Failed to fetch cities:", error);
    }

    const citiesSchema = buildShowCitiesGraph({
        cities: citiesData.cities,
        locale,
        siteUrl: SITE_URL,
    });

    return (
        <>
            {citiesSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: safeJsonLdString(citiesSchema) }}
                />
            )}
            <ShowCities
                initialCities={citiesData.cities || []}
                initialStats={citiesData.stats || {}}
                initialHasMore={citiesData.has_more || false}
                initialNextCursor={citiesData.next_cursor || null}
            />
        </>
    );
};

export default ShowCitiesPage;
