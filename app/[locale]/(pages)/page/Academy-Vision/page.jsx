import { getTranslations } from "next-intl/server";
import AcademyVision from "./AcademyVision";
import { SITE_URL, cleanMeta, buildAlternates } from "@/lib/seoMeta";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "AcademyVision" });

    const title = t("title");
    const description = cleanMeta(t("overview.text1"), { maxLength: 160 });

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        alternates: { canonical: `/${locale}/page/Academy-Vision`, ...buildAlternates("/page/Academy-Vision") },
        openGraph: {
            title,
            description,
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
        },
        twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
    };
}

const AcademyVisionPage = () => {
    return <AcademyVision />;
};

export default AcademyVisionPage;
