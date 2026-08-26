import { getConsultingDetailsBySlug } from "@/action/consulting";
import AlternatePathsSetter from "@/components/common/AlternatePathsSetter";
import { resolveOgImage, SITE_URL } from "@/lib/seoMeta";
import { notFound } from "next/navigation";
import stylesContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/consulting/consulting-details/consulting-details.module.scss";
import { Check } from "lucide-react";
import BookConsultation from "./BookConsultation";
import ClientTestimonials from "./ClientTestimonials";
import Header from "./Header";
import NavgationBar from "./NavgationBar";
import Overview from "./Overview";
import Process from "./Process";

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;

  const niceName = slug
    ? decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Consulting Service";

  const fallbackTitle = niceName;
  const fallbackDescription = `Learn about the ${niceName} consulting service offered by the British Academy for Training & Development.`;

  const fallback = {
    title: fallbackTitle,
    description: fallbackDescription,
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    openGraph: {
      title: fallbackTitle,
      description: fallbackDescription,
      type: "article",
      locale: locale === "ar" ? "ar_AR" : "en_US",
      siteName: "British Academy for Training & Development",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: fallbackTitle,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: fallbackTitle,
      description: fallbackDescription,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
  };

  try {
    const response = await getConsultingDetailsBySlug(locale, slug);
    const res = response?.data;
    console.log(res, "res resres");
    if (!res) return fallback;

    const meta = res.meta || {};
    const title = meta?.title || res.name || fallback.title;
    const description =
      meta?.description?.replace(/<[^>]*>?/gm, "") ||
      res.description ||
      fallback.description;

    let keywords = meta?.keyword;
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
        canonical: `/${locale}/consulting/page/${slug}`,
        languages: {
          en: `${SITE_URL}/en/consulting/page/${slug}`,
          ar: `${SITE_URL}/ar/consulting/page/${slug}`,
          "x-default": `${SITE_URL}/en/consulting/page/${slug}`,
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

export default async function ConsultingDetailsPage({ params }) {
  const { locale, slug } = await params;
  const res = await getConsultingDetailsBySlug(locale, slug);
  const consultingData = res?.data;

  // No matching consulting service for this slug (e.g. a stray /page/{slug}
  // left over from the old site, or any other typo/case mismatch) — render a
  // real 404 instead of letting Overview/NavgationBar/etc. render against
  // empty data, which previously crashed the whole request with a 500.
  if (!consultingData?.id) {
    notFound();
  }

  return (
    <>
      {consultingData?.slug_en && consultingData?.slug_ar && (
        <AlternatePathsSetter
          enPath={`/page/${consultingData.slug_en}`}
          arPath={`/page/${consultingData.slug_ar}`}
        />
      )}

      <NavgationBar breadcrumb={consultingData?.breadcrumb} />
      <Header name={consultingData?.name} />
      <div className={styles.mainContent}>
        <div className={stylesContainer.container}>
          <div className={styles.wrapper}>
            <div className={styles.left}>
              <Overview overview={consultingData?.overview} />
              <Process process={consultingData?.process} />
              <ClientTestimonials testimonials={consultingData?.testimonials} />
            </div>
            <div className={styles.right}>
              <BookConsultation
                bookPackage={consultingData?.package}
                consultingServiceId={consultingData?.id}
              />
              <div className={styles.chooseUs}>
                <h3>{consultingData?.why_choose_us?.title}</h3>
                <ul>
                  {consultingData?.why_choose_us?.items?.map((item, index) => (
                    <li key={index}>
                      <Check size={16} color="#009966" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
