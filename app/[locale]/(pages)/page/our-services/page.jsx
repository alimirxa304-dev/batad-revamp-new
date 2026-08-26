import { getTranslations } from "next-intl/server";
import OurServices from "./OurServices";
import { SITE_URL, cleanMeta, buildAlternates } from "@/lib/seoMeta";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "OurServices" });

    const title = t("title").replace(/\b\w/g, (c) => c.toUpperCase());
    const description = cleanMeta(t("intro"), { maxLength: 160 });

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        alternates: { canonical: `/${locale}/page/our-services`, ...buildAlternates("/page/our-services") },
        openGraph: {
            title,
            description,
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
        },
        twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
    };
}

const OurServicesPage = () => {
    return <OurServices />;
};

export default OurServicesPage;
