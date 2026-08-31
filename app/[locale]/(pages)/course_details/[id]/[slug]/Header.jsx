"use client";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import styles from "@/sass/pages/course-details/header.module.scss";
import stylesContainer from "@/sass/components/common/container.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const Header = ({ courseName }) => {
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
                    {/* Middle hop ("| 🏠 → Courses →") is redundant on phone —
                        "Back to Courses" already says where the back arrow
                        goes — so it's hidden there, handing the course-name
                        crumb the room it actually needs instead of leaving it
                        squeezed into a sliver next to unnecessary clutter. */}
                    <span className={styles.middleCrumb}>|</span>
                    <House color='#4A5565' size={20} className={styles.middleCrumb} />
                    <ArrowRight color='#4A5565' size={20} className={styles.middleCrumb} />
                    <span className={styles.middleCrumb}>{t('courses')}</span>
                    <ArrowRight color='#4A5565' size={20} />
                    <span className={styles.current} title={courseName}>
                        {courseName || t('courseDetails')}
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Header;
