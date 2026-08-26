'use client';
import styleContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/print-category/print-category.module.scss";
import usePlansStore from "@/store/usePlansStore";
import { useEffect, useState } from "react";
import Header from "./Header";
import Print from "./print";
import PrintCard from "./PrintCardV2";
import { useParams, useSearchParams } from "next/navigation";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

const PrintCategory = () => {
    const searchParams = useSearchParams();
    const { id } = useParams()
    const search = searchParams.get('search') || '';
    const [visibleCount, setVisibleCount] = useState(4);
    const { handleGetPlanById, plan, isLoading } = usePlansStore();

    const t = useTranslations('YearPlan')

    console.log(plan, 'plan')

    const items = plan?.courses?.items || [];
    const handleViewMore = () => {
        if (plan?.courses && visibleCount < plan.courses.items.length) {
            setVisibleCount(prev => prev + 6);
        } else if (plan?.courses?.has_more) {
            setVisibleCount(prev => prev + 6);
            const params = new URLSearchParams(window.location.search);
            params.set('cursor', plan?.courses?.next_cursor);
            handleGetPlanById(id, `?${params.toString()}`, true);
        }
    };
    useEffect(() => {
        handleGetPlanById(id);
    }, []);

    return (
        <>
            {
                isLoading ? (
                    <div className={styles.list}>
                        {
                            [1, 2, 3, 4, 5].map(i => (
                                <Skeleton key={i} type="card" height='100px' />
                            ))
                        }

                    </div>

                ) : (
                    <section className={styles.printCategory}>
                        <Header name={plan?.name} summary={plan?.summary} />
                        <Print />

                        <div className={styles.mainContent}>

                            <div className={styleContainer.container}>
                                <div className={styles.list}>
                                    {
                                        items?.slice(0, visibleCount).map((item) => (
                                            <PrintCard key={item.id} item={item} />
                                        ))
                                    }

                                </div>

                                {(visibleCount < (plan?.courses?.items?.length || 0) || plan?.courses?.has_more) && (
                                    <button className={styles.showMore} onClick={handleViewMore}>
                                        {t('viewMore')} <ArrowRight />
                                    </button>
                                )}

                            </div>


                        </div>

                    </section>
                )
            }
        </>
    )
}

export default PrintCategory