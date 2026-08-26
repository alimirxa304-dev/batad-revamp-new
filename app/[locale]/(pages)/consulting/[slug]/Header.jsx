"use client";
import styles from "@/sass/pages/consulting/consulting-category/header.module.scss";
import { Aperture } from "lucide-react";
import SearchCourse from "../../search_course/Search";
import { useTranslations } from "next-intl";

const Header = ({ consultantName, updateFilter }) => {
    const t = useTranslations('Consulting');

    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <div className={styles.title}>
                    <span><Aperture color="#B12E33" size={22} />{t('headerTag')}</span>
                    <h1>{consultantName} <br /> {t('consultations')}</h1>
                    <p>{t('headerSubtitle')}</p>
                </div>
                <div className={styles.searchCourse}>
                    <SearchCourse className={styles.filter} updateFilter={updateFilter} />
                </div>
            </div>
        </div>
    );
};

export default Header;
