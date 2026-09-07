"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

// Every field here writes a query parameter; the page (Courses.jsx /
// SpecializationDetails.jsx) refetches whenever the URL's search params change,
// so a selection narrows the list for real. Parameter names match what the
// rest of the app already sends (search, category_id, specialization_id,
// city_id, date, lang); price/discount/format/certificate/duration are passed
// through for the backend to honour.
const PRICE_RANGES = [
    { value: "0-1000", min: "", max: "1000", key: "under1000" },
    { value: "1000-1500", min: "1000", max: "1500", key: "p1000" },
    { value: "1500-2000", min: "1500", max: "2000", key: "p1500" },
    { value: "2000-", min: "2000", max: "", key: "over2000" },
];

const MANAGED_PARAMS = [
    "search", "category_id", "specialization_id", "city_id", "price_min", "price_max",
    "discounted", "date", "lang", "format", "certificate", "duration",
];

const FilterPanel = ({ cities, categories, specializations }) => {
    const t = useTranslations("SearchCourse");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [openField, setOpenField] = useState(null);
    const get = (key) => searchParams.get(key) || "";

    const applyParams = (changes) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(changes).forEach(([key, value]) => {
            if (value) params.set(key, value); else params.delete(key);
        });
        params.delete("cursor");
        const qs = params.toString();
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    };

    // Keywords: local state, pushed to the URL after a short pause so each
    // keystroke does not trigger a fetch.
    const [keywords, setKeywords] = useState(get("search"));
    useEffect(() => { setKeywords(get("search")); }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (keywords === get("search")) return undefined;
        const id = setTimeout(() => applyParams({ search: keywords }), 400);
        return () => clearTimeout(id);
    }, [keywords]); // eslint-disable-line react-hooks/exhaustive-deps

    const toggle = (field) => setOpenField((prev) => (prev === field ? null : field));

    // Current values, read straight from the URL.
    const categoryId = get("category_id");
    const specializationId = get("specialization_id");
    const cityId = get("city_id");
    const priceValue = PRICE_RANGES.find((r) => r.min === get("price_min") && r.max === get("price_max"))?.value || "";
    const discounted = get("discounted") === "1" ? "1" : "";
    const [dateYear = "", dateMonth = ""] = get("date").split("-");
    const langValue = get("lang");
    const hasActive = MANAGED_PARAMS.some((k) => get(k));

    // Options
    const categoryOptions = (categories || []).map((c) => ({ value: String(c.id), label: c.name }));
    const specializationOptions = useMemo(() => {
        const list = (specializations || []).filter(
            (s) => !categoryId || !s.category_id || String(s.category_id) === categoryId
        );
        return list.map((s) => ({ value: String(s.id), label: s.name }));
    }, [specializations, categoryId]);
    const cityOptions = (cities || []).map((city) => ({ value: String(city.id), label: city.name }));
    const priceOptions = PRICE_RANGES.map((r) => ({ value: r.value, label: t(`priceOptions.${r.key}`) }));
    const discountOptions = [{ value: "1", label: t("discountOnly") }];
    const currentYear = new Date().getFullYear();
    const yearOptions = [currentYear, currentYear + 1, currentYear + 2].map((y) => ({ value: String(y), label: String(y) }));
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: String(i + 1).padStart(2, "0"),
        label: t(`months.${i + 1}`),
    }));
    const languageOptions = [
        { value: "en", label: t("langEnglish") },
        { value: "ar", label: t("langArabic") },
    ];
    const formatOptions = [
        { value: "in_person", label: t("formatOptions.inPerson") },
        { value: "online", label: t("formatOptions.online") },
        { value: "hybrid", label: t("formatOptions.hybrid") },
    ];
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

    // Year + month combine into one `date` prefix (YYYY or YYYY-MM).
    const setDate = (year, month) => {
        const y = year || (month ? String(currentYear) : "");
        applyParams({ date: y ? (month ? `${y}-${month}` : y) : "" });
    };

    const field = (key, label, options, value, onChange) =>
        options.length > 0 && (
            <AccordionField
                key={key}
                label={label}
                options={options}
                value={value}
                onChange={onChange}
                isOpen={openField === key}
                onToggle={() => toggle(key)}
            />
        );

    return (
        <div className={styles.panel}>
            <div className={styles.search}>
                <Search size={16} aria-hidden="true" />
                <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder={t("searchTitlePlaceholder")}
                />
            </div>
            {field("category", t("category"), categoryOptions, categoryId,
                (v) => applyParams({ category_id: v, specialization_id: "" }))}
            {field("specialization", t("specialization"), specializationOptions, specializationId,
                (v) => applyParams({ specialization_id: v }))}
            {field("city", t("place"), cityOptions, cityId, (v) => applyParams({ city_id: v }))}
            {field("price", t("priceRange"), priceOptions, priceValue, (v) => {
                const r = PRICE_RANGES.find((x) => x.value === v);
                applyParams({ price_min: r?.min || "", price_max: r?.max || "" });
            })}
            {field("discount", t("discountedCourses"), discountOptions, discounted,
                (v) => applyParams({ discounted: v }))}
            {field("year", t("year"), yearOptions, dateYear, (v) => setDate(v, dateMonth))}
            {field("month", t("month"), monthOptions, dateMonth, (v) => setDate(dateYear, v))}
            {field("lang", t("language"), languageOptions, langValue, (v) => applyParams({ lang: v }))}
            {field("format", t("format"), formatOptions, get("format"), (v) => applyParams({ format: v }))}
            {field("certificate", t("certificate"), certificateOptions, get("certificate"),
                (v) => applyParams({ certificate: v }))}
            {field("duration", t("duration"), durationOptions, get("duration"),
                (v) => applyParams({ duration: v }))}
            {hasActive && (
                <button
                    type="button"
                    className={styles.resetBtn}
                    onClick={() => {
                        setKeywords("");
                        applyParams(Object.fromEntries(MANAGED_PARAMS.map((k) => [k, ""])));
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
