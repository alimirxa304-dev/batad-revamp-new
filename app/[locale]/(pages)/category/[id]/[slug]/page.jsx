
import AlternatePathsSetter from "@/components/common/AlternatePathsSetter";
import CategoryDetails from "./CategoryDetails";
import { getCategoryBySlug } from "@/action/categories";
import { getCourses } from "@/action/courses";
import {
    SITE_URL,
    cleanMeta,
    cleanJsonLd,
    buildAlternates,
    resolveOgImage,
    resolveSocialImage,
    safeJsonLdString,
    encodeSlugSegment,
    buildOrganizationNode,
    buildWebsiteNode,
    buildBreadcrumbSchema,
    buildCourseItemListSchema,
} from "@/lib/seoMeta";

// Same reused fallback as city/[id]/[slug] and course_details — a real, existing asset,
// not a category-specific photo that would be wrong for every other category.
const FALLBACK_CATEGORY_IMAGE_PATH = "/asstes/details.jpg";

// Same shape as city/[id]/[slug]'s buildCityGraph, minus the Place/FAQPage nodes that
// are specific to the "city" concept — WebSite/Organization/BreadcrumbList/ItemList are
// all shared helpers from lib/seoMeta.js, nothing duplicated here.
function buildCategoryGraph({ category, courses, locale, routeId, routeSlug, siteUrl }) {
    const categoryId = routeId || category.id;
    const categorySlug = routeSlug || (locale === "ar" ? category.slug_ar : category.slug_en);
    if (!category?.name || !categoryId || !categorySlug) return null;

    const categoryUrl = `${siteUrl}/${locale}/category/${categoryId}/${categorySlug}`;
    const organizationId = `${siteUrl}#organization`;
    const websiteId = `${siteUrl}#website`;
    const primaryImageId = `${categoryUrl}#primaryimage`;

    const categoryImageUrl = resolveSocialImage({
        image: category.image,
        fallbackImage: FALLBACK_CATEGORY_IMAGE_PATH,
        siteUrl,
    });
    const pageDescription = cleanMeta(category?.meta?.description || category?.description) || category.name;

    const website = buildWebsiteNode(siteUrl);
    const organization = buildOrganizationNode(siteUrl);

    const categoryImage = {
        "@type": "ImageObject",
        "@id": primaryImageId,
        url: categoryImageUrl,
        contentUrl: categoryImageUrl,
    };

    const itemListSchema = buildCourseItemListSchema({
        courses,
        locale,
        siteUrl,
        id: `${categoryUrl}#course-list`,
        name:
            locale === "ar"
                ? `الدورات التدريبية المتاحة في ${category.name}`
                : `Training courses available in ${category.name}`,
        description:
            locale === "ar"
                ? `استعرض الدورات التدريبية في تصنيف ${category.name} التي تقدمها الأكاديمية البريطانية.`
                : `Browse the training courses in the ${category.name} category offered by the British Academy.`,
        organizationId,
    });

    const webPage = {
        "@type": "WebPage",
        "@id": `${categoryUrl}#webpage`,
        url: categoryUrl,
        name: category.name,
        description: pageDescription,
        isPartOf: { "@id": websiteId },
        mainEntity: itemListSchema ? { "@id": `${categoryUrl}#course-list` } : undefined,
        primaryImageOfPage: { "@id": primaryImageId },
        breadcrumb: { "@id": `${categoryUrl}#breadcrumb` },
        inLanguage: locale,
    };

    // No dedicated "browse all categories" page exists — /search_course's sidebar filter
    // is the real, existing destination that lists every category, same role /show_cities
    // plays for city's own "All Cities" breadcrumb entry.
    const breadcrumb = buildBreadcrumbSchema(
        [
            { name: locale === "ar" ? "الرئيسية" : "Home", url: `${siteUrl}/${locale}` },
            { name: locale === "ar" ? "كل التصنيفات" : "All Categories", url: `${siteUrl}/${locale}/search_course` },
            { name: category.name, url: categoryUrl },
        ],
        categoryUrl
    );

    const graph = cleanJsonLd([website, organization, categoryImage, webPage, breadcrumb, itemListSchema]);
    if (!graph) return null;

    return { "@context": "https://schema.org", "@graph": graph };
}

export async function generateMetadata({ params, searchParams }) {
    const { locale, id, slug } = await params;
    const sp = await searchParams;
    // Any filter param on top of the fixed category id/slug (specialization_id,
    // city_id, featured, has_approval, discounted, tag, min_price, max_price, type)
    // makes this one of an unbounded number of filtered result combinations — only
    // the bare /category/[id]/[slug] listing is meant to be indexed. Same rule
    // already applied to /search_course.
    const isFiltered = Object.keys(sp || {}).length > 0;
    const robots = { index: !isFiltered, follow: true };
    const name = slug
        ? decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Category";
    const urlSlug = encodeSlugSegment(slug);
    const fallback = {
        metadataBase: new URL(SITE_URL),
        title: `Training Courses in ${name} `,
        description: `Explore training courses available in ${name} from the British Academy for Training & Development.`,
        robots,
        alternates: {
            canonical: `/${locale}/category/${id}/${urlSlug}`,
            ...buildAlternates(`/category/${id}/${urlSlug}`),
        },
    };
    try {
         const response = await getCategoryBySlug(locale, slug);
         const res = response?.data;
         if (!res) return fallback;

         const meta = res.meta || {};
         const title = meta.title || res.name || fallback.title;
         const description = meta.description?.replace(/<[^>]*>?/gm, '') || res.description || fallback.description;

         let keywords = meta.keyword;
         if (keywords && typeof keywords === 'string' && keywords.startsWith("[")) {
             try {
                 const parsed = JSON.parse(keywords);
                 keywords = parsed.map(k => k.value).join(", ");
             } catch (e) {
                 console.error("Error parsing keywords:", e);
             }
         }

         const ogImage = resolveOgImage(res?.image);

         return {
             metadataBase: new URL(SITE_URL),
             title,
             description,
             keywords: keywords || undefined,
             robots,
             alternates: {
                 canonical: `/${locale}/category/${id}/${urlSlug}`,
                 ...buildAlternates({
                     en: `/category/${id}/${encodeSlugSegment(res.slug_en) || urlSlug}`,
                     ar: `/category/${id}/${encodeSlugSegment(res.slug_ar) || urlSlug}`,
                 }),
             },
            openGraph: {
                 title,
                 description,
                 type: "article",
                 ...(ogImage ? { images: [ogImage] } : {
                     images: [{
                         url: '/og-image.png',
                         width: 1200,
                         height: 630,
                         alt: title,
                     }],
                 }),
             },
             twitter: {
                 card: "summary_large_image",
                 title,
                 description,
                 ...(ogImage ? { images: [ogImage] } : {
                     images: [
                         {
                             url: '/og-image.png',
                             width: 1200,
                             height: 630,
                             alt: title,
                         },
                     ],
                 }),
             }
         };
     } catch (error) {
         console.error("Metadata error:", error);
         const defaultImages = [
             { url: '/og-image.png', width: 1200, height: 630, alt: fallback.title },
         ];
         return {
             ...fallback,
             openGraph: { ...fallback, type: "article", images: defaultImages },
             twitter: {
                 card: "summary_large_image",
                 ...fallback,
                 images: defaultImages,
             },
         };
     }
}

export default async function CategoryPage({ params }) {
    const { locale, id, slug } = await params;
    let categoryData = {};
    try {
        const res = await getCategoryBySlug(locale, slug);
        categoryData = res?.data || {};
    } catch (error) {
        console.error("Failed to fetch category details:", error);
    }

    let coursesData = { courses: [] };
    try {
        const categoryId = categoryData?.id || id;
        const res = await getCourses(locale, `?category_id=${categoryId}`);
        coursesData = res?.data || coursesData;
    } catch (error) {
        console.error("Failed to fetch category courses:", error);
    }

    const categorySchema = categoryData?.name
        ? buildCategoryGraph({
              category: categoryData,
              courses: coursesData?.courses,
              locale,
              routeId: id,
              routeSlug: slug,
              siteUrl: SITE_URL,
          })
        : null;

    return (
        <>
            {categorySchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: safeJsonLdString(categorySchema) }}
                />
            )}
            {categoryData?.slug_en && categoryData?.slug_ar && (
                <AlternatePathsSetter
                    enPath={`/category/${categoryData.id}/${categoryData.slug_en}`}
                    arPath={`/category/${categoryData.id}/${categoryData.slug_ar}`}
                />
            )}
            <CategoryDetails
                initialCategory={categoryData}
                initialCoursesData={coursesData}
                categoryId={categoryData?.id || id}
            />
        </>
    );
}
