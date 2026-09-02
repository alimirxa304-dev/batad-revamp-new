'use client'
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
// Full-colour crest + wordmark (transparent SVG), copied to a clean filename
// from "BATD For Training & Development Retraced with shades Logo.svg".
import aboutImage from "@/public/asstes/batd-logo-color.svg";
import containerStyle from '@/sass/components/common/container.module.scss';
import styles from '@/sass/pages/home/about-academy.module.scss';
import { useLocale, useTranslations } from "next-intl";

// "About the Academy" section — image on one side, the academy's real
// introduction text on the other.
const AboutAcademy = () => {
    const t = useTranslations('AboutAcademy');
    const locale = useLocale();
    const Arrow = locale === 'ar' ? ArrowLeft : ArrowRight;

    const points = [
        t('points.accredited'),
        t('points.hq'),
        t('points.trainers'),
        t('points.support'),
    ];

    return (
        <section className={styles.about}>
            <div className={containerStyle.container}>
                <div className={styles.grid}>
                    {/* ── Image side ── */}
                    <motion.div
                        className={styles.media}
                        initial={{ opacity: 0, x: locale === 'ar' ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    >
                        <div className={styles.imageFrame}>
                            <Image
                                src={aboutImage}
                                alt={t('titleSpan')}
                                className={styles.image}
                                sizes="(max-width: 1024px) 100vw, 560px"
                            />
                        </div>
                    </motion.div>

                    {/* ── Text side ── */}
                    <motion.div
                        className={styles.body}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                    >
                        <h2 className={styles.heading}>
                            {t('title')} <span>{t('titleSpan')}</span>
                        </h2>
                        <p className={styles.paragraph}>{t('p1')}</p>
                        <p className={styles.paragraph}>{t('p2')}</p>

                        <ul className={styles.points}>
                            {points.map((point, i) => (
                                <li key={i}>
                                    <CheckCircle2 size={18} aria-hidden="true" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>

                        <Link href={`/${locale}/page/Academy-Vision`} className={styles.cta}>
                            {t('cta')} <Arrow size={17} aria-hidden="true" />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AboutAcademy;
