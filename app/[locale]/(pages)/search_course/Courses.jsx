"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Header from "./Header";
import UpcomingCouresCard from "@/components/ui/UpcomingCouresCard";
import CourseListItem from "@/components/ui/CourseListItem";
import styleContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/search-course/search-course.module.scss";
import listStyles from "@/sass/components/ui/course-list-item.module.scss";
import MotionWrapper from "@/components/common/MotionWrapper";
import { getCourses } from "@/action/courses";
import Skeleton from "@/components/ui/Skeleton";
import FilterPanel from "./FilterPanel";
import ViewToggle from "@/components/common/ViewToggle";
import ExportPdfButton from "@/components/common/ExportPdfButton";
import NoData from "@/components/common/NoData";
import { useTranslations, useLocale } from "next-intl";

const CoursesPage = ({ initialCoursesData }) => {
    const t = useTranslations('SearchCourse');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [visibleCount, setVisibleCount] = useState(8);
    const [data, setData] = useState(initialCoursesData);
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const isInitialMount = useRef(true);

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
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        const params = new URLSearchParams(searchParams.toString());

        if (params.has('type')) {
            params.set('taxonomy', params.get('type'));
            params.delete('type');
        }

        const paramsString = params.toString();

        const queryString = paramsString ? `?${paramsString}` : "";
        fetchCourses(queryString);
    }, [searchParams]);
    const firstCourseId = data?.courses?.[0]?.id;
    useEffect(() => {
        setVisibleCount(8);
    }, [firstCourseId]);

    const handleViewMore = () => {
        if (data?.courses && visibleCount < data.courses.length) {
            setVisibleCount(prev => prev + 8);
        } else if (data?.has_more) {
            setVisibleCount(prev => prev + 8);
            const params = new URLSearchParams(window.location.search);
            if (params.has('type')) {
                params.set('taxonomy', params.get('type'));
                params.delete('type');
            }
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
        <section className={styles.searchCourse}>
            <Header updateFilter={updateFilter} categories={data?.categories} specializations={data?.specializations} cities={data?.cities} />
            <div className={styles.mainContent}>
                <div className={styleContainer.container}>
                    {!data ? (
                        <div className={styles.wrapper}>
                            <aside className={styles.sidebarCol}>
                                <Skeleton type="card" height="480px" />
                            </aside>
                            <div className={styles.mainCol}>
                                <div className={styles.coursesWrapper}>
                                    <div className={styles.courses}>
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <Skeleton key={i} type="card" height="400px" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.wrapper}>
                            {/* ── Persistent filter sidebar (25%) ── */}
                            <aside className={styles.sidebarCol}>
                                <FilterPanel cities={data?.cities} />
                            </aside>

                            <div className={styles.mainCol}>
                            <div className={styles.toolbar}>
                                <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                                <ExportPdfButton />
                            </div>

                            <MotionWrapper className={styles.coursesWrapper}>
                                {isLoading ? (
                                    <div className={styles.courses}>
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <Skeleton key={i} type="card" height="400px" />
                                        ))}
                                    </div>
                                ) : (
                                    <>
                                        {viewMode === 'grid' ? (
                                            <div className={styles.courses}>
                                                {
                                                    data?.courses?.length === 0 ? (
                                                       <div className={styles.noDataFound}>
                                                         <NoData message={t('noCoursesFound')} />
                                                        </div>
                                                    ) : (
                                                        data?.courses?.slice(0, visibleCount)?.map((course, index) => (
                                                            <UpcomingCouresCard key={index} course={course} filterLanguage={searchParams.get('lang')} locale={locale} index={index} />
                                                        ))
                                                    )

                                                }
                                            </div>
                                        ) : (
                                            <div className={listStyles.coursesList}>
                                                {
                                                    data?.courses?.length === 0 ? (
                                                       <div className={styles.noDataFound}>
                                                         <NoData message={t('noCoursesFound')} />
                                                        </div>
                                                    ) : (
                                                        data?.courses?.slice(0, visibleCount)?.map((course, index) => (
                                                            <CourseListItem key={index} course={course} locale={locale} filterLanguage={searchParams.get('lang')} />
                                                        ))
                                                    )
                                                }
                                            </div>
                                        )}

                                        {(visibleCount < (data?.courses?.length || 0) || data?.has_more) && (
                                            <button className={styles.showMoreBtn} onClick={handleViewMore}>
                                                {t('viewMore')} {locale === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                                            </button>
                                        )}
                                    </>
                                )}
                            </MotionWrapper>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CoursesPage;