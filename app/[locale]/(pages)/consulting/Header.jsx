"use client";

import styles from "@/sass/pages/consulting/header.module.scss";
import { Aperture } from "lucide-react";
import SearchCourse from "../search_course/Search";
import { useTranslations } from "next-intl";

const Header = ({ stats }) => {
    const t = useTranslations('Consulting');

    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <div className={styles.title}>
                    <span><Aperture color="#B12E33" size={22} />{t('headerTag')}</span>
                    <h1>{t('title')} <br /> {t('titleLine2')}</h1>
                    <p>{t('subtitle')}</p>
                </div>
                <div className={styles.searchCourse}>
                    <SearchCourse className={styles.filter} />
                </div>
            </div>

            <div className={styles.statistics}>
                <div className={styles.item}>
                    <h5>{stats?.cities}</h5>
                    <span>{t('cities')}</span>
                </div>
                <div className={styles.item}>
                    <h5>{stats?.training_programs}</h5>
                    <span>{t('trainingPrograms')}</span>
                </div>
                <div className={styles.item}>
                    <h5>{stats?.students}</h5>
                    <span>{t('students')}</span>
                </div>
            </div>
        </div>
    );
};

export default Header;
