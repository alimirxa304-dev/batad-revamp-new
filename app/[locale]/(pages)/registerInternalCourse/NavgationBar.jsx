"use client";
import styles from "@/sass/pages/course-details-by-city/navgation-bar.module.scss";
import stylesContainer from "@/sass/components/common/container.module.scss";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

const NavgationBar = () => {
    const t = useTranslations('RegisterInternal');
    const { locale } = useParams();

    return (
        <section className={styles.navgationBar}>
            <div className={stylesContainer.container}>
                <div className={styles.wrapper}>
                    <div className={styles.breadcrumb}>
                        <ArrowLeft color='#2F327D' size={20} />
                        <Link href={`/${locale}/search_course`}>{t('backToCourses')}</Link>
                    </div>
                    <span>|</span>
                    <Link href={`/${locale}`}><House color='#4A5565' size={20} /></Link>
                    <ArrowRight color='#4A5565' size={20} />
                    <span>{t('courses')}</span>
                    <ArrowRight color='#4A5565' size={20} />
                    <span>{t('requestCourse')}</span>
                </div>
            </div>
        </section>
    );
};

export default NavgationBar;
