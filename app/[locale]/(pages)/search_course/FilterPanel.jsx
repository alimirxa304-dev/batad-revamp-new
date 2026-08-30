"use client";
import { useState } from "react";
import { ChevronDown, RotateCcw, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "@/sass/pages/search-course/filter-panel.module.scss";

// One collapsible filter row — click the bar to expand/collapse its options.
const AccordionField = ({ label, options, value, onChange, isOpen, onToggle }) => (
    <div className={styles.field}>
        <button
            type="button"
            className={styles.fieldBar}
            aria-expanded={isOpen}
            onClick={onToggle}
        >
            <span>{value ? options.find((o) => o.value === value)?.label ?? label : label}</span>
            <ChevronDown
                size={16}
                className={`${styles.fieldChevron} ${isOpen ? styles.fieldChevronOpen : ""}`}
                aria-hidden="true"
            />
        </button>
        {isOpen && (
            <div className={styles.fieldOptions}>
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={`${styles.fieldOption} ${value === opt.value ? styles.fieldOptionActive : ""}`}
                        onClick={() => onChange(opt.value === value ? "" : opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        )}
    </div>
);

// This panel is UI-only — Format/Venues/Certificate/Duration/Year/Month
// aren't fields the backend's /courses endpoint supports, so selecting them
// narrows nothing server-side. Kept as local state so the interaction reads
// naturally (open/select/reset) without pretending to filter real results.
const FilterPanel = ({ cities }) => {
    const t = useTranslations("SearchCourse");
    const [openField, setOpenField] = useState(null);
    const [values, setValues] = useState({
        search: "",
        format: "",
        venue: "",
        certificate: "",
        duration: "",
        year: "",
        month: "",
    });

    const toggle = (field) => setOpenField((prev) => (prev === field ? null : field));
    const setValue = (field, val) => setValues((prev) => ({ ...prev, [field]: val }));
    const hasActive = Object.values(values).some(Boolean);

    const formatOptions = [
        { value: "in_person", label: t("formatOptions.inPerson") },
        { value: "online", label: t("formatOptions.online") },
        { value: "hybrid", label: t("formatOptions.hybrid") },
    ];
    const venueOptions = (cities || []).map((city) => ({ value: String(city.id), label: city.name }));
    const certificateOptions = [
        { value: "accredited", label: t("certificateOptions.accredited") },
        { value: "attendance", label: t("certificateOptions.attendance") },
    ];
    const durationOptions = [
        { value: "1w", label: t("durationOptions.oneWeek") },
        { value: "2w", label: t("durationOptions.twoWeeks") },
        { value: "1m", label: t("durationOptions.oneMonth") },
        { value: "custom", label: t("durationOptions.custom") },
    ];
    const currentYear = new Date().getFullYear();
    const yearOptions = [currentYear, currentYear + 1, currentYear + 2].map((y) => ({
        value: String(y),
        label: String(y),
    }));
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1),
        label: t(`months.${i + 1}`),
    }));

    return (
        <div className={styles.panel}>
            <div className={styles.search}>
                <Search size={16} aria-hidden="true" />
                <input
                    type="text"
                    value={values.search}
                    onChange={(e) => setValue("search", e.target.value)}
                    placeholder={t("searchTitlePlaceholder")}
                />
            </div>

            <AccordionField
                label={t("format")}
                options={formatOptions}
                value={values.format}
                onChange={(v) => setValue("format", v)}
                isOpen={openField === "format"}
                onToggle={() => toggle("format")}
            />
            <AccordionField
                label={t("venues")}
                options={venueOptions}
                value={values.venue}
                onChange={(v) => setValue("venue", v)}
                isOpen={openField === "venue"}
                onToggle={() => toggle("venue")}
            />
            <AccordionField
                label={t("certificate")}
                options={certificateOptions}
                value={values.certificate}
                onChange={(v) => setValue("certificate", v)}
                isOpen={openField === "certificate"}
                onToggle={() => toggle("certificate")}
            />
            <AccordionField
                label={t("duration")}
                options={durationOptions}
                value={values.duration}
                onChange={(v) => setValue("duration", v)}
                isOpen={openField === "duration"}
                onToggle={() => toggle("duration")}
            />
            <AccordionField
                label={t("year")}
                options={yearOptions}
                value={values.year}
                onChange={(v) => setValue("year", v)}
                isOpen={openField === "year"}
                onToggle={() => toggle("year")}
            />
            <AccordionField
                label={t("month")}
                options={monthOptions}
                value={values.month}
                onChange={(v) => setValue("month", v)}
                isOpen={openField === "month"}
                onToggle={() => toggle("month")}
            />

            {hasActive && (
                <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={() => {
                        setValues({ search: "", format: "", venue: "", certificate: "", duration: "", year: "", month: "" });
                        setOpenField(null);
                    }}
                >
                    <RotateCcw size={14} aria-hidden="true" /> {t("resetFilters")}
                </button>
            )}
        </div>
    );
};

export default FilterPanel;
