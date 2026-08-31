"use client";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "@/sass/pages/category-details/specialization-filter.module.scss";

// This page lists the category's own specialisations (not courses), so a
// name search is the only filter dimension that actually applies — the
// Format/Venue/Duration-style filters from /search_course don't mean
// anything for a grid of specialisation cards.
const SpecializationFilterPanel = ({ query, onQueryChange, resultCount }) => {
    const t = useTranslations("CourseTraning");
    return (
        <div className={styles.panel}>
            <div className={styles.search}>
                <Search size={16} aria-hidden="true" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => onQueryChange(e.target.value)}
                    placeholder={t("searchSpecializations")}
                />
            </div>
            {query.trim() && (
                <p className={styles.resultCount}>{t("resultsFound", { count: resultCount })}</p>
            )}
        </div>
    );
};

export default SpecializationFilterPanel;
