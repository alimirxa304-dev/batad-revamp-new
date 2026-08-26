"use client";

import { useEffect, useRef, useState } from "react";
import UpcomingCouresCard from "@/components/ui/UpcomingCouresCard";
import Skeleton from "@/components/ui/Skeleton";
import SidebarFilter from "@/components/common/SidebarFilter";
import NoData from "@/components/common/NoData";
import Header from "./Header";
import stylesContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/category-details/category-details.module.scss";
import { getCourses } from "@/action/courses";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cleanMeta } from "@/lib/seoMeta";

const CategoryDetails = ({ initialCategory, initialCoursesData, categoryId }) => {
    const t = useTranslations('CourseTraning');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [visibleCount, setVisibleCount] = useState(6);
    const [data, setData] = useState(initialCoursesData);
    const [isLoading, setIsLoading] = useState(false);
    const isInitialMount = useRef(true);

    const categoryName = initialCategory?.name;
    const categoryDescription = cleanMeta(initialCategory?.meta?.description || initialCategory?.description);

    const fetchCourses = async (queryString, append = false) => {
        setIsLoading(!append);
        try {
            const res = await getCourses(locale, queryString);
            setData((prev) => {
                if (append && prev?.courses) {
                    return { ...res?.data, courses: [...prev.courses, ...(res?.data?.courses || [])] };
                }
                return res?.data || { courses: [] };
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // The server already fetched this category's courses for the initial URL (see
        // page.jsx) — skip the redundant refetch on mount and only react to later
        // filter changes.
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const params = new URLSearchParams(searchParams.toString());
        params.set("category_id", categoryId);
        fetchCourses(`?${params.toString()}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, categoryId]);

    const handleViewMore = () => {
        if (data?.courses && visibleCount < data.courses.length) {
            setVisibleCount(prev => prev + 6);
        } else if (data?.has_more) {
            setVisibleCount(prev => prev + 6);
            const params = new URLSearchParams(window.location.search);
            params.set("category_id", categoryId);
            params.set('cursor', data.next_cursor);
            fetchCourses(`?${params.toString()}`, true);
        }
    };

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        params.delete('cursor');

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };
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

                        <div className={styles.content}>
                            <SidebarFilter data={data} updateFilter={updateFilter} activeCategoryId={String(categoryId)} />
                            <div className={styles.rightWrapper}>

                            <div className={styles.rightContent}>
                                {isLoading ? (
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <Skeleton key={i} type="card" height="400px" />
                                    ))
                                ) : data?.courses?.length > 0 ? (
                                    data.courses.map((course, index) => (
                                        <UpcomingCouresCard key={index} course={course} locale={locale} index={index} />
                                    ))
                                ) : (
                                    <div className={styles.noCourses}>
                                        <NoData message={t('noCategoryCoursesFound')} />
                                    </div>
                                )}

                            </div>

                              {(visibleCount < (data?.courses?.length || 0) || data?.has_more) && (
                                    <button className={styles.showMoreBtn} onClick={handleViewMore}>
                                        {t('showMore')} {locale === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
export default CategoryDetails;
