"use client";
import styles from "@/sass/pages/showCities/city-card.module.scss";
import { ChevronRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { isPlaceholderImage } from "@/lib/seoMeta";

const formatStat = (n) => {
    if (!n) return "0";
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
    return String(n);
};

// Same placeholder pattern used everywhere else (course cards, city/course JSON-LD) —
// reused via lib/seoMeta.js instead of a page-local duplicate. "/images" (no filename)
// is a separate, page-specific data artifact some city `banner` fields have.
const isValidImage = (src) =>
    src && !isPlaceholderImage(src) && !src.endsWith("/images");

const CityCard = ({ city }) => {
    const { locale } = useParams();
    const t = useTranslations('ShowCities');
    const [imgError, setImgError] = useState(false);

    const showImage = isValidImage(city.image) && !imgError;

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                {showImage ? (
                    <Image src={city.image} alt={city.name} width={302} height={224} onError={() => setImgError(true)} />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <MapPin size={64} aria-hidden="true" />
                    </div>
                )}
                <div className={styles.location}>
                    <span>
                        <MapPin aria-hidden="true" />
                        {city.country?.name || ""}
                    </span>
                    <p className={styles.cityName}>{city.name}</p>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.item}>
                        <p className={styles.statNumber}>{city.courses_count}</p>
                        <span>{t('coursesAvailable')}</span>
                    </div>
                    <div className={styles.item}>
                        <p className={styles.statNumber}>{formatStat(city.students_count)}</p>
                        <span>{t('totalStudents')}</span>
                    </div>
                </div>
                <Link href={`/${locale}/city/${city.id}/${encodeURIComponent(city.slug)}`} className={styles.link}>
                    {t('exploreCourses')} <ChevronRight aria-hidden="true" />
                </Link>
            </div>
        </div>
    );
};

export default CityCard;
