import AlternatePathsSetter from "@/components/common/AlternatePathsSetter";
import PrintCategory from "./PlanDetails";
import { getPlanById } from "@/action/plans";
import { resolveOgImage, SITE_URL } from "@/lib/seoMeta";
export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const fallback = {
    title: `Print Category${id ? ` #${id}` : ""}  `,
    description:
      "Printable category view from the British Academy for Training & Development.",
  };

  try {
    const response = await getPlanById(locale, id);
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
       alternates: {
              canonical: `/${locale}/printCategory/${id}`,
              languages: {
                en: `${SITE_URL}/en/printCategory/${id}`,
                ar: `${SITE_URL}/ar/printCategory/${id}`,
                "x-default": `${SITE_URL}/en/printCategory/${id}`,
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
    return { ...fallback, openGraph: { ...fallback, type: "article" } };
  }
}

export default async function PrintCategoryDetailsPage() {
  return <PrintCategory />;
}
