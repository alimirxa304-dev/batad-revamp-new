'use client';
import stylesContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/consulting/consulting.module.scss";
import useConsultingStore from "@/store/useConsultingStore";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import According from "../page/FAQ/according";
import ConsultingCard from "./ConsultingCard";
import ExpertCard from "./ExpertCard";
import Header from "./Header";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslations } from "next-intl";
const Consulting = () => {
    const t = useTranslations('Consulting');
    const { data, handleGetConsulting, isLoading } = useConsultingStore();
    const [visibleCount, setVisibleCount] = useState(6);
    useEffect(() => {
        handleGetConsulting("?with_meta=true");
    }, []);

    return (
        <div className={styles.consulting}>
            <Header stats={data?.stats} />
            <div className={styles.mainContent}>
                <div className={styles.content}>
                    <div className={stylesContainer.container}>
                        <section className={styles.consultingCategory}>
                            <div className={styles.heading}>
                                <h2>{t('categoriesTitle')}</h2>
                                <p>{t('categoriesSubtitle')}</p>
                            </div>

                            {
                                isLoading ? (
                                    <div className={styles.consultingCard} >
                                        {
                                            [1, 2, 3, 4, 5, 6].map((item, index) => (
                                                <Skeleton
                                                    type="card"
                                                    height={300}
                                                    width={300}

                                                />
                                            ))
                                        }
                                    </div>

                                ) : (
                                    <div className={styles.consultingCard}>
                                        {data?.items?.slice(0, visibleCount)?.map((item, index) => (
                                            <ConsultingCard key={index} data={item} />
                                        ))}
                                    </div>
                                )
                            }
                            {
                                visibleCount < data?.items?.length && data?.has_more && (
                                    <button className={styles.viewMoreBtn} onClick={() => setVisibleCount(visibleCount + 6)}>{t('viewMore')} <ArrowRight /></button>
                                )
                            }


                        </section>

                    </div>

                    <section className={styles.expertConsultants}>
                        <div className={styles.heading}>
                            <h2>{t('expertsTitle')}</h2>
                            <p>{t('expertsSubtitle')}</p>
                        </div>
                        <div className={styles.expertCards}>
                            {
                                isLoading ? (
                                    <div className={styles.expertCards} >
                                        {
                                            [1, 2, 3, 4].map((item, index) => (
                                                <Skeleton
                                                    type="card"
                                                    height={300}
                                                    width={300}

                                                />
                                            ))
                                        }
                                    </div>

                                ) : (
                                    data?.advisors?.map((item, index) => (
                                        <ExpertCard key={index} data={item} />
                                    ))
                                )
                            }

                        </div>

                    </section>


                    <div className={stylesContainer.container}>
                        <section className={styles.frequentlyQuestions}>
                            <div className={styles.heading}>
                                <h2>{t('faqTitle')}</h2>
                                <p>{t('faqSubtitle')}</p>
                            </div>
                            <div className={styles.questions}>
                                {
                                    isLoading ? (
                                        <div className={styles.questions} >
                                            {
                                                [1, 2, 3, 4].map((item, index) => (
                                                    <Skeleton
                                                        type="card"
                                                        height={100}
                                                        width='100%'

                                                    />
                                                ))
                                            }
                                        </div>

                                    ) : (

                                        data?.faqs?.map((item, index) => (
                                            <According key={index} {...item} />
                                        ))

                                    )
                                }
                            </div>

                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Consulting;