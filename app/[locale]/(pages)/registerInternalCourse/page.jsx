import { getMeta } from "@/action/meta";
import RegisterInternalCourse from "./RegisterInternalCourse";
import { SITE_URL, buildAlternates } from "@/lib/seoMeta";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const slug = "register-your-course-british-academy-for-training-development";

    const fallback = {
        metadataBase: new URL(SITE_URL),
        title: "Register Your Course ",
        description: "Ready to start your professional journey? Fill out the form to register for your chosen course and take the first step towards achieving your goals.",
        alternates: { canonical: `/${locale}/registerInternalCourse`, ...buildAlternates("/registerInternalCourse") },
    };

    try {
        const res = await getMeta(locale, slug);
        const meta = res?.meta;
        if (!meta) return fallback;

        const title = meta?.title || fallback.title;
        const description = meta?.description?.replace(/<[^>]*>?/gm, '') || fallback.description;

        let keywords = meta?.keyword;
        if (keywords && typeof keywords === 'string' && keywords.startsWith("[")) {
            try {
                const parsed = JSON.parse(keywords);
                keywords = parsed.map(k => k.value).join(", ");
            } catch (e) {
                console.error("Error parsing keywords:", e);
            }
        }

        return {
            metadataBase: new URL(SITE_URL),
            title,
            description,
            keywords: keywords || undefined,
            alternates: { canonical: `/${locale}/registerInternalCourse`, ...buildAlternates("/registerInternalCourse") },
   openGraph: {
                title,
                description,
                type: "website",
                siteName: "British Academy for Training & Development",
                images: [
                    {
                        url: '/og-image.png',
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
            },

            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [{ url: '/og-image.png', width: 1200, height: 630 }],
            },        };
    } catch (error) {
        console.error("Metadata error:", error);
        return fallback;
    }
}

export default function RegisterInternalCoursePage() {
    return <RegisterInternalCourse />;
}