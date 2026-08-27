"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ArrowLeft, Filter, X } from "lucide-react";
import Header from "./Header";
import UpcomingCouresCard from "@/components/ui/UpcomingCouresCard";
import styleContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/search-course/search-course.module.scss";
import MotionWrapper from "@/components/common/MotionWrapper";
import { getCourses } from "@/action/courses";
import Skeleton from "@/components/ui/Skeleton";
import SidebarFilter from "@/components/common/SidebarFilter";
import Image from "next/image";
import NoData from "@/components/common/NoData";
import { useTranslations, useLocale } from "next-intl";


const CoursesPage = ({ initialCoursesData }) => {
    const t = useTranslations('SearchCourse');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    // Multiples of 4 to match the 4-across results grid.
    const [visibleCount, setVisibleCount] = useState(8);
    const [data, setData] = useState(initialCoursesData);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const isInitialMount = useRef(true);

    useEffect(() => {
        setMounted(true);
    }, []);

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
        // The server already fetched courses for this exact URL (see page.jsx) — skip
        // the redundant refetch on mount and only react to later filter changes.
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <div className={styles.coursesWrapper}>
                                <div className={styles.courses}>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                        <Skeleton key={i} type="card" height="400px" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.wrapper}>
                            {/* Filters live in an overlay drawer, opened from this button. */}
                            <div className={styles.toolbar}>
                                <Dialog.Root modal={true}>
                                    <Dialog.Trigger asChild>
                                        <button className={styles.filterBtn} type="button">
                                            <Filter size={17} aria-hidden="true" /> {t('filters')}
                                        </button>
                                    </Dialog.Trigger>
                                    {mounted && (
                                        <Dialog.Portal>
                                            <Dialog.Overlay className={styles.drawerOverlay} />
                                            <Dialog.Content className={styles.drawerContent}>
                                                <div className={styles.drawerHeader}>
                                                    <Dialog.Title className={styles.drawerTitle}>
                                                        {t('filters')}
                                                    </Dialog.Title>
                                                    <Dialog.Close className={styles.drawerClose}>
                                                        <X size={20} aria-hidden="true" />
                                                    </Dialog.Close>
                                                </div>
                                                <SidebarFilter updateFilter={updateFilter} data={data} className='mobileFilter' />
                                            </Dialog.Content>
                                        </Dialog.Portal>
                                    )}
                                </Dialog.Root>
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

                                        {(visibleCount < (data?.courses?.length || 0) || data?.has_more) && (
                                            <button className={styles.showMoreBtn} onClick={handleViewMore}>
                                                {t('viewMore')} {locale === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                                            </button>
                                        )}
                                    </>
                                )}
                            </MotionWrapper>
                        </div>
                    )}
                </div>
            </div>
        </section>

    );
};


export default CoursesPage;