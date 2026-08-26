import { cache } from "react";
import { getCourseBySlug } from "@/action/courses";
import AlternatePathsSetter from "@/components/common/AlternatePathsSetter";
import {
  SITE_URL,
  BRAND_NAME,
  cleanJsonLd,
  toIsoDate,
  safeJsonLdString,
  encodeSlugSegment,
  resolveContentImageUrl,
  resolveCoursePriceCurrency,
  resolveCourseDescription,
  resolveCourseKeywords,
  buildOrganizationNode,
  buildWebsiteNode,
  buildAlternates,
} from "@/lib/seoMeta";
import CourseDetails from "./CourseDetails";

// generateMetadata and the page component both need the same course — memoize per-request
// so they share one API call instead of two independent (and possibly inconsistent) fetches.
const getCachedCourseBySlug = cache((locale, slug) => getCourseBySlug(locale, slug));

const FALLBACK_COURSE_IMAGE_PATH = "/asstes/details.jpg"; // same fallback CourseDetails.jsx renders on-page
const IMAGE_MIME_TYPES = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

function getImageMimeType(url) {
  const ext = url?.split(".").pop()?.split(/[?#]/)[0]?.toLowerCase();
  return IMAGE_MIME_TYPES[ext] || "image/jpeg";
}

function buildOgImage({ url, alt }) {
  return { url, width: 1200, height: 630, alt, type: getImageMimeType(url) };
}

// Single source of truth for the course image used by both Open Graph (generateMetadata)
// and JSON-LD, so the two channels never advertise different pictures for the same page.
// Falls back to the real on-page fallback (details.jpg) — never the org logo.
function resolveCourseImageUrl(rawImage, siteUrl) {
  return resolveContentImageUrl(rawImage, siteUrl, FALLBACK_COURSE_IMAGE_PATH);
}

function buildCourseGraph({ course, locale, routeId, routeSlug, siteUrl }) {
  const courseId = routeId || course.id;
  const courseSlug = routeSlug || (locale === "ar" ? course.slug_ar : course.slug_en);
  if (!course?.name || !courseId || !courseSlug) return null;

  const courseUrl = `${siteUrl}/${locale}/course_details/${courseId}/${courseSlug}`;
  const organizationId = `${siteUrl}#organization`;
  const websiteId = `${siteUrl}#website`;

  const description = resolveCourseDescription({ course, locale });
  const keywords = resolveCourseKeywords({ course, locale });
  const courseImageUrl = resolveCourseImageUrl(course.image, siteUrl);
  const primaryImageId = `${courseUrl}#primaryimage`;

  const priceNum = parseFloat(course.price);
  const hasValidPrice =
    course.price != null &&
    course.price !== "" &&
    !Number.isNaN(priceNum) &&
    priceNum > 0;
  const priceCurrency = resolveCoursePriceCurrency(course);

  const seenInstanceKeys = new Set();
  const hasCourseInstance =
    Array.isArray(course.dates) && course.dates.length > 0
      ? course.dates
          .filter((session) => session?.date)
          .map((session) => {
            const cityName = session.city?.name || session.city_name;
            const countryCode = session.city?.country_code || session.city?.country;
            const endDate = session.end_date || session.endDate;
            const key = `${session.date}|${endDate || ""}|${cityName || ""}`;
            if (seenInstanceKeys.has(key)) return undefined;
            seenInstanceKeys.add(key);
            return {
              "@type": "CourseInstance",
              startDate: session.date,
              endDate,
              location: cityName
                ? {
                    "@type": "Place",
                    name: cityName,
                    address: {
                      "@type": "PostalAddress",
                      addressLocality: cityName,
                      addressCountry: countryCode,
                    },
                  }
                : undefined,
            };
          })
          .filter(Boolean)
      : undefined;

  const breadcrumbEntries = [
    { name: locale === "ar" ? "الرئيسية" : "Home", url: `${siteUrl}/${locale}` },
  ];
  if (course.category?.id && course.category?.slug && course.category?.name) {
    breadcrumbEntries.push({
      name: course.category.name,
      url: `${siteUrl}/${locale}/category/${course.category.id}/${course.category.slug}`,
    });
  }
  breadcrumbEntries.push({ name: course.name, url: courseUrl });

  const primaryImage = {
    "@type": "ImageObject",
    "@id": primaryImageId,
    url: courseImageUrl,
    contentUrl: courseImageUrl,
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${courseUrl}#webpage`,
    url: courseUrl,
    name: course.name,
    isPartOf: { "@id": websiteId },
    primaryImageOfPage: { "@id": primaryImageId },
    datePublished: toIsoDate(course.created_at),
    dateModified: toIsoDate(course.updated_at),
    inLanguage: locale,
    about: { "@id": `${courseUrl}#course` },
    mainEntity: { "@id": `${courseUrl}#course` },
    breadcrumb: { "@id": `${courseUrl}#breadcrumb` },
  };

  // address/contactPoint intentionally omitted from Organization: no verified street/postal/
  // phone data exists anywhere in this project (the contact_us page pulls freeform label/value
  // content from action/contact.js, not structured PostalAddress fields — mapping it would mean
  // inventing structure that isn't in the source data). Add these back once real data is confirmed.
  const website = buildWebsiteNode(siteUrl);
  const organization = buildOrganizationNode(siteUrl);

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${courseUrl}#breadcrumb`,
    itemListElement: breadcrumbEntries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.url,
    })),
  };

  const courseSchema = {
    "@type": "Course",
    "@id": `${courseUrl}#course`,
    name: course.name,
    description,
    keywords,
    inLanguage: locale,
    url: courseUrl,
    category: course.category?.name,
    provider: { "@id": organizationId },
    image: { "@id": primaryImageId },
    hasCourseInstance,
    offers: hasValidPrice
      ? {
          "@type": "Offer",
          category: "Paid",
          price: String(priceNum),
          priceCurrency,
          availability: "https://schema.org/InStock",
          url: courseUrl,
        }
      : undefined,
  };

  const graph = cleanJsonLd([website, organization, primaryImage, webPage, breadcrumb, courseSchema]);
  if (!graph) return null;

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

export async function generateMetadata({ params }) {
  const { locale, id, slug } = await params;
  const urlSlug = encodeSlugSegment(slug);

  const niceName = slug
    ? decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "training course";

  const fallbackTitle = niceName;
  const fallbackDescription = `Learn about the ${niceName} training course offered by ${BRAND_NAME}.`;
  const fallbackUrl = `${SITE_URL}/${locale}/course_details/${id}/${slug}`;
  const fallbackImage = buildOgImage({ url: `${SITE_URL}/og-image.png`, alt: fallbackTitle });

  const fallback = {
    title: { absolute: fallbackTitle },
    description: fallbackDescription,
    openGraph: {
      title: fallbackTitle,
      description: fallbackDescription,
      type: "website",
      url: fallbackUrl,
      siteName: BRAND_NAME,
      images: [fallbackImage],
    },

    twitter: {
      card: "summary_large_image",
      title: fallbackTitle,
      description: fallbackDescription,
      images: [fallbackImage],
    },
  };
  try {
    const res = await getCachedCourseBySlug(locale, slug);
    const data = res?.data || {};
    const m = data.meta || {};
    const title =
      data.meta_title || m.meta_title || m.title || data.name || fallbackTitle;
    const description = resolveCourseDescription({ course: data, locale }) || fallback.description;
    const keywords = resolveCourseKeywords({ course: data, locale });
    const pageUrl = `${SITE_URL}/${locale}/course_details/${id}/${slug}`;
    const resolvedImageUrl = resolveCourseImageUrl(data?.image, SITE_URL);
    const ogImage = buildOgImage({ url: resolvedImageUrl, alt: title });
    return {
      metadataBase: new URL(SITE_URL),
      title: { absolute: title },
      description,
      keywords,
      alternates: {
        canonical: `/${locale}/course_details/${id}/${urlSlug}`,
        ...buildAlternates({
          en: `/course_details/${id}/${encodeSlugSegment(data.slug_en) || urlSlug}`,
          ar: `/course_details/${id}/${encodeSlugSegment(data.slug_ar) || urlSlug}`,
        }),
      },
      openGraph: {
        title,
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
        title,
        description,
        images: [ogImage],
      },
    };
  } catch (error) {
    console.error("generateMetadata error:", error);
    return fallback;
  }
}

export default async function CourseDetailsPage({ params }) {
  const { locale, id, slug } = await params;
  let courseData = {};
  try {
    const res = await getCachedCourseBySlug(locale, slug);
    courseData = res?.data || {};
  } catch (error) {
    console.error("Failed to fetch course details:", error);
  }

  const courseSchema = courseData?.name
    ? buildCourseGraph({
        course: courseData,
        locale,
        routeId: id,
        routeSlug: slug,
        siteUrl: SITE_URL,
      })
    : null;

  return (
    <>
      {courseSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(courseSchema) }}
        />
      )}
      {courseData?.slug_en && courseData?.slug_ar && (
        <AlternatePathsSetter
          enPath={`/course_details/${id}/${courseData.slug_en}`}
          arPath={`/course_details/${id}/${courseData.slug_ar}`}
        />
      )}
      <CourseDetails initialCourse={courseData} />
    </>
  );
}
