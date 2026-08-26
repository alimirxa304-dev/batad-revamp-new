"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
import Header from "./Header";
import NavgationBar from "./NavgationBar";
import UpcomingCouresCard from "@/components/ui/UpcomingCouresCard";
import { getCourses } from "@/action/courses";
import Skeleton from "@/components/ui/Skeleton";
import SidebarFilter from "@/components/common/SidebarFilter";
import NoData from "@/components/common/NoData";
import stylesContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/course-details-by-city/course-details-by-city.module.scss";
import { useTranslations, useLocale } from "next-intl";

// Mirrors buildCourseListQuery in page.jsx exactly (type -> taxonomy rename, city_id
// from the route) so a client refetch (filters, show more) never disagrees with the
// server's initial fetch.
function buildCourseListQuery(searchParams, cityId) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.has('type')) {
        params.set('taxonomy', params.get('type'));
        params.delete('type');
    }
    params.set("city_id", cityId);
    return `?${params.toString()}`;
}

const CourseByCityDetails = ({ initialCity, initialCityDescription, initialCoursesData, cityId }) => {
    const searchParams = useSearchParams();
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [data, setData] = useState(initialCoursesData);
    const [isLoading, setIsLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(6);
    const [mounted, setMounted] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
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
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // The server already fetched courses for this exact URL (see page.jsx) — skip
        // the redundant refetch on mount and only react to later filter/city changes.
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        fetchCourses(buildCourseListQuery(searchParams, cityId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, cityId]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("cursor");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleViewMore = () => {
        if (data?.courses && visibleCount < data.courses.length) {
            setVisibleCount(prev => prev + 6);
        } else if (data?.has_more) {
            setVisibleCount(prev => prev + 6);
            const params = new URLSearchParams(searchParams.toString());
            if (params.has('type')) {
                params.set('taxonomy', params.get('type'));
                params.delete('type');
            }
            params.set("city_id", cityId);
            params.set('cursor', data.next_cursor);
            fetchCourses(`?${params.toString()}`, true);
        }
    };

    return (
        <section className={styles.courseByCityDetails}>
            <NavgationBar cityName={initialCity?.name} />
            <Header
                updateFilter={updateFilter}
                onOpenFilters={() => setFilterOpen(true)}
                cityName={initialCity?.name}
                cityDescription={initialCityDescription}
            />

            <div className={styles.mainContent}>
                <div className={stylesContainer.container}>
                    <Dialog.Root modal={true} open={filterOpen} onOpenChange={setFilterOpen}>
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

                    <div className={styles.content}>
                        <SidebarFilter updateFilter={updateFilter} data={data}  className='filter'/>
                        <div className={styles.rightContent}>
                            {isLoading && !data?.courses ? (
                                <div className={styles.cards}>
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <Skeleton key={i} type="card" height="400px" />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className={styles.cards}>
                                        {
                                        data?.courses?.length === 0 ? (
                                            <div className={styles.noDataFound}>
                                              <NoData message={t('noCoursesFound')} />
                                             </div>
                                        ) : (
                                            data?.courses?.slice(0, visibleCount)?.map((course, index) => (
                                                <UpcomingCouresCard key={index} course={course} cityId={cityId} locale={locale} index={index} />
                                            ))
                                        )}
                                    </div>
                                    {(visibleCount < (data?.courses?.length || 0) || data?.has_more) && (
                                        <button className={styles.showMoreBtn} onClick={handleViewMore}>
                                            {t('showMore')} {locale === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CourseByCityDetails;
