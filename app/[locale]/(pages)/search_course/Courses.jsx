"use client";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ArrowLeft, Filter, X, LayoutGrid, List, Download, Mail, User, Phone, Building2, Loader2, CheckCircle, Calendar, Clock } from "lucide-react";
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
    const [mounted, setMounted] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfFormData, setPdfFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        company: ''
    });
    const [pdfFormErrors, setPdfFormErrors] = useState({});
    const [pdfSubmitting, setPdfSubmitting] = useState(false);
    const [pdfSubmitStatus, setPdfSubmitStatus] = useState(null);
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

    const validatePdfForm = () => {
        const errors = {};
        if (!pdfFormData.fullName.trim()) errors.fullName = t('fullName') + ' is required';
        if (!pdfFormData.email.trim()) errors.email = t('email') + ' is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pdfFormData.email)) errors.email = 'Invalid email format';
        if (!pdfFormData.phone.trim()) errors.phone = t('phone') + ' is required';
        setPdfFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handlePdfSubmit = async (e) => {
        e.preventDefault();
        if (!validatePdfForm()) return;

        setPdfSubmitting(true);
        setPdfSubmitStatus(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setPdfSubmitStatus('success');
            setPdfFormData({ fullName: '', email: '', phone: '', company: '' });
            setTimeout(() => {
                setIsPdfModalOpen(false);
                setPdfSubmitStatus(null);
            }, 2000);
        } catch {
            setPdfSubmitStatus('error');
        } finally {
            setPdfSubmitting(false);
        }
    };

    const handlePdfInputChange = (e) => {
        const { name, value } = e.target;
        setPdfFormData(prev => ({ ...prev, [name]: value }));
        if (pdfFormErrors[name]) {
            setPdfFormErrors(prev => ({ ...prev, [name]: null }));
        }
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

                                <div className={styles.viewToggle}>
                                    <button
                                        className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                                        onClick={() => setViewMode('grid')}
                                        aria-label={t('gridView')}
                                        title={t('gridView')}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                                        onClick={() => setViewMode('list')}
                                        aria-label={t('listView')}
                                        title={t('listView')}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>

                                <Dialog.Root open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
                                    <Dialog.Trigger asChild>
                                        <button className={styles.pdfBtn} type="button">
                                            <Download size={17} aria-hidden="true" /> {t('downloadPDF')}
                                        </button>
                                    </Dialog.Trigger>
                                    <Dialog.Portal>
                                        <Dialog.Overlay className={styles.pdfModalOverlay} />
                                        <Dialog.Content className={styles.pdfModalContent}>
                                            <div className={styles.pdfModalHeader}>
                                                <Dialog.Title className={styles.pdfModalTitle}>
                                                    {t('pdfDownloadTitle')}
                                                </Dialog.Title>
                                                <Dialog.Close className={styles.pdfModalClose}>
                                                    <X size={20} aria-hidden="true" />
                                                </Dialog.Close>
                                            </div>
                                            {pdfSubmitStatus === 'success' ? (
                                                <div className={styles.pdfSuccess}>
                                                    <CheckCircle size={48} className={styles.successIcon} />
                                                    <p className={styles.successMessage}>{t('successMessage')}</p>
                                                </div>
                                            ) : (
                                                <form onSubmit={handlePdfSubmit} className={styles.pdfForm}>
                                                    <p className={styles.pdfDescription}>{t('pdfDownloadDescription')}</p>
                                                    <div className={styles.pdfFormGroup}>
                                                        <label htmlFor="fullName" className={styles.pdfFormLabel}>
                                                            {t('fullName')} <span className={styles.required}>*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="fullName"
                                                            name="fullName"
                                                            className={`${styles.pdfFormInput} ${pdfFormErrors.fullName ? styles.error : ''}`}
                                                            value={pdfFormData.fullName}
                                                            onChange={handlePdfInputChange}
                                                            placeholder={t('fullName')}
                                                            disabled={pdfSubmitting}
                                                        />
                                                        {pdfFormErrors.fullName && <span className={styles.errorMessage}>{pdfFormErrors.fullName}</span>}
                                                    </div>
                                                    <div className={styles.pdfFormGroup}>
                                                        <label htmlFor="email" className={styles.pdfFormLabel}>
                                                            {t('email')} <span className={styles.required}>*</span>
                                                        </label>
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            className={`${styles.pdfFormInput} ${pdfFormErrors.email ? styles.error : ''}`}
                                                            value={pdfFormData.email}
                                                            onChange={handlePdfInputChange}
                                                            placeholder={t('email')}
                                                            disabled={pdfSubmitting}
                                                        />
                                                        {pdfFormErrors.email && <span className={styles.errorMessage}>{pdfFormErrors.email}</span>}
                                                    </div>
                                                    <div className={styles.pdfFormGroup}>
                                                        <label htmlFor="phone" className={styles.pdfFormLabel}>
                                                            {t('phone')} <span className={styles.required}>*</span>
                                                        </label>
                                                        <input
                                                            type="tel"
                                                            id="phone"
                                                            name="phone"
                                                            className={`${styles.pdfFormInput} ${pdfFormErrors.phone ? styles.error : ''}`}
                                                            value={pdfFormData.phone}
                                                            onChange={handlePdfInputChange}
                                                            placeholder={t('phone')}
                                                            disabled={pdfSubmitting}
                                                        />
                                                        {pdfFormErrors.phone && <span className={styles.errorMessage}>{pdfFormErrors.phone}</span>}
                                                    </div>
                                                    <div className={styles.pdfFormGroup}>
                                                        <label htmlFor="company" className={styles.pdfFormLabel}>
                                                            {t('company')}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="company"
                                                            name="company"
                                                            className={styles.pdfFormInput}
                                                            value={pdfFormData.company}
                                                            onChange={handlePdfInputChange}
                                                            placeholder={t('company')}
                                                            disabled={pdfSubmitting}
                                                        />
                                                    </div>
                                                    {pdfSubmitStatus === 'error' && (
                                                        <p className={styles.errorMessage}>{t('errorMessage')}</p>
                                                    )}
                                                    <button type="submit" className={styles.pdfSubmitBtn} disabled={pdfSubmitting}>
                                                        {pdfSubmitting ? (
                                                            <>
                                                                <Loader2 size={18} className={styles.spinner} /> {t('submitting')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Mail size={18} /> {t('submit')}
                                                            </>
                                                        )}
                                                    </button>
                                                </form>
                                            )}
                                        </Dialog.Content>
                                    </Dialog.Portal>
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
                    )}
                </div>
            </div>
        </section>
    );
};

export default CoursesPage;