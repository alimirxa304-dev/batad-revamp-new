"use client";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import styles from "@/sass/pages/course-details/header.module.scss";
import stylesContainer from "@/sass/components/common/container.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const Header = () => {
    const { locale } = useParams();
    const t = useTranslations('CourseDetails');

    return (
        <section className={styles.header}>
            <div className={stylesContainer.container}>
                <div className={styles.wrapper}>
                    <div className={styles.breadcrumb}>
                        <ArrowLeft color='#2F327D' size={20} />
                        <Link href={`/${locale}/search_course`}>{t('backToCourses')}</Link>
                    </div>
                    <span>|</span>
                    <House color='#4A5565' size={20} />
                    <ArrowRight color='#4A5565' size={20} />
                    <span>{t('courses')}</span>
                    <ArrowRight color='#4A5565' size={20} />
                    <span>{t('courseDetails')}</span>
                </div>
            </div>
        </section>
    );
};

export default Header;
