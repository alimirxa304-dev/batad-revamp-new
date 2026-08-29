'use client'
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { useParams } from "next/navigation"
import Title from "@/components/common/Title"
import computer from '@/public/asstes/icons/computer.svg'
import promotion from '@/public/asstes/icons/promotion.svg'
import cityIcon from '@/public/asstes/icons/city.png'
import containerStyle from '@/sass/components/common/container.module.scss'
import styles from '@/sass/pages/home/course-highlights.module.scss'
import { useTranslations } from "next-intl"

// Discounted / Featured / Courses by City — moved here from the "What is
// British Academy" panel, as their own quick-shortcuts row between
// Upcoming Courses and Courses by Specialisation.
const CourseHighlights = () => {
    const t = useTranslations('CourseHighlights')
    const tWhatIs = useTranslations('WhatIs')
    const { locale } = useParams()
    const isRtl = locale === 'ar'
    const Arrow = isRtl ? ArrowLeft : ArrowRight

    const items = [
        {
            params: { query: { discounted: 22 } },
            img: computer,
            title: tWhatIs('items.discounted.title'),
            desc: tWhatIs('items.discounted.desc'),
        },
        {
            params: { query: { featured: 1 } },
            img: promotion,
            title: tWhatIs('items.featured.title'),
            desc: tWhatIs('items.featured.desc'),
        },
        {
            img: cityIcon,
            title: tWhatIs('items.city.title'),
            desc: tWhatIs('items.city.desc'),
        },
    ]

    return (
        <section>
            <div className={containerStyle.container}>
                <Title title={t('title')} span={t('titleSpan')} subtitle={t('subtitle')} />

                <div className={styles.grid}>
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            className={styles.card}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
                        >
                            <span className={styles.icon}>
                                <Image src={item.img} width={30} height={30} alt="" aria-hidden="true" />
                            </span>
                            <h3 className={styles.title}>{item.title}</h3>
                            <p className={styles.desc}>{item.desc}</p>
                            <Link
                                href={item.params?.query
                                    ? `/${locale}/search_course?${new URLSearchParams(item.params.query).toString()}`
                                    : `/${locale}/search_course`}
                                className={styles.link}
                            >
                                {t('viewDetails')}
                                <Arrow size={15} aria-hidden="true" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default CourseHighlights
