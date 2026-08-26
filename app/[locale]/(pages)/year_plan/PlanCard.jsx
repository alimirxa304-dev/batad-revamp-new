"use client";
import styles from "@/sass/pages/year-plan/plan-card.module.scss";
import { ArrowRight, FileText, TvMinimal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const PlanCard = ({ plan }) => {
    const { locale } = useParams();
    const t = useTranslations('YearPlan');

    return (
        <div className={styles.card}>
            <div className={styles.img}>
                <Image src={plan?.image} alt={plan?.name || ""} width={424} height={280} />
                <span className={styles.num}>01</span>
                <span className={styles.icon}><TvMinimal /></span>
            </div>
            <div className={styles.details}>
                <div className={styles.info}>
                    <div className={styles.head}>
                        <h4 className={styles.tag}><FileText color='#1E2749' size={12} /> {plan?.name}</h4>
                        <h2 className={styles.title}>{t('programStructure')}</h2>
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: plan?.summary }} />
                </div>
                <Link href={`/${locale}/printCategory/${plan?.id}`} className={styles.link}>
                    {t('viewYearPlans')} <ArrowRight />
                </Link>
            </div>
        </div>
    );
};

export default PlanCard;
