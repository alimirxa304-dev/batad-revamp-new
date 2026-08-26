"use client";
import Image from "next/image";
import styles from "@/sass/pages/consulting/consulting-card.module.scss";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import defaultImage from "/public/asstes/default-1.jpeg";

const ConsultingCard = ({ data }) => {
    const { locale } = useParams();
    const t = useTranslations('Consulting');

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <Image src={data?.image || defaultImage} alt={data?.name || "consulting"} width={403} height={192} />
                <div className={styles.cardHeader}>
                    <h3>{data?.name}</h3>
                </div>
            </div>
            <div className={styles.body}>
                <div dangerouslySetInnerHTML={{ __html: data?.description?.substring(0, 50) }} />
                <Link href={`/${locale}/consulting/${encodeURIComponent(data?.slug || "")}`}>
                    {t('viewMore')} <ChevronRight />
                </Link>
            </div>
        </div>
    );
};

export default ConsultingCard;
