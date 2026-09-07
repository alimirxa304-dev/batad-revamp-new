"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, useParams, usePathname } from "next/navigation";
import { Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import CategoriesBox from "./CategoriesBox";
import Range from "../ui/Range";
import Category from "../ui/Categories";
import styles from "@/sass/components/common/sidebar-filter.module.scss";
import { useTranslations } from "next-intl";

// Boxed filter sidebar / phone drawer. Same design as before (CategoriesBox
// groups: price slider, course-type checkboxes, category list, tags) with the
// full filter set added in the same style. Every control writes a query
// parameter and the page refetches on URL change, so selections narrow the
// course list for real. Parameter names match the rest of the app.
const MANAGED_PARAMS = [
  "search", "min_price", "max_price", "featured", "has_approval", "discounted",
  "category_id", "specialization_id", "city_id", "lang", "format", "certificate",
  "duration", "date", "tag",
];

const SidebarFilter = ({ data, className, activeCategoryId, activeSpecializationId: activeSpecIdProp, hideTags = false, hideCities = false }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useParams();
  const t = useTranslations('SearchCourse');
  const get = (key) => searchParams.get(key) || "";

  // Sets/clears several params in one navigation (two back-to-back pushes
  // would each start from the same stale URL and overwrite each other).
  const applyParams = (changes) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(changes).forEach(([key, value]) => {
      if (value) params.set(key, String(value)); else params.delete(key);
    });
    params.delete("cursor");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const resolvedCategoryId = activeCategoryId ?? get("category_id");
  const resolvedSpecId = activeSpecIdProp ?? get("specialization_id");
  const hasActive = MANAGED_PARAMS.some((k) => get(k));

  // Keywords: pushed after a short pause so each keystroke doesn't refetch.
  const [keywords, setKeywords] = useState(get("search"));
  useEffect(() => { setKeywords(get("search")); }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (keywords === get("search")) return undefined;
    const id = setTimeout(() => applyParams({ search: keywords }), 400);
    return () => clearTimeout(id);
  }, [keywords]); // eslint-disable-line react-hooks/exhaustive-deps

  // Price slider: debounced too (it fires continuously while dragging).
  const priceTimer = useRef(null);
  const range = data?.price_range || { min: 0, max: 3000 };
  const priceRange = (
    <div className={styles.range}>
      <h3 className={styles.filterGroupTitle}>{t('priceRange')}</h3>
      <Range
        min={Number(get("min_price")) || range.min}
        max={Number(get("max_price")) || range.max}
        step={10}
        onChange={({ min, max }) => {
          clearTimeout(priceTimer.current);
          priceTimer.current = setTimeout(() => applyParams({
            min_price: min > range.min ? min : "",
            max_price: max < range.max ? max : "",
          }), 500);
        }}
      />
    </div>
  );

  const checkbox = (key, label) => (
    <label className={styles.checkboxLabel}>
      <input
        type="checkbox"
        checked={get(key) === "1"}
        onChange={(e) => applyParams({ [key]: e.target.checked ? "1" : "" })}
      />{" "}
      {label}
    </label>
  );
  const courseTypeCheckboxes = (
    <div className={styles.checkboxGroup}>
      {checkbox("featured", t('featuredCourses'))}
      {checkbox("has_approval", t('approvedCourses'))}
      {checkbox("discounted", t('discountedCourses'))}
    </div>
  );

  // Radio-style list in the checkbox design; clicking the active one clears it.
  const radioList = (key, options, extra = {}) => (
    <div className={`${styles.checkboxGroup} ${styles.radioList}`}>
      {options.map((opt) => (
        <label key={opt.value} className={styles.checkboxLabel}>
          <input
            type="radio"
            name={key}
            checked={get(key) === opt.value}
            onChange={() => applyParams({ [key]: opt.value, ...extra })}
            onClick={() => { if (get(key) === opt.value) applyParams({ [key]: "", ...extra }); }}
          />{" "}
          {opt.label}
        </label>
      ))}
    </div>
  );

  const categoryId = get("category_id");
  const specializationOptions = (data?.specializations || [])
    .filter((s) => !categoryId || !s.category_id || String(s.category_id) === categoryId)
    .map((s) => ({ value: String(s.id), label: s.name }));
  const cityOptions = hideCities ? [] : (data?.cities || []).map((c) => ({ value: String(c.id), label: c.name }));
  const languageOptions = [
    { value: "en", label: t('langEnglish') },
    { value: "ar", label: t('langArabic') },
  ];
  const formatOptions = [
    { value: "in_person", label: t('formatOptions.inPerson') },
    { value: "online", label: t('formatOptions.online') },
    { value: "hybrid", label: t('formatOptions.hybrid') },
  ];
  const certificateOptions = [
    { value: "accredited", label: t('certificateOptions.accredited') },
    { value: "attendance", label: t('certificateOptions.attendance') },
  ];
  const durationOptions = [
    { value: "1w", label: t('durationOptions.oneWeek') },
    { value: "2w", label: t('durationOptions.twoWeeks') },
    { value: "1m", label: t('durationOptions.oneMonth') },
    { value: "custom", label: t('durationOptions.custom') },
  ];

  // Year + month combine into one `date` prefix (YYYY or YYYY-MM).
  const currentYear = new Date().getFullYear();
  const [dateYear = "", dateMonth = ""] = get("date").split("-");
  const setDate = (year, month) => {
    const y = year || (month ? String(currentYear) : "");
    applyParams({ date: y ? (month ? `${y}-${month}` : y) : "" });
  };
  const dateSelects = (
    <div className={styles.selectRow}>
      <select className={styles.select} value={dateYear} onChange={(e) => setDate(e.target.value, dateMonth)} aria-label={t('year')}>
        <option value="">{t('allYears')}</option>
        {[currentYear, currentYear + 1, currentYear + 2].map((y) => (
          <option key={y} value={String(y)}>{y}</option>
        ))}
      </select>
      <select className={styles.select} value={dateMonth} onChange={(e) => setDate(dateYear, e.target.value)} aria-label={t('month')}>
        <option value="">{t('allMonths')}</option>
        {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0")).map((m, i) => (
          <option key={m} value={m}>{t(`months.${i + 1}`)}</option>
        ))}
      </select>
    </div>
  );

  const keywordsBox = (
    <div className={styles.searchField}>
      <Search size={16} aria-hidden="true" />
      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder={t('searchTitlePlaceholder')}
      />
    </div>
  );

  const categoriesBox = (
    <CategoriesBox title={t('allCategory')} as="h2">
      <ul className={styles.sidebarCategoryList}>
        {data?.categories?.map((category) => (
          <Category
            key={category.id}
            category={category}
            active={resolvedCategoryId === String(category.id)}
            activeSpecializationId={resolvedSpecId}
            onClick={() => applyParams({ category_id: resolvedCategoryId === String(category.id) ? "" : category.id, specialization_id: "" })}
            onSpecializationClick={(specId, specSlug) => {
              router.push(`/${locale}/course_training/${specId}/${specSlug}`);
            }}
          />
        ))}
      </ul>
    </CategoriesBox>
  );

  const tagsBox = data?.tags?.length > 0 && (
    <CategoriesBox title={t('allTags')} as="h2">
      <div className={styles.sidebarTagsContainer}>
        {data.tags.map((tag, index) => (
          <button
            key={index}
            className={`${styles.tagPill} ${get("tag") === String(tag) ? styles.active : ""}`}
            onClick={() => applyParams({ tag: get("tag") === String(tag) ? "" : tag })}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
    </CategoriesBox>
  );

  // The extra filters, grouped in one box in the same checkbox/heading style.
  const moreFiltersBox = (
    <CategoriesBox title={t('moreFilters')} icon={<SlidersHorizontal size={18} />} aria-hidden="true" as="h2">
      <div className={styles.sidebarFilterContent}>
        {specializationOptions.length > 0 && (<>
          <h3 className={styles.filterGroupTitle}>{t('specialization')}</h3>
          {radioList("specialization_id", specializationOptions)}
        </>)}
        {cityOptions.length > 0 && (<>
          <h3 className={styles.filterGroupTitle}>{t('place')}</h3>
          {radioList("city_id", cityOptions)}
        </>)}
        <h3 className={styles.filterGroupTitle}>{t('year')} / {t('month')}</h3>
        {dateSelects}
        <h3 className={styles.filterGroupTitle}>{t('language')}</h3>
        {radioList("lang", languageOptions)}
        <h3 className={styles.filterGroupTitle}>{t('format')}</h3>
        {radioList("format", formatOptions)}
        <h3 className={styles.filterGroupTitle}>{t('certificate')}</h3>
        {radioList("certificate", certificateOptions)}
        <h3 className={styles.filterGroupTitle}>{t('duration')}</h3>
        {radioList("duration", durationOptions)}
      </div>
    </CategoriesBox>
  );

  const resetBtn = hasActive && (
    <button
      type="button"
      className={styles.resetBtn}
      onClick={() => {
        setKeywords("");
        applyParams(Object.fromEntries(MANAGED_PARAMS.map((k) => [k, ""])));
      }}
    >
      <RotateCcw size={14} aria-hidden="true" /> {t('resetFilters')}
    </button>
  );

  return (
    <MotionWrapper className={styles[className]}>
      <CategoriesBox title={t('filters')} icon={<Filter size={18} />} aria-hidden="true" as="h2">
        <div className={styles.sidebarFilterContent}>
          {keywordsBox}
          {priceRange}
          <h3 className={styles.filterGroupTitle}>{t('courseType')}</h3>
          {courseTypeCheckboxes}
        </div>
      </CategoriesBox>
      {data?.categories?.length > 0 && categoriesBox}
      {moreFiltersBox}
      {!hideTags && tagsBox}
      {resetBtn}
    </MotionWrapper>
  );
};

export default SidebarFilter;
