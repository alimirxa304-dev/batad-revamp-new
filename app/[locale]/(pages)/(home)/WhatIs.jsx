'use client'
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import whatis from '@/public/asstes/whatis.webp'
import { useParams } from "next/navigation"
import computer from '@/public/asstes/icons/computer.svg';
import gameDevelopment from '@/public/asstes/icons/game-development.svg';
import promotion from '@/public/asstes/icons/promotion.svg';
import uxInterface from '@/public/asstes/icons/ux-interface.svg';
import containerStyle from '@/sass/components/common/container.module.scss'
import styles from '@/sass/pages/home/what-is.module.scss'
import { useTranslations } from "next-intl"

const WhatIs = () => {
    const t = useTranslations('WhatIs');
    const { locale } = useParams();
    const isRtl = locale === 'ar';
    const Arrow = isRtl ? ArrowLeft : ArrowRight;

    const stats = [
        { value: '15+', label: t('stats.years') },
        { value: '600+', label: t('stats.programs') },
        { value: '65,000+', label: t('stats.professionals') },
    ];

    const items = [
        {
            params: { query: { discounted: 22 } },
            img: computer,
            title: t('items.discounted.title'),
            desc: t('items.discounted.desc'),
        },
        {
            params: { query: { has_approval: 1 } },
            img: gameDevelopment,
            title: t('items.approved.title'),
            desc: t('items.approved.desc'),
        },
        {
            params: { query: { featured: 1 } },
            img: promotion,
            title: t('items.featured.title'),
            desc: t('items.featured.desc'),
        },
        {
            params: { query: { specialization_id: 22 } },
            img: uxInterface,
            title: t('items.specialization.title'),
            desc: t('items.specialization.desc'),
        },
        {
            img: computer,
            title: t('items.city.title'),
            desc: t('items.city.desc'),
        },
    ];

    return (
        <section className={styles.whatIs}>
            <div className={containerStyle.container}>
                <div className={styles.panel}>
                    <div className={styles.panelGlow} aria-hidden="true" />
                    <div className={styles.panelGrid}>
                        {/* ── Intro / brand column ── */}
                        <motion.div
                            className={styles.intro}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <h2 className={styles.heading}>
                                {t('title')} <span>{t('titleSpan')}</span>
                            </h2>
                            <p className={styles.desc}>{t('description')}</p>

                            <div className={styles.stats}>
                                {stats.map((stat, i) => (
                                    <div key={i} className={styles.statBlock}>
                                        <strong>{stat.value}</strong>
                                        <span>{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.planCard}>
                                <Image src={whatis} alt={t('annualPlan')} fill className={styles.planImage} sizes="(max-width: 1024px) 100vw, 480px" />
                                <div className={styles.planOverlay}>
                                    <div className={styles.planText}>
                                        <strong>{t('annualPlan')}</strong>
                                        <p>{t('annualPlanSub')}</p>
                                    </div>
                                    <Link href={`/${locale}/year_plan`} className={styles.planBtn}>
                                        {t('goToPlan')}
                                        <Arrow size={17} aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Feature cards ── */}
                        <div className={styles.features}>
                            {items.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className={styles.featureCard}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
                                >
                                    <span className={styles.featureIcon}>
                                        <Image src={item.img} width={30} height={30} alt="" aria-hidden="true" />
                                    </span>
                                    <div className={styles.featureBody}>
                                        <h3>{item.title}</h3>
                                        <p>{item.desc}</p>
                                        <Link
                                            href={item.params?.query
                                                ? `/${locale}/search_course?${new URLSearchParams(item.params.query).toString()}`
                                                : `/${locale}/search_course`}
                                            className={styles.featureLink}
                                        >
                                            {t('viewDetails')}
                                            <Arrow size={15} aria-hidden="true" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhatIs
