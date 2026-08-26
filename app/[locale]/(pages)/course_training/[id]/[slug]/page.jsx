import AlternatePathsSetter from "@/components/common/AlternatePathsSetter";
import { getSpecializationBySlug } from "@/action/categories";
import { getCourses } from "@/action/courses";
import SpecializationDetails from "./SpecializationDetails";
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
// not a specialization-specific photo that would be wrong for every other specialization.
const FALLBACK_SPECIALIZATION_IMAGE_PATH = "/asstes/details.jpg";

// Same shape as city/[id]/[slug]'s buildCityGraph, minus the Place/FAQPage nodes that
// are specific to the "city" concept — WebSite/Organization/BreadcrumbList/ItemList are
// all shared helpers from lib/seoMeta.js, nothing duplicated here.
function buildSpecializationGraph({ specialization, courses, locale, routeId, routeSlug, siteUrl }) {
  const specId = routeId || specialization.id;
  const specSlug = routeSlug || (locale === "ar" ? specialization.slug_ar : specialization.slug_en);
  if (!specialization?.name || !specId || !specSlug) return null;

  const specUrl = `${siteUrl}/${locale}/course_training/${specId}/${specSlug}`;
  const organizationId = `${siteUrl}#organization`;
  const websiteId = `${siteUrl}#website`;
  const primaryImageId = `${specUrl}#primaryimage`;

  const specImageUrl = resolveSocialImage({
    image: specialization.image,
    fallbackImage: FALLBACK_SPECIALIZATION_IMAGE_PATH,
    siteUrl,
  });
  const pageDescription =
    cleanMeta(specialization?.meta?.description || specialization?.description) || specialization.name;

  const website = buildWebsiteNode(siteUrl);
  const organization = buildOrganizationNode(siteUrl);

  const specImage = {
    "@type": "ImageObject",
    "@id": primaryImageId,
    url: specImageUrl,
    contentUrl: specImageUrl,
  };

  const itemListSchema = buildCourseItemListSchema({
    courses,
    locale,
    siteUrl,
    id: `${specUrl}#course-list`,
    name:
      locale === "ar"
        ? `الدورات التدريبية المتاحة في ${specialization.name}`
        : `Training courses available in ${specialization.name}`,
    description:
      locale === "ar"
        ? `استعرض الدورات التدريبية في تخصص ${specialization.name} التي تقدمها الأكاديمية البريطانية.`
        : `Browse the training courses in the ${specialization.name} specialization offered by the British Academy.`,
    organizationId,
  });

  const webPage = {
    "@type": "WebPage",
    "@id": `${specUrl}#webpage`,
    url: specUrl,
    name: specialization.name,
    description: pageDescription,
    isPartOf: { "@id": websiteId },
    mainEntity: itemListSchema ? { "@id": `${specUrl}#course-list` } : undefined,
    primaryImageOfPage: { "@id": primaryImageId },
    breadcrumb: { "@id": `${specUrl}#breadcrumb` },
    inLanguage: locale,
  };

  // No dedicated "browse all specializations" page exists — /search_course's sidebar
  // filter is the real, existing destination that lists every specialization, same role
  // /show_cities plays for city's own "All Cities" breadcrumb entry.
  const breadcrumb = buildBreadcrumbSchema(
    [
      { name: locale === "ar" ? "الرئيسية" : "Home", url: `${siteUrl}/${locale}` },
      { name: locale === "ar" ? "كل التخصصات" : "All Specializations", url: `${siteUrl}/${locale}/search_course` },
      { name: specialization.name, url: specUrl },
    ],
    specUrl
  );

  const graph = cleanJsonLd([website, organization, specImage, webPage, breadcrumb, itemListSchema]);
  if (!graph) return null;

  return { "@context": "https://schema.org", "@graph": graph };
}

export async function generateMetadata({ params, searchParams }) {
  const { locale, id, slug } = await params;
  const sp = await searchParams;
  // Any filter param on top of the fixed specialization id/slug (category_id,
  // city_id, featured, has_approval, discounted, tag, min_price, max_price, type)
  // makes this one of an unbounded number of filtered result combinations — only
  // the bare /course_training/[id]/[slug] listing is meant to be indexed. Same rule
  // already applied to /search_course.
  const isFiltered = Object.keys(sp || {}).length > 0;
  const robots = { index: !isFiltered, follow: true };
  const name = slug
    ? decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Category";
  const urlSlug = encodeSlugSegment(slug);
  const fallback = {
    metadataBase: new URL(SITE_URL),
    title: `Training Courses in ${name} `,
    description: `Explore training courses available in ${name} from the British Academy for Training & Development.`,
    robots,
    alternates: {
      canonical: `/${locale}/course_training/${id}/${urlSlug}`,
      ...buildAlternates(`/course_training/${id}/${urlSlug}`),
    },
  };
  try {
    const response = await getSpecializationBySlug(locale, slug);
    const res = response?.data;
    if (!res) return fallback;

    const meta = res.meta || {};
    const title = meta.title || res.name || fallback.title;
    const description =
      meta.description?.replace(/<[^>]*>?/gm, "") ||
      res.description ||
      fallback.description;

    let keywords = meta.keyword;
    if (keywords && typeof keywords === "string" && keywords.startsWith("[")) {
      try {
        const parsed = JSON.parse(keywords);
        keywords = parsed.map((k) => k.value).join(", ");
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
        canonical: `/${locale}/course_training/${id}/${urlSlug}`,
        ...buildAlternates({
          en: `/course_training/${id}/${encodeSlugSegment(res.slug_en) || urlSlug}`,
          ar: `/course_training/${id}/${encodeSlugSegment(res.slug_ar) || urlSlug}`,
        }),
      },
      openGraph: {
        title,
        description,
        type: "article",
        ...(ogImage
          ? { images: [ogImage] }
          : {
              images: [
                {
                  url: "/og-image.png",
                  width: 1200,
                  height: 630,
                  alt: title,
                },
              ],
            }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(ogImage
          ? { images: [ogImage] }
          : {
              images: [
                {
                  url: "/og-image.png",
                  width: 1200,
                  height: 630,
                  alt: title,
                },
              ],
            }),
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    const defaultImages = [
      { url: "/og-image.png", width: 1200, height: 630, alt: fallback.title },
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

export default async function SpecializationPage({ params }) {
  const { locale, id, slug } = await params;
  let specialData = {};
  try {
    const res = await getSpecializationBySlug(locale, slug);
    specialData = res?.data || {};
  } catch (error) {
    console.error("Failed to fetch specialization details:", error);
  }

  let coursesData = { courses: [] };
  try {
    const specializationId = specialData?.id || id;
    const res = await getCourses(locale, `?specialization_id=${specializationId}`);
    coursesData = res?.data || coursesData;
  } catch (error) {
    console.error("Failed to fetch specialization courses:", error);
  }

  const specializationSchema = specialData?.name
    ? buildSpecializationGraph({
        specialization: specialData,
        courses: coursesData?.courses,
        locale,
        routeId: id,
        routeSlug: slug,
        siteUrl: SITE_URL,
      })
    : null;

  return (
    <>
      {specializationSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(specializationSchema) }}
        />
      )}
      {specialData?.slug_en && specialData?.slug_ar && (
        <AlternatePathsSetter
          enPath={`/course_training/${specialData.id}/${specialData.slug_en}`}
          arPath={`/course_training/${specialData.id}/${specialData.slug_ar}`}
        />
      )}
      <SpecializationDetails
        initialSpecialization={specialData}
        initialCoursesData={coursesData}
        specializationId={specialData?.id || id}
      />
    </>
  );
}
