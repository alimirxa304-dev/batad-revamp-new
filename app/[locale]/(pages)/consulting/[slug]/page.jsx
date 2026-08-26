import { getConsultantWithService } from "@/action/consulting";
import AlternatePathsSetter from "@/components/common/AlternatePathsSetter";
import { resolveOgImage, SITE_URL } from "@/lib/seoMeta";
import ConsultingService from "./ConsultingService";

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;

  const niceName = slug
    ? decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Consulting";

  const fallback = {
    metadataBase: new URL(SITE_URL),
    title: `${niceName} `,
    description: `Learn more about ${niceName} consulting services offered by the British Academy for Training & Development.`,
  };

  try {
    const response = await getConsultantWithService(locale, slug);
    const res = response?.data;
    if (!res) {
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

    const ogImage = resolveOgImage(res.image);

    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      keywords: keywords || undefined,
      alternates: {
        canonical: `/${locale}/consulting/${slug}`,
        languages: {
          en: `${SITE_URL}/en/consulting/${slug}`,
          ar: `${SITE_URL}/ar/consulting/${slug}`,
          "x-default": `${SITE_URL}/en/consulting/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        type: "article",
        locale: locale === "ar" ? "ar_AR" : "en_US",
        alternateLocale: locale === "ar" ? ["en_US"] : ["ar_AR"],
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

export default async function ConsultingServicePage({ params, searchParams }) {
  const { locale, slug } = await params;
  const resolvedSearchParams = await searchParams;
  const paramsString = new URLSearchParams(resolvedSearchParams).toString();
  const queryString = paramsString ? `?${paramsString}` : "";

  let serviceData = {};
  try {
    const res = await getConsultantWithService(locale, slug, queryString);
    serviceData = res?.data || {};
    console.log(serviceData, "params in consulting details page");
  } catch (error) {
    console.error("Failed to fetch consulting details:", error);
  }
  return (
    <>
      {serviceData?.slug_en && serviceData?.slug_ar && (
        <AlternatePathsSetter
          enPath={`/consulting/${serviceData.slug_en}`}
          arPath={`/consulting/${serviceData.slug_ar}`}
        />
      )}
      <ConsultingService serviceData={serviceData} />
    </>
  );
}
