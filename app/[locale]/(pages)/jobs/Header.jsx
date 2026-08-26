"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import styles from "@/sass/pages/jobs/header.module.scss";
import { useTranslations } from "next-intl";

const Header = ({ updateFilter }) => {
    const t = useTranslations('Jobs');
    const [search, setSearch] = useState("");

    const handleFindJob = () => {
        updateFilter?.({ key: "search", value: search.trim() });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleFindJob();
        }
    };

    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <div className={styles.title}>
                    {/* <span><Aperture color="#B12E33" size={22} />EXPLORE OUR GLOBAL LOCATIONS</span> */}
                    <h1>{t('headerTitle')}</h1>
                    <p>{t('headerSubtitle')}</p>
                </div>
                <div className={styles.searchCourse}>

                    <div className={styles.locationSelect}>

                        <div className={styles.searchInputWrapper}>
                            <Search size={18} />
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder={t('searchPlaceholder')}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>

                        <button className={styles.findJobBtn} onClick={handleFindJob}>{t('findJob')}</button>
                    </div>
                      <p className={styles.suggestions}>Suggestions: 
                        <span>Programing</span>
                        <span>Programing</span>
                        <span>Programing</span>
                        <span>Programing</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Header;
