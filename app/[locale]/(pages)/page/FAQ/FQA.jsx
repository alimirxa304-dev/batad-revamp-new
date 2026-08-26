"use client";
import styles from "@/sass/pages/fqa/fqa.module.scss";
import Header from "./Header";
import SearchInput from "../../blog/Search";
import { TrendingUp } from "lucide-react";
import According from "./according";
import useFaqsStore from "@/store/useFaqsStore";
import Skeleton from "@/components/ui/Skeleton";
import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const FQA = () => {
    const t = useTranslations('FAQ');
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { handleGetFaqs, faqs, popular, isLoading } = useFaqsStore();

    useEffect(() => {
        const paramsString = searchParams.toString();
        const queryString = paramsString ? `?${paramsString}` : "";
        handleGetFaqs(queryString);
    }, [searchParams, handleGetFaqs]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const popularFaqs = popular?.length > 0 ? popular : faqs?.slice(0, 4) || [];
    const allFaqs = faqs || [];

    return (
        <section className={styles.fqa}>
            <Header />
            <div className={styles.mainContent}>
                <SearchInput updateFilter={updateFilter} />
                <div className={styles.faqContent}>
                    <div className={styles.popularFQA}>
                        <div className={styles.header}>
                            <span><TrendingUp size={20} color="#FFFFFF" /></span>
                            <div className={styles.content}>
                                <h2>{t('popularTitle')}</h2>
                                <p>{t('popularSubtitle')}</p>
                            </div>
                        </div>
                        <div className={styles.faqList}>
                            {isLoading ? (
                                <>
                                    <Skeleton style={{ height: "56px", borderRadius: "8px" }} />
                                    <Skeleton style={{ height: "56px", borderRadius: "8px" }} />
                                    <Skeleton style={{ height: "56px", borderRadius: "8px" }} />
                                    <Skeleton style={{ height: "56px", borderRadius: "8px" }} />
                                </>
                            ) : (
                                popularFaqs.slice(0, 4).map((faq) => (
                                    <According key={faq.id} question={faq.question} answer={faq.answer} />
                                ))
                            )}
                        </div>
                    </div>

                    <div className={styles.allFQA}>
                        <div className={styles.header}>
                            <h2>{t('allTitle')}</h2>
                            <p>{isLoading ? "..." : t('questionsFound', { count: allFaqs.length })}</p>
                        </div>
                        <div className={styles.listFQA}>
                            {isLoading ? (
                                <>
                                    <Skeleton style={{ height: "56px", borderRadius: "8px" }} />
                                    <Skeleton style={{ height: "56px", borderRadius: "8px" }} />
                                    <Skeleton style={{ height: "56px", borderRadius: "8px" }} />
                                    <Skeleton style={{ height: "56px", borderRadius: "8px" }} />
                                    <Skeleton style={{ height: "56px", borderRadius: "8px" }} />
                                    <Skeleton style={{ height: "56px", borderRadius: "8px" }} />
                                </>
                            ) : (
                                allFaqs.map((faq) => (
                                    <According key={faq.id} variant="all" question={faq.question} answer={faq.answer} />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FQA;
