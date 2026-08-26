import { getMeta } from "@/action/meta";
import { getFaqs } from "@/action/faqs";
import FQA from "./FQA"
import {
    SITE_URL,
    cleanMeta,
    cleanJsonLd,
    parseKeywords,
    buildAlternates,
    safeJsonLdString,
    buildFAQPageSchema,
} from "@/lib/seoMeta";

const FALLBACK_TITLE = "Frequently Asked Questions";
const FALLBACK_DESC = "Frequently asked questions about courses, registration, and services at the British Academy for Training & Development.";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const slug = "frequently-asked-questions-british-academy-for-training-development";

    let title = FALLBACK_TITLE;
    let description = FALLBACK_DESC;
    let keywords;

    try {
        const res = await getMeta(locale, slug);
        const meta = res?.meta;
        if (meta) {
            title = cleanMeta(meta.title, { maxLength: 65 }) || FALLBACK_TITLE;
            description = cleanMeta(meta.description, { maxLength: 160 }) || FALLBACK_DESC;
            keywords = parseKeywords(meta.keyword);
        }
    } catch (error) {
        console.error("FAQ metadata error:", error);
    }

    return {
        title,
        description,
        keywords,
        alternates: { canonical: `/${locale}/page/FAQ`, ...buildAlternates("/page/FAQ") },
        openGraph: {
            title,
            description,
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
        },
        twitter: { card: "summary_large_image", title, description, images: ["/og-image.png"] },
    };
}


// Same GET /faqs the client-side FQA.jsx/useFaqsStore call for the interactive
// accordion (see action/faqs.js) — fetched again here, server-side only, purely to
// build the FAQPage schema from the exact same real questions/answers already shown
// on the page. `popular` is always a subset of `faqs` (verified live), so `faqs`
// alone already covers every question rendered anywhere on the page — no dedup needed.
async function buildFaqPageGraph(locale) {
    try {
        const res = await getFaqs(locale);
        const faqs = res?.data?.faqs || [];
        if (faqs.length === 0) return null;

        const faqUrl = `${SITE_URL}/${locale}/page/FAQ`;
        const faqSchema = buildFAQPageSchema(
            faqs
                .filter((f) => f?.question && f?.answer)
                .map((f) => ({ question: f.question, answer: f.answer })),
            faqUrl
        );
        const graph = cleanJsonLd([faqSchema]);
        if (!graph) return null;

        return { "@context": "https://schema.org", "@graph": graph };
    } catch (error) {
        console.error("FAQ JSON-LD error:", error);
        return null;
    }
}

const FqaPage = async ({ params }) => {
    const { locale } = await params;
    const faqSchema = await buildFaqPageGraph(locale);

    return (
        <>
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: safeJsonLdString(faqSchema) }}
                />
            )}
            <FQA />
        </>
    );
};

export default FqaPage;