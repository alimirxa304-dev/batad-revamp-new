"use client";
import styles from "@/sass/pages/print-category/print-card.module.scss";
import { ArrowRight, Calendar, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const PrintCard = ({ item }) => {
    const t = useTranslations('PrintCategory');
    const { locale } = useParams();

    return (
        <div className={styles.card}>
            <div className={styles.info}>
                <span>{item?.category?.name?.slice(0, 5)}</span>
                <h2>{item?.name}</h2>
                <div className={styles.numOfStudents}>
                    <p><Users color='#4A5565' size={16} /> {item?.numOfStudents || "+600k"} {t('seats')}</p>
                    <span className={styles.dot}></span>
                    <span className={styles.type}>{item?.courseType || 'Advance'}</span>
                </div>
            </div>

            <div className={styles.dates}>
                {item?.dates?.map((date, index) => (
                    <div key={index} className={styles.date1}>
                        <div className={styles.dateTitle}>
                            <Calendar color="#1E2749" size={16} />
                            {t('date')} {index + 1}.
                        </div>
                        <span>{date.date}</span>
                    </div>
                ))}
            </div>

            <div className={styles.durations}>
                <div className={styles.duration}>
                    <p className={styles.durationTitle}>
                        <Clock color="#1E2749" size={16} />
                        {t('duration')}
                    </p>
                    <span>{item.duration || '1-2 week'}</span>
                </div>
                <div className={styles.location}>
                    <div className={styles.locationTitle}>
                        <MapPin color="#1E2749" size={16} />
                        {t('location')}
                    </div>
                    <span className={styles.loctionSpan}>{item?.location || 'USA'}</span>
                </div>
            </div>

            <div className={styles.prices}>
                <h4><span>£</span> {t('pricingOptions')}</h4>
                <div className={styles.list}>
                    {item?.pricing && Object.entries(item.pricing).map(([key, details]) => (
                        <div className={styles.price} key={key}>
                            <span className={styles.label}>{details.name}</span>
                            <span className={styles.value}>{details.price}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.btns}>
                <Link href={`/${locale}/course_details/${item.id}/${encodeURIComponent(item.slug)}`} className={styles.btnDetails}>
                    {t('details')}
                </Link>
                <Link href={`/${locale}/registerCourse?course_id=${item.id}`} className={styles.btnReg}>
                    {t('register')} <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default PrintCard;
