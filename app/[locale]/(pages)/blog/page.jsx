import { getMeta } from "@/action/meta";
import { getPosts } from "@/action/posts";
import Blog from "./Blog";
import {
    SITE_URL,
    cleanMeta,
    cleanJsonLd,
    parseKeywords,
    buildAlternates,
    safeJsonLdString,
    buildOrganizationNode,
    buildWebsiteNode,
    buildBreadcrumbSchema,
    buildLinkItemListSchema,
} from "@/lib/seoMeta";

const FALLBACK_TITLE = "Blog";
const FALLBACK_DESC = "Read the latest articles, news, and insights from the British Academy for Training & Development.";

// Same GET /posts Blog.jsx/usePostsStore call for the interactive (client-side) list —
// fetched again here, server-side only, purely to build a simple ItemList of the
// latest articles for JSON-LD. buildLinkItemListSchema (not buildCourseItemListSchema —
// these are articles, not courses) mirrors show_cities' own graph shape.
async function buildBlogIndexGraph(locale) {
    try {
        const res = await getPosts(locale);
        const posts = res?.data?.posts || [];
        if (posts.length === 0) return null;

        const pageUrl = `${SITE_URL}/${locale}/blog`;
        const websiteId = `${SITE_URL}#website`;

        const website = buildWebsiteNode(SITE_URL);
        const organization = buildOrganizationNode(SITE_URL);

        const itemList = buildLinkItemListSchema({
            items: posts
                .filter((p) => p?.slug && p?.name)
                .map((p) => ({ name: p.name, url: `${SITE_URL}/${locale}/post/${encodeURIComponent(p.slug)}` })),
            locale,
            id: `${pageUrl}#article-list`,
            name: locale === "ar" ? "أحدث المقالات" : "Latest Articles",
            description:
                locale === "ar"
                    ? "أحدث المقالات المنشورة على مدونة الأكاديمية البريطانية للتدريب والتطوير."
                    : "The latest articles published on the British Academy for Training & Development blog.",
        });

        const webPage = {
            "@type": "WebPage",
            "@id": `${pageUrl}#webpage`,
            url: pageUrl,
            name: locale === "ar" ? "المدونة" : "Blog",
            isPartOf: { "@id": websiteId },
            mainEntity: itemList ? { "@id": `${pageUrl}#article-list` } : undefined,
            breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
            inLanguage: locale,
        };

        const breadcrumb = buildBreadcrumbSchema(
            [
                { name: locale === "ar" ? "الرئيسية" : "Home", url: `${SITE_URL}/${locale}` },
                { name: locale === "ar" ? "المدونة" : "Blog", url: pageUrl },
            ],
            pageUrl
        );

        const graph = cleanJsonLd([website, organization, webPage, breadcrumb, itemList]);
        if (!graph) return null;

        return { "@context": "https://schema.org", "@graph": graph };
    } catch (error) {
        console.error("Blog index JSON-LD error:", error);
        return null;
    }
}


export async function generateMetadata({ params, searchParams }) {
    const { locale } = await params;
    const sp = await searchParams;
    // Same rule already applied to /search_course, /city, /category, /course_training,
    // /show_cities: any query param (e.g. a stale ?page= from the old site) makes this
    // noindex — the Show More button never writes one itself, this only guards against
    // old indexed links.
    const isFiltered = Object.keys(sp || {}).length > 0;
    const robots = { index: !isFiltered, follow: true };

    let title = FALLBACK_TITLE;
    let description = FALLBACK_DESC;
    let keywords;

    try {
        const res = await getMeta(locale, "blog");
        const meta = res?.meta;
        if (meta) {
            title = cleanMeta(meta.title, { maxLength: 60 }) || FALLBACK_TITLE;
            description = cleanMeta(meta.description, { maxLength: 160 }) || FALLBACK_DESC;
            keywords = parseKeywords(meta.keyword);
        }
    } catch (error) {
        console.error("Blog metadata error:", error);
    }

    return {
          metadataBase: new URL(SITE_URL),
        title,
        description,
        keywords,
        robots,
          alternates: {
    canonical: `${SITE_URL}/${locale}/blog`,      
    ...buildAlternates("/blog")               
  },
        openGraph: {
            title,
            description,
            type: "website",
              url: `${SITE_URL}/${locale}/blog`,  
             locale: locale === 'ar' ? 'ar_AR' : 'en_US',
                alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_AR'],
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-image.png"],
        },
    };
}
export default async function BlogPage({ params }) {
  const { locale } = await params;
  const blogSchema = await buildBlogIndexGraph(locale);

  return (
    <>
      {blogSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(blogSchema) }}
        />
      )}
      <Blog />
    </>
  );
}
