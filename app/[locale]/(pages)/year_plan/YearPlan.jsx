'use client';
import { useEffect, useState } from "react";
import usePlansStore from "@/store/usePlansStore";
import Header from "./Header";
import PlanCard from "./PlanCard";
import styles from "@/sass/pages/year-plan/year-plan.module.scss";
import stylesContainer from "@/sass/components/common/container.module.scss";
import Skeleton from "@/components/ui/Skeleton";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

const YearPlan = () => {
    const t = useTranslations('YearPlan');
    const { data, handleGetPlans, isLoading } = usePlansStore();
    const [visibleCount, setVisibleCount] = useState(10);
    const items = data?.data?.items || [];

    useEffect(() => {
        handleGetPlans();
    }, []);

    const handleViewMore = () => {
        if (data?.courses && visibleCount < data.courses.length) {
            setVisibleCount(prev => prev + 6);
        } else if (data?.has_more) {
            setVisibleCount(prev => prev + 6);
            const params = new URLSearchParams(window.location.search);
            params.set('cursor', data.next_cursor);
            handleGetPlans(`?${params.toString()}`, true);
        }
    };

    return (
        <div className={styles.main}>
            <Header />
            {isLoading ? (
                <div className={styles.wrapper}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                        <Skeleton type='card' height={100} key={i} />
                    ))}
                </div>
            ) : (
                <div className={styles.mainContent}>
                    <div className={stylesContainer.container}>
                        <div className={styles.wrapper}>
                            {items?.slice(0, visibleCount).map(item => (
                                <PlanCard key={item.id} plan={item} />
                            ))}
                        </div>
                        {(visibleCount < (data?.courses?.length || 0) || data?.has_more) && (
                            <button className={styles.viewMore} onClick={handleViewMore}>
                                {t('viewMore')} <ArrowRight />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default YearPlan;
