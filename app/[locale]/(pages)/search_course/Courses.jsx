"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ArrowRight, ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "./Header";
import UpcomingCouresCard from "@/components/ui/UpcomingCouresCard";
import styleContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/search-course/search-course.module.scss";
import MotionWrapper from "@/components/common/MotionWrapper";
import { getCourses } from "@/action/courses";
import Skeleton from "@/components/ui/Skeleton";
import FilterPanel from "./FilterPanel";
import ViewToggle from "@/components/common/ViewToggle";
import ExportPdfButton from "@/components/common/ExportPdfButton";
import Image from "next/image";
import NoData from "@/components/common/NoData";
import { useTranslations, useLocale } from "next-intl";

const DEFAULT_COURSE_IMAGE = "/asstes/default-2.webp";

function resolveCourseImage(image) {
  if (typeof image !== "string") return DEFAULT_COURSE_IMAGE;
  const normalizedImage = image.trim();
  if (!normalizedImage || normalizedImage === "null" || normalizedImage === "undefined") {
    return DEFAULT_COURSE_IMAGE;
  }
  return normalizedImage;
}

const CourseListItem = ({ course, locale, filterLanguage, t }) => {
  const imageSrc = resolveCourseImage(course?.image);
  const registerParams = new URLSearchParams();
  if (course?.id) registerParams.set("course_id", course.id);
  const lang = course?.language || filterLanguage;
  if (lang) registerParams.set("language", lang);
  const registerUrl = `/${locale}/registerCourse?${registerParams.toString()}`;
  const detailUrl = `/${locale}/course_details/${course?.id}/${encodeURIComponent(course?.slug ?? "")}`;

  return (
    <div className={styles.listItem}>
      <div className={styles.listItemImageWrapper}>
        <Image
          src={imageSrc}
          alt={course?.name || course?.title || 'Course thumbnail'}
          width={180}
          height={100}
          sizes="(max-width: 640px) 100vw, 180px"
          loading="lazy"
        />
        {course.category && (
          <span className={styles.listItemCategoryTag} title={course.category?.name}>
            {course.category?.name}
          </span>
        )}
        {course.price && <span className={styles.listItemPriceTag}>£{course.price}</span>}
      </div>
      <div className={styles.listItemContent}>
        <p className={styles.listItemDescription}>{course.name}</p>
        <div className={styles.listItemMeta}>
          <div className={styles.listItemDate}>
            <Calendar color="#1E2749" size={14} />
            <span>{course?.created_at?.split("T")[0]}</span>
          </div>
          <div className={styles.listItemDuration}>
            <Clock color="#1E2749" size={14} />
            <span>1-2 {t('weeks')}</span>
          </div>
        </div>
        <div className={styles.listItemBtns}>
          <a href={registerUrl} className={styles.listItemBtnRegister}>
            {t('register')}
          </a>
          <a href={detailUrl} className={styles.listItemBtnDetails}>
            {t('details')}
          </a>
        </div>
      </div>
    </div>
  );
};

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
                                            <div className={styles.coursesList}>
                                                {
                                                    data?.courses?.length === 0 ? (
                                                       <div className={styles.noDataFound}>
                                                         <NoData message={t('noCoursesFound')} />
                                                        </div>
                                                    ) : (
                                                        data?.courses?.slice(0, visibleCount)?.map((course, index) => (
                                                            <CourseListItem key={index} course={course} locale={locale} filterLanguage={searchParams.get('lang')} t={t} />
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