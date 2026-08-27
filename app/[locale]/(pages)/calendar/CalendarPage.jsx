'use client';
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, MapPin, RotateCcw, Search, Tag } from "lucide-react";
import { getCourses } from "@/action/courses";
import useCategoriesStore from "@/store/useCategoriesStore";
import useCitiesStore from "@/store/useCitiesStore";
import Skeleton from "@/components/ui/Skeleton";
import stylesContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/calendar/calendar.module.scss";
import { useTranslations } from "next-intl";

const EMPTY_FILTERS = {
    search: "",
    category_id: "",
    specialization_id: "",
    city_id: "",
    date: "",
};

const CalendarPage = () => {
    const t = useTranslations('CalendarPage');
    const { locale } = useParams();
    const { categories, handleGetCategories } = useCategoriesStore();
    const { cities, handleGetCities } = useCitiesStore();

    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        handleGetCategories();
        handleGetCities();
    }, []);

    // Refetch whenever a filter changes (debounced for the keyword field).
    useEffect(() => {
        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const params = new URLSearchParams();
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) params.set(key, value);
                });
                const qs = params.toString() ? `?${params.toString()}` : "";
                const res = await getCourses(locale, qs);
                setCourses(res?.data?.courses || []);
            } finally {
                setIsLoading(false);
            }
        }, filters.search ? 350 : 0);
        return () => clearTimeout(timer);
    }, [filters, locale]);

    const setFilter = (key, value) =>
        setFilters((prev) => {
            const next = { ...prev, [key]: value };
            // Changing category invalidates the selected specialisation.
            if (key === "category_id") next.specialization_id = "";
            return next;
        });

    const activeCategory = useMemo(
        () => categories?.find((c) => String(c.id) === String(filters.category_id)),
        [categories, filters.category_id]
    );

    const hasActiveFilters = Object.values(filters).some(Boolean);

    return (
        <div className={styles.calendar}>
            {/* ── Page header ── */}
            <div className={styles.hero}>
                <div className={stylesContainer.container}>
                    <h1 className={styles.heroTitle}>
                        {t('title')} <span>{t('titleSpan')}</span>
                    </h1>
                    <p className={styles.heroSubtitle}>{t('subtitle')}</p>
                </div>
            </div>

            <div className={stylesContainer.container}>
                {/* ── Filters ── */}
                <div className={styles.filters}>
                    <div className={`${styles.filterField} ${styles.filterSearch}`}>
                        <Search size={16} aria-hidden="true" />
                        <input
                            type="text"
                            value={filters.search}
                            placeholder={t('filters.keyword')}
                            onChange={(e) => setFilter("search", e.target.value)}
                        />
                    </div>

                    <select
                        className={styles.filterField}
                        value={filters.category_id}
                        onChange={(e) => setFilter("category_id", e.target.value)}
                        aria-label={t('filters.category')}
                    >
                        <option value="">{t('filters.category')}</option>
                        {categories?.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        className={styles.filterField}
                        value={filters.specialization_id}
                        onChange={(e) => setFilter("specialization_id", e.target.value)}
                        aria-label={t('filters.specialization')}
                    >
                        <option value="">{t('filters.specialization')}</option>
                        {(activeCategory?.specializations ||
                            categories?.flatMap((c) => c.specializations || []))?.map((spec) => (
                            <option key={spec.id} value={spec.id}>{spec.name}</option>
                        ))}
                    </select>

                    <select
                        className={styles.filterField}
                        value={filters.city_id}
                        onChange={(e) => setFilter("city_id", e.target.value)}
                        aria-label={t('filters.city')}
                    >
                        <option value="">{t('filters.city')}</option>
                        {cities?.map((city) => (
                            <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                    </select>

                    <input
                        type="month"
                        className={styles.filterField}
                        value={filters.date}
                        onChange={(e) => setFilter("date", e.target.value)}
                        aria-label={t('filters.date')}
                    />

                    {hasActiveFilters && (
                        <button
                            type="button"
                            className={styles.resetBtn}
                            onClick={() => setFilters(EMPTY_FILTERS)}
                        >
                            <RotateCcw size={14} aria-hidden="true" /> {t('filters.reset')}
                        </button>
                    )}
                </div>

                {/* ── Results ── */}
                {isLoading ? (
                    <div className={styles.rows}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} type="card" className={styles.skeletonRow} />
                        ))}
                    </div>
                ) : courses.length === 0 ? (
                    <p className={styles.noResults}>{t('noResults')}</p>
                ) : (
                    <div className={styles.rows}>
                        <div className={`${styles.row} ${styles.rowHead}`} aria-hidden="true">
                            <span>{t('columns.course')}</span>
                            <span>{t('columns.city')}</span>
                            <span>{t('columns.dates')}</span>
                            <span>{t('columns.price')}</span>
                            <span />
                        </div>
                        {courses.map((course) => (
                            <div key={course.id} className={styles.row}>
                                <div className={styles.courseCell}>
                                    <h3>{course.name}</h3>
                                    <div className={styles.courseMeta}>
                                        {course.category?.name && (
                                            <span><Tag size={12} aria-hidden="true" /> {course.category.name}</span>
                                        )}
                                        {course.specialization?.name && (
                                            <span>{course.specialization.name}</span>
                                        )}
                                    </div>
                                </div>
                                <div className={styles.cityCell}>
                                    <MapPin size={14} aria-hidden="true" />
                                    {course.city?.name}
                                </div>
                                <div className={styles.datesCell}>
                                    {course.dates?.map((session) => (
                                        <span key={session.id} className={styles.dateChip}>
                                            <Calendar size={12} aria-hidden="true" /> {session.date}
                                        </span>
                                    ))}
                                </div>
                                <div className={styles.priceCell}>£{course.price}</div>
                                <div className={styles.actionsCell}>
                                    <Link
                                        href={`/${locale}/registerCourse?course_id=${course.id}`}
                                        className={styles.registerBtn}
                                    >
                                        {t('register')}
                                    </Link>
                                    <Link
                                        href={`/${locale}/course_details/${course.id}/${encodeURIComponent(course.slug ?? "")}`}
                                        className={styles.detailsBtn}
                                    >
                                        {t('details')}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarPage;
