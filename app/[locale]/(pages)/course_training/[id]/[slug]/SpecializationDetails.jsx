"use client";

import Skeleton from "@/components/ui/Skeleton";
import UpcomingCouresCard from "@/components/ui/UpcomingCouresCard";
import SidebarFilter from "@/components/common/SidebarFilter";
import stylesContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/category-details/category-details.module.scss";
import { getCourses } from "@/action/courses";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cleanMeta } from "@/lib/seoMeta";

const SpecializationDetails = ({ initialSpecialization, initialCoursesData, specializationId }) => {
  const t = useTranslations('CourseTraning');
  const locale = useLocale();
  const [data, setData] = useState(initialCoursesData);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitialMount = useRef(true);

  const specializationName = initialSpecialization?.name;
  const specializationDescription = cleanMeta(
    initialSpecialization?.meta?.description || initialSpecialization?.description
  );
  // A specialization's own `description` field is very often just its name repeated
  // (e.g. "Project Management Courses") — showing that as a second, redundant "body"
  // line under the H1 would just duplicate the heading, so it's only rendered when it
  // actually adds content beyond the name.
  const showDescription = specializationDescription && specializationDescription !== specializationName;

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
    // The server already fetched this specialization's courses for the initial URL
    // (see page.jsx) — skip the redundant refetch on mount and only react to later
    // filter changes.
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("specialization_id", specializationId);
    fetchCourses(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, specializationId]);


  const handleViewMore = () => {
    if (data?.courses && visibleCount < data.courses.length) {
      setVisibleCount(prev => prev + 6);
    } else if (data?.has_more) {
      setVisibleCount(prev => prev + 6);
      const params = new URLSearchParams();
      params.set("specialization_id", specializationId);
      params.set('cursor', data.next_cursor);
      fetchCourses(`?${params.toString()}`, true);
    }
  };
  // Find the parent category that contains this specialization
  const parentCategoryId = data?.categories?.find((cat) =>
    cat.specializations?.some((spec) => String(spec.id) === String(specializationId))
  )?.id ?? null;

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
      <Header specializationName={specializationName} />

      <div className={styles.mainContent}>
        <div className={stylesContainer.container}>
          <div className={styles.contentWrapper}>
            {showDescription && (
              <div className={styles.description}>
                {/* Header.jsx already renders the page's single <h1> with this same
                    specializationName — this stays an <h2> so the page never ends up
                    with two H1s. */}
                <h2>{specializationName}</h2>
                <p>{specializationDescription}</p>
              </div>
            )}

            <div className={styles.content}>

              <SidebarFilter
                data={data}
                updateFilter={updateFilter}
                activeCategoryId={parentCategoryId != null ? String(parentCategoryId) : null}
                activeSpecializationId={String(specializationId)}
              />

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
                      <h3>{t('noCoursesFound')}</h3>
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

export default SpecializationDetails;
