import { getMeta } from "@/action/meta";
import Header from "./Header";
import ContactForm from "./ContactForm";
import OurOffices from "./OurOffices";
import styles from "@/sass/pages/contact/contact.module.scss";
import container from "@/sass/components/common/container.module.scss";

import { cleanMeta, parseKeywords, buildAlternates } from "@/lib/seoMeta";

const FALLBACK_TITLE = "Contact Us";
const FALLBACK_DESC = "Contact the British Academy for Training & Development for inquiries, support, or partnership opportunities.";

export async function generateMetadata({ params }) {
    const { locale } = await params;

    let title = FALLBACK_TITLE;
    let description = FALLBACK_DESC;
    let keywords;

    try {
        const res = await getMeta(locale, "contact-us");
        const meta = res?.meta;
        if (meta) {
            title = cleanMeta(meta.title, { maxLength: 60 }) || FALLBACK_TITLE;
            description = cleanMeta(meta.description, { maxLength: 160 }) || FALLBACK_DESC;
            keywords = parseKeywords(meta.keyword);
        }
    } catch (error) {
        console.error("Contact metadata error:", error);
    }

    return {
        title,
        description,
        keywords,
        alternates: { canonical: `/${locale}/contact_us`, ...buildAlternates("/contact_us") },
        openGraph: {
            title,
            description,
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-image.png"],
        },
    };
}
export default async function ContactPage() {
    return (
        <section className={styles.contact}>
            <Header />
            <div className={styles.mainContent}>
                <div className={container.container}>
                    <div className={styles.grid}>
                        <ContactForm />
                        <OurOffices />
                    </div>
                </div>
            </div>
        </section>
    );
}

