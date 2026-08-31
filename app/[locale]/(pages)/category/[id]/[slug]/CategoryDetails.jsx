"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "./Header";
import SpecializationFilterPanel from "./SpecializationFilterPanel";
import Title from "@/components/common/Title";
import NoData from "@/components/common/NoData";
import ViewToggle from "@/components/common/ViewToggle";
import ExportPdfButton from "@/components/common/ExportPdfButton";
import stylesContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/category-details/category-details.module.scss";
import specStyles from "@/sass/pages/home/course-by-special.module.scss";
import { BookOpen } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cleanMeta, isPlaceholderImage } from "@/lib/seoMeta";

// Same "no image" detection used on the home page's specialisation cards.
const SpecIcon = ({ item }) => {
    const [iconFailed, setIconFailed] = useState(false);
    const hasValidIcon =
        !iconFailed && typeof item?.icon === "string" && item.icon.trim() && !isPlaceholderImage(item.icon);
    return (
        <div className={specStyles.specIcon}>
            {hasValidIcon ? (
                <Image
                    src={item.icon}
                    alt={item.name}
                    width={40}
                    height={40}
                    onError={() => setIconFailed(true)}
                />
            ) : (
                <BookOpen aria-hidden="true" />
            )}
        </div>
    );
};

// A main category's page is a picker for its specialisations — matching the
// same card design as the home page's "Courses by Specialisation" section
// (icon + name + course count + a View Courses button), not a course listing.
const CategoryDetails = ({ initialCategory }) => {
    const t = useTranslations('CourseTraning');
    const locale = useLocale();
    const [viewMode, setViewMode] = useState('grid');
    const [query, setQuery] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [minCourses, setMinCourses] = useState('');

    const categoryName = initialCategory?.name;
    const categoryDescription = cleanMeta(initialCategory?.meta?.description || initialCategory?.description);
    const specializations = initialCategory?.specializations || [];

    // Frontend-only search/sort/minimum-courses — there's no backend endpoint
    // for filtering a category's own specialisation list, so this just
    // narrows and reorders the array already fetched with the page.
    const filteredSpecializations = useMemo(() => {
        let list = specializations;

        const q = query.trim().toLowerCase();
        if (q) list = list.filter((item) => item.name?.toLowerCase().includes(q));

        if (minCourses) list = list.filter((item) => (item.courses_count || 0) >= Number(minCourses));

        if (sortBy) {
            list = [...list].sort((a, b) => {
                if (sortBy === 'az') return (a.name || '').localeCompare(b.name || '');
                if (sortBy === 'za') return (b.name || '').localeCompare(a.name || '');
                if (sortBy === 'most') return (b.courses_count || 0) - (a.courses_count || 0);
                if (sortBy === 'fewest') return (a.courses_count || 0) - (b.courses_count || 0);
                return 0;
            });
        }

        return list;
    }, [specializations, query, sortBy, minCourses]);

    return (
        <div className={styles.categoryDetails}>
            <Header categoryName={categoryName} />
            <div className={styles.mainContent}>
                <div className={stylesContainer.container}>
                    <div className={styles.contentWrapper}>
                        {categoryDescription && (
                            <div className={styles.description}>
                                {/* Header.jsx already renders the page's single <h1> with
                                    this same categoryName — this stays an <h2> so the page
                                    never ends up with two H1s. */}
                                <h2>{categoryName}</h2>
                                <p>{categoryDescription}</p>
                            </div>
                        )}

                        <div>
                            <Title
                                title={t('subSpecializationsTitle')}
                                span={t('subSpecializationsTitleSpan')}
                                subtitle={t('subSpecializationsSubtitle')}
                            />

                            {specializations.length === 0 ? (
                                <div className={styles.noCourses}>
                                    <NoData message={t('noCategoriesFound')} />
                                </div>
                            ) : (
                                <div className={styles.wrapper}>
                                    <aside className={styles.sidebarCol}>
                                        <SpecializationFilterPanel
                                            query={query}
                                            onQueryChange={setQuery}
                                            sortBy={sortBy}
                                            onSortChange={setSortBy}
                                            minCourses={minCourses}
                                            onMinCoursesChange={setMinCourses}
                                            resultCount={filteredSpecializations.length}
                                        />
                                    </aside>

                                    <div className={styles.mainCol}>
                                        <div className={styles.toolbar}>
                                            <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                                            <ExportPdfButton />
                                        </div>

                                        {filteredSpecializations.length === 0 ? (
                                            <div className={styles.noCourses}>
                                                <NoData message={t('noSpecializationsFound')} />
                                            </div>
                                        ) : viewMode === 'grid' ? (
                                            <div className={specStyles.specsGrid}>
                                                {filteredSpecializations.map((item) => (
                                                    <div key={item.id} className={specStyles.specCard}>
                                                        <SpecIcon item={item} />
                                                        <h3 className={specStyles.specName} title={item.name}>{item.name}</h3>
                                                        <p className={specStyles.specCount}>{item.courses_count} {t('coursesCount')}</p>
                                                        <Link
                                                            href={`/${locale}/course_training/${item.id}/${encodeURIComponent(item.slug)}`}
                                                            className={specStyles.specBtn}
                                                        >
                                                            {t('viewCourses')}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className={styles.specList}>
                                                {filteredSpecializations.map((item) => (
                                                    <div key={item.id} className={styles.specListItem}>
                                                        <SpecIcon item={item} />
                                                        <div className={styles.specListInfo}>
                                                            <h3 title={item.name}>{item.name}</h3>
                                                            <p>{item.courses_count} {t('coursesCount')}</p>
                                                        </div>
                                                        <Link
                                                            href={`/${locale}/course_training/${item.id}/${encodeURIComponent(item.slug)}`}
                                                            className={styles.specListBtn}
                                                        >
                                                            {t('viewCourses')}
                                                        </Link>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CategoryDetails;
