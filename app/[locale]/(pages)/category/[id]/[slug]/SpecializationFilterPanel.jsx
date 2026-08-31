"use client";
import { useState } from "react";
import { ChevronDown, RotateCcw, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "@/sass/pages/category-details/specialization-filter.module.scss";
// Reuses /search_course's field-accordion look (same "label bar -> options
// list" shape) instead of duplicating that CSS for a second filter panel.
import fieldStyles from "@/sass/pages/search-course/filter-panel.module.scss";

const AccordionField = ({ label, options, value, onChange, isOpen, onToggle }) => (
    <div className={fieldStyles.field}>
        <button type="button" className={fieldStyles.fieldBar} aria-expanded={isOpen} onClick={onToggle}>
            <span>{value ? options.find((o) => o.value === value)?.label ?? label : label}</span>
            <ChevronDown
                size={16}
                className={`${fieldStyles.fieldChevron} ${isOpen ? fieldStyles.fieldChevronOpen : ""}`}
                aria-hidden="true"
            />
        </button>
        {isOpen && (
            <div className={fieldStyles.fieldOptions}>
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`${fieldStyles.fieldOption} ${value === opt.value ? fieldStyles.fieldOptionActive : ""}`}
                        onClick={() => onChange(opt.value === value ? "" : opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        )}
    </div>
);

// This page lists the category's own specialisations (not courses), so the
// filters that actually apply are a name search plus ways to sort/narrow
// that same list — the Format/Venue/Duration-style filters from
// /search_course don't mean anything for a grid of specialisation cards.
const SpecializationFilterPanel = ({ query, onQueryChange, sortBy, onSortChange, minCourses, onMinCoursesChange, resultCount }) => {
    const t = useTranslations("CourseTraning");
    const [openField, setOpenField] = useState(null);
    const toggle = (field) => setOpenField((prev) => (prev === field ? null : field));

    const sortOptions = [
        { value: "az", label: t("sortAZ") },
        { value: "za", label: t("sortZA") },
        { value: "most", label: t("sortMostCourses") },
        { value: "fewest", label: t("sortFewestCourses") },
    ];
    const minCoursesOptions = [
        { value: "5", label: t("minCoursesValue", { count: 5 }) },
        { value: "10", label: t("minCoursesValue", { count: 10 }) },
        { value: "15", label: t("minCoursesValue", { count: 15 }) },
    ];

    const hasActive = Boolean(query.trim() || sortBy || minCourses);

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

            <AccordionField
                label={t("sortBy")}
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                isOpen={openField === "sort"}
                onToggle={() => toggle("sort")}
            />
            <AccordionField
                label={t("minCourses")}
                options={minCoursesOptions}
                value={minCourses}
                onChange={onMinCoursesChange}
                isOpen={openField === "minCourses"}
                onToggle={() => toggle("minCourses")}
            />

            {query.trim() && (
                <p className={styles.resultCount}>{t("resultsFound", { count: resultCount })}</p>
            )}

            {hasActive && (
                <button
                    type="button"
                    className={fieldStyles.resetBtn}
                    onClick={() => {
                        onQueryChange("");
                        onSortChange("");
                        onMinCoursesChange("");
                        setOpenField(null);
                    }}
                >
                    <RotateCcw size={14} aria-hidden="true" /> {t("resetFiltersLabel")}
                </button>
            )}
        </div>
    );
};

export default SpecializationFilterPanel;
