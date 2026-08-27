'use client'
import { useEffect } from "react";
import { motion } from "framer-motion";
import Title from "@/components/common/Title";
import styleContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/home/course-by-city.module.scss";
import useCitiesStore from "@/store/useCitiesStore";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Skeleton from "@/components/ui/Skeleton";
import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

// Venue-style card: skyline icon, city name, "View Courses" link.
const CityCard = ({ city, locale, viewCourses }) => (
    <motion.div
        className={styles.cityCard}
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
    >
        <Link
            href={`/${locale}/city/${city.id}/${encodeURIComponent(city.slug)}`}
            className={styles.cityCardInner}
            title={city.name}
        >
            <span className={styles.cityIcon}>
                {city.icon || city.image ? (
                    <Image
                        src={city.icon || city.image}
                        alt={city.name}
                        width={140}
                        height={100}
                    />
                ) : (
                    <Building2 aria-hidden="true" />
                )}
            </span>
            <h3 className={styles.cityName}>{city.name}</h3>
            <span className={styles.cityLink}>
                {viewCourses}
                {locale === 'ar' ? <ArrowLeft size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
            </span>
        </Link>
    </motion.div>
)

const CourseByCity = () => {
    const t = useTranslations('CourseByCity')
    const { locale } = useParams();
    const { handleGetCities, cities, isLoading } = useCitiesStore();

    useEffect(() => {
        handleGetCities();
    }, []);

    return (
        <section>
            <div className={styleContainer.container}>
                <Title title={t('title')} span={t('titleSpan')} subtitle={t('subtitle')} />

                {
                    isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <Skeleton type="card" className={styles.skeletonCard} />
                            <Skeleton type="card" className={styles.skeletonCard} />
                            <Skeleton type="card" className={styles.skeletonCard} />
                            <Skeleton type="card" className={styles.skeletonCard} />
                        </div>
                    ) : (
                        <>
                            <div className={styles.citiesGrid}>
                                {cities?.slice(0, 6).map((city) => (
                                    <CityCard
                                        key={city.id}
                                        city={city}
                                        locale={locale}
                                        viewCourses={t('viewCourses')}
                                    />
                                ))}
                            </div>
                            <div className={styles.allCitiesWrap}>
                                <Link href={`/${locale}/show_cities`} className={styles.allCitiesBtn}>
                                    {t('allCities')}
                                </Link>
                            </div>
                        </>
                    )
                }

            </div>
        </section>
    );
};

export default CourseByCity;
