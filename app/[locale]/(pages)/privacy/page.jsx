import Privacy from "./Privacy";
import { SITE_URL, buildAlternates } from "@/lib/seoMeta";

const FALLBACK_TITLE = "Privacy Policy";
const FALLBACK_DESC = "Read the privacy policy of the British Academy for Training & Development — how we collect, use, and protect your data.";

export async function generateMetadata({ params }) {
    const { locale } = await params;

    return {
        metadataBase: new URL(SITE_URL),
        title: FALLBACK_TITLE,
        description: FALLBACK_DESC,
        alternates: { canonical: `/${locale}/privacy`, ...buildAlternates("/privacy") },
        openGraph: {
            title: FALLBACK_TITLE,
            description: FALLBACK_DESC,
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: FALLBACK_TITLE }],
        },
        twitter: {
            card: "summary_large_image",
            title: FALLBACK_TITLE,
            description: FALLBACK_DESC,
            images: ["/og-image.png"],
        },
    };
}

const PrivacyPage = () => {
    return <Privacy />;
};

export default PrivacyPage;
