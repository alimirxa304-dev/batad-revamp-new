"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import styles from "@/sass/pages/consulting/consulting-category/consulting-category-card.module.scss";
import { useTranslations } from "next-intl";
// tCommon used for shared terms like 'weeks'

const ConsultingCategoryCard = ({ service }) => {
    const { locale } = useParams();
    const t = useTranslations('Consulting');
    const tCommon = useTranslations();

    return (
        <div className={styles.consultingCategoryCard}>
            <div className={styles.image}>
                <Image src={service.image} alt={service.name} width={403} height={224} />
                <span>{service.duration || `1-2 ${tCommon('weeks')}`}</span>
            </div>
            <div className={styles.content}>
                <div className={styles.info}>
                    <h2>{service.name}</h2>
                    <div
                        dangerouslySetInnerHTML={{ __html: service.description }}
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    />
                </div>
                <span>£{service.prices || '4,500'}</span>
                <Link href={`/${locale}/page/${encodeURIComponent(service.slug)}`} className={styles.viewDetails}>
                    {t('viewDetails')}
                    <ChevronRight />
                </Link>
            </div>
        </div>
    );
};

export default ConsultingCategoryCard;
