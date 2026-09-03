"use client";
import styles from "@/sass/pages/showCities/city-card.module.scss";
import { ChevronRight, Building2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { isPlaceholderImage } from "@/lib/seoMeta";

// Same placeholder pattern used everywhere else (course cards, city/course JSON-LD) —
// reused via lib/seoMeta.js instead of a page-local duplicate. "/images" (no filename)
// is a separate, page-specific data artifact some city `banner` fields have.
const isValidImage = (src) =>
    src && !isPlaceholderImage(src) && !src.endsWith("/images");

// Same venue-card design as the homepage "Courses by City" grid (landmark
// icon, city name), plus the available-course count and an Explore button.
const CityCard = ({ city }) => {
    const { locale } = useParams();
    const t = useTranslations('ShowCities');
    // Button label shared with the homepage city cards ("View Courses").
    const tCity = useTranslations('CourseByCity');
    const [imgError, setImgError] = useState(false);

    const iconSrc = city.icon || city.image;
    const showImage = isValidImage(iconSrc) && !imgError;

    return (
        <div className={styles.card}>
            <span className={styles.icon}>
                {showImage ? (
                    <Image src={iconSrc} alt={city.name} width={200} height={150} onError={() => setImgError(true)} />
                ) : (
                    <Building2 aria-hidden="true" />
                )}
            </span>

            <h3 className={styles.cityName}>{city.name}</h3>

            <p className={styles.count}>
                <span className={styles.countNumber}>{city.courses_count ?? 0}</span> {t('coursesAvailable')}
            </p>

            <Link href={`/${locale}/city/${city.id}/${encodeURIComponent(city.slug)}`} className={styles.link}>
                {tCity('viewCourses')} <ChevronRight aria-hidden="true" />
            </Link>
        </div>
    );
};

export default CityCard;
