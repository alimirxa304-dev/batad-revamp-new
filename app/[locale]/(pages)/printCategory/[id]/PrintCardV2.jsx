"use client";
import styles from "@/sass/pages/print-category/print-card-v2.module.scss";
import { ArrowRight, Calendar, Clock, MapPin, Users, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const PrintCardV2 = ({ item }) => {
    const t = useTranslations('PrintCategory');
    const tCommon = useTranslations();
    const { locale } = useParams();

    const firstTwoDates = item?.dates?.slice(0, 2) || [];
    const pricingEntries = item?.pricing ? Object.entries(item.pricing) : [];

    return (
        <div className={styles.card}>

            {/* ── Left: Info ── */}
            <div className={styles.info}>
                <div className={styles.tags}>
                    {item?.category?.name && (
                        <span className={styles.categoryTag}>{item.category.name}</span>
                    )}
                    {item?.certified && (
                        <span className={styles.certifiedTag}>
                            <BadgeCheck size={11} /> Certified
                        </span>
                    )}
                </div>
                <h2 className={styles.title}>{item?.name}</h2>
                <div className={styles.meta}>
                    <span className={styles.seats}>
                        <Users size={13} color="#4A5565" />
                        {item?.numOfStudents || "+600k"} {t('seats')}
                    </span>
                    {item?.week_number && (
                        <span className={styles.weekBadge}>
                            <Clock size={12} /> {item.week_number} weeks
                        </span>
                    )}
                </div>
            </div>

            {/* ── Middle: Dates + Location ── */}
            <div className={styles.middle}>
                <div className={styles.dates}>
                    {firstTwoDates.map((d, i) => (
                        <div key={i} className={styles.dateItem}>
                            <div className={styles.dateLabel}>
                                <Calendar size={13} color="#1E2749" />
                                <span>{t('date')} {i + 1}</span>
                            </div>
                            <span className={styles.dateValue}>{d.date}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.details}>
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>
                            <Clock size={13} color="#1E2749" />
                            <span>{t('duration')}</span>
                        </div>
                        <span className={styles.detailValue}>
                            {item?.week_number ? `${item.week_number} ${tCommon('weeks')}` : `1-2 ${tCommon('weeks')}`}
                        </span>
                    </div>
                    <div className={styles.detailItem}>
                        <div className={styles.detailLabel}>
                            <MapPin size={13} color="#1E2749" />
                            <span>{t('location')}</span>
                        </div>
                        <span className={styles.detailValue}>{item?.location || 'London'}</span>
                    </div>
                </div>
            </div>

            {/* ── Pricing ── */}
            <div className={styles.pricing}>
                <h4 className={styles.pricingTitle}>
                    <span>£</span> {t('pricingOptions')}
                </h4>
                <div className={styles.pricingGrid}>
                    {pricingEntries.map(([key, val]) => (
                        <div key={key} className={styles.priceCol}>
                            <span className={styles.priceName}>{val.name}</span>
                            <span className={styles.priceValue}>
                                {val.price > 0 ? `£${val.price.toLocaleString()}` : `£${item?.price || '—'}`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Buttons ── */}
            <div className={styles.actions}>
                <Link
                    href={`/${locale}/course_details/${item?.id}/${encodeURIComponent(item?.slug ?? "")}`}
                    className={styles.btnDetails}
                >
                    {t('details')}
                </Link>
                <Link
                    href={`/${locale}/registerCourse?course_id=${item?.id}`}
                    className={styles.btnRegister}
                >
                    {t('register')} <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
};

export default PrintCardV2;
