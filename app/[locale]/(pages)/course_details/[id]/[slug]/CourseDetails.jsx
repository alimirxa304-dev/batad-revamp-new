"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Languages,
  Mail,
  Monitor,
  Play,
  Printer,
} from "lucide-react";
import Tabs from "@/components/common/Tabs";
import DropdownMenuCustom from "@/components/common/DropdownMenu";
import UpcomingCouresCard from "@/components/ui/UpcomingCouresCard";
import useCitiesStore from "@/store/useCitiesStore";
import Header from "./Header";
import stylesContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/course-details/course-details.module.scss";
import { useTranslations } from "next-intl";

// The printable course PDF is served by the Laravel site (not part of this Next.js
// app), so it can't be built from NEXT_PUBLIC_SITE_URL — that resolves to localhost
// in dev, where this route doesn't exist.
const LARAVEL_SITE_URL = "https://batdacademy.com";

const CourseDetails = ({ initialCourse }) => {
  const t = useTranslations('CourseDetails');
  const tCommon = useTranslations();
  const [activeTabId, setActiveTabId] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const { cities, handleGetCities } = useCitiesStore();
  const { id, locale } = useParams();
  const isRtl = locale === "ar";
  const course = initialCourse;
  // Tabs.jsx (shared component) renders its own scrollable div and doesn't
  // forward a ref, so this wraps it and reaches that div via firstElementChild
  // instead of modifying the shared component just for this page.
  const tabsWrapperRef = useRef(null);
  const tabsBarRef = useRef(null);
  // Which end of the (possibly overflowing) tabs row is currently reachable —
  // drives hiding the prev/next arrow once there's nothing left that way.
  const [tabsEdges, setTabsEdges] = useState({ atStart: true, atEnd: false });
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;
  const registerUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("course_id", id);
    if (selectedDate) params.set("date", selectedDate);
    if (selectedCity) params.set("city_id", selectedCity);
    return `/${locale}/registerCourse?${params.toString()}`;
  }, [locale, id, selectedDate, selectedCity]);

  // Searchable dropdown options for the booking card.
  const dateOptions = useMemo(
    () =>
      (course?.dates || []).map((session) => ({
        label: session.time ? `${session.date} — ${session.time}` : session.date,
        value: session.date,
      })),
    [course?.dates]
  );
  const cityOptions = useMemo(
    () => (cities || []).map((city) => ({ label: city.name, value: city.id })),
    [cities]
  );

  // Instructor shown in the sticky side card; falls back to a senior trainer
  // from the academy roster when the API doesn't provide one.
  const instructor = course?.instructor || {
    name: "Dr. Faysal Shahne",
    job: "Management Trainer & Expert",
    image: "/asstes/team/1787513947.png",
    rating: "4.9",
    students: "8,600+",
    courses_count: 24,
  };

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const handleXShare = () => {
    // URL-only: X unfurls title/description/image itself from the page's own
    // meta tags, so passing a duplicate `text` would just show redundant text
    // above the card instead of a clean link preview.
    const shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
  };

  const handleGmailShare = () => {
    const shareUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(course?.name || "")}&body=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handlePrint = () => {
    const courseId = course?.id || id;
    const printUrl = `${LARAVEL_SITE_URL}/${locale}/show_course_content_pdf/${courseId}`;
    window.open(printUrl, "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    handleGetCities();
  }, []);

  const getTabsTrackEl = () => tabsWrapperRef.current?.firstElementChild || null;

  // Scrolls the tabs row one "page"; direction is flipped in RTL so the
  // visual arrows always move content the way they point.
  const scrollTabs = (dir) => {
    const el = getTabsTrackEl();
    if (!el) return;
    el.scrollBy({ left: dir * (isRtl ? -1 : 1) * el.clientWidth * 0.7, behavior: "smooth" });
  };

  // Whether the first/last tab is currently visible within the row's own
  // viewport — i.e. whether there's anything left to scroll to on that side.
  // Compares bounding boxes rather than scrollLeft since scrollLeft's sign
  // convention in RTL differs across browsers and is easy to get wrong.
  const measureTabsEdges = () => {
    const el = getTabsTrackEl();
    if (!el || !el.children.length) return { atStart: true, atEnd: true };
    const trackRect = el.getBoundingClientRect();
    const first = el.children[0].getBoundingClientRect();
    const last = el.children[el.children.length - 1].getBoundingClientRect();
    return isRtl
      ? { atStart: first.right <= trackRect.right + 1, atEnd: last.left >= trackRect.left - 1 }
      : { atStart: first.left >= trackRect.left - 1, atEnd: last.right <= trackRect.right + 1 };
  };

  useEffect(() => {
    const el = getTabsTrackEl();
    const onScroll = () => setTabsEdges(measureTabsEdges());
    onScroll();
    el?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [course?.tabs]);

  // Tabs no longer swap the displayed content — every section renders
  // stacked on the page, and clicking a tab just scrolls to its section
  // (offset by the sticky tabs bar's own current height, whatever that is
  // at the current breakpoint) instead of hiding the others.
  const scrollToSection = (tabId) => {
    setActiveTabId(tabId);
    const target = document.getElementById(`course-tab-section-${tabId}`);
    if (!target) return;
    const barBottom = tabsBarRef.current?.getBoundingClientRect().bottom || 0;
    const top = window.scrollY + target.getBoundingClientRect().top - barBottom - 16;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section>
      <Header courseName={course?.name} />
      {/* ── Title hero band (reference style) ── */}
      <div className={styles.pageHero}>
        <div className={stylesContainer.container}>
          <div className={styles.pageHeroInner}>
            <div className={styles.pageHeroText}>
              <h1 className={styles.pageHeroTitle}>{course?.name}</h1>
              {course?.category?.name && (
                <p className={styles.pageHeroCategory}>
                  <BookOpen size={17} aria-hidden="true" /> {course.category.name}
                </p>
              )}

              <div className={styles.pageHeroActions}>
                <span className={styles.pageHeroOnlineBadge}>
                  <Monitor size={17} aria-hidden="true" /> {t('heroOnlineAvailable')}
                </span>
                <Link href={registerUrl} className={styles.pageHeroRegisterBtn}>
                  {t('registerNow')}
                </Link>
              </div>
            </div>

            {course?.image && (
              <div className={styles.pageHeroImage}>
                <Image
                  src={course.image}
                  alt={course?.name || "course-image"}
                  fill
                  sizes="(max-width: 900px) 100vw, 380px"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={stylesContainer.container}>
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.details}>
              <div className={styles.contentCourse}>
                <div className={styles.info}>
                  <div className={styles.infoMain}>
                  {/* ── Sticky tabs bar — scoped to this column's width only,
                      so it doesn't sit above the sidebar and can start at
                      the same level as the instructor card next to it ── */}
                  <div className={styles.stickyTabsBar} ref={tabsBarRef}>
                    <div className={styles.tabsRow}>
                      {/* Pinned CTA on mobile — sits outside the scrollable
                          track so it never slides away with the other tabs. */}
                      <Link href={registerUrl} className={styles.tabsRegisterBtn}>
                        {t('registerNow')}
                      </Link>
                      {!tabsEdges.atStart && (
                        <button
                          type="button"
                          className={styles.tabsChevron}
                          aria-label="previous"
                          onClick={() => scrollTabs(-1)}
                        >
                          <PrevIcon size={16} aria-hidden="true" />
                        </button>
                      )}
                      <div ref={tabsWrapperRef} className={styles.tabsTrack}>
                        <Tabs
                          tabs={course?.tabs}
                          activeTabId={activeTabId}
                          onTabChange={scrollToSection}
                          className={styles.courseTabs}
                          tabClassName={styles.courseTabItem}
                          activeTabClassName={styles.active}
                        />
                      </div>
                      {!tabsEdges.atEnd && (
                        <button
                          type="button"
                          className={styles.tabsChevron}
                          aria-label="next"
                          onClick={() => scrollTabs(1)}
                        >
                          <NextIcon size={16} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={styles.summaryContent}>
                    <div className={styles.left}>
                      <div className={styles.top}>
                        <div className={styles.title}>
                          <h2>{course?.name}</h2>
                          <div className={styles.iconShare}>
                            <span>{t('share')}</span>
                            <div className={styles.icons}>
                              <button
                                type="button"
                                aria-label="Share on Facebook"
                                onClick={handleFacebookShare}
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                >
                                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                aria-label="Share on X"
                                onClick={handleXShare}
                              >
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                >
                                  <mask
                                    id="mask0_560_9573"
                                    style={{ maskType: "luminance" }}
                                    maskUnits="userSpaceOnUse"
                                    x="0"
                                    y="0"
                                    width="18"
                                    height="18"
                                  >
                                    <path d="M0 0H18V18H0V0Z" fill="white" />
                                  </mask>
                                  <g mask="url(#mask0_560_9573)">
                                    <path
                                      d="M14.175 0.843414H16.9354L10.9054 7.75284L18 17.1566H12.4457L8.09229 11.4544L3.11657 17.1566H0.353571L6.80271 9.7637L0 0.8447H5.69571L9.62486 6.0557L14.175 0.843414ZM13.2043 15.5006H14.7343L4.86 2.41327H3.21943L13.2043 15.5006Z"
                                      fill="currentColor"
                                    />
                                  </g>
                                </svg>
                              </button>
                              <button
                                type="button"
                                aria-label="Share via Gmail"
                                onClick={handleGmailShare}
                              >
                                <Mail size={18} aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                aria-label="Print"
                                onClick={handlePrint}
                              >
                                <Printer size={18} aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div
                          dangerouslySetInnerHTML={{ __html: course?.details }}
                        />
                      </div>
                    </div>

                  </div>

                  {course?.tabs?.map((tab) => (
                    <div
                      key={tab.id}
                      id={`course-tab-section-${tab.id}`}
                      className={styles.tabContainer}
                    >
                      <div className={styles.tabContent}>
                        <h3>{tab.title}</h3>
                        <div dangerouslySetInnerHTML={{ __html: tab.content }} />
                      </div>
                    </div>
                  ))}

                  <div className={styles.similarCourses}>
                    <div className={styles.top}>
                      <h2>{t('similarCourses')}</h2>
                      <Link
                        href={`/${locale}/search_course`}
                        className={styles.seeAll}
                      >
                        {t('seeAll')} <ArrowRight size={19} />
                      </Link>
                    </div>
                    <div className={styles.courses}>
                      {course?.similar_courses?.slice(0, 3).map((course) => {
                        return (
                          <UpcomingCouresCard key={course.id} course={course} />
                        );
                      })}
                    </div>
                  </div>
                  </div>

                  {/* ── Sticky course card: instructor + info rows + booking ── */}
                  <aside className={styles.rightCol}>
                    <div className={styles.instructorCard}>
                      <div className={styles.instructorHeader}>
                        <div className={styles.instructorPhoto}>
                          <Image
                            src={instructor.image}
                            alt={instructor.name}
                            width={300}
                            height={300}
                          />
                        </div>
                        <div className={styles.instructorHeaderText}>
                          <span className={styles.instructorLabel}>{t('instructorTitle')}</span>
                          <h3 className={styles.instructorName}>{instructor.name}</h3>
                          <p className={styles.instructorJob}>{instructor.job}</p>
                        </div>
                      </div>

                      <div className={styles.cardRows}>
                        <div className={styles.cardRow}>
                          <span className={styles.cardRowLabel}>
                            <Clock size={16} aria-hidden="true" /> {t('duration')}
                          </span>
                          <span className={styles.cardRowValue}>
                            {course?.week_number === 1
                              ? t('oneWeek')
                              : course?.week_number
                                ? `${course.week_number} ${tCommon('weeks')}`
                                : `1-2 ${tCommon('weeks')}`}
                          </span>
                        </div>
                        <div className={styles.cardRow}>
                          <span className={styles.cardRowLabel}>
                            <Banknote size={16} aria-hidden="true" /> {t('price')}
                          </span>
                          <span className={styles.cardRowValue}>£{course?.price}</span>
                        </div>
                        <div className={styles.cardRow}>
                          <span className={styles.cardRowLabel}>
                            <Languages size={16} aria-hidden="true" /> {t('language')}
                          </span>
                          <span className={styles.cardRowValue}>{t('languageValue')}</span>
                        </div>
                      </div>

                      <DropdownMenuCustom
                        label={t('courseDates')}
                        options={dateOptions}
                        value={selectedDate}
                        onChange={setSelectedDate}
                        triggerClassName={styles.cardSelect}
                        icon={<ChevronDown size={16} aria-hidden="true" />}
                      />

                      <DropdownMenuCustom
                        label={t('courseCities')}
                        options={cityOptions}
                        value={selectedCity}
                        onChange={setSelectedCity}
                        triggerClassName={styles.cardSelect}
                        icon={<ChevronDown size={16} aria-hidden="true" />}
                      />

                      <Link
                        href={registerUrl}
                        className={`${styles.instructorRegisterBtn} ${selectedDate ? styles.instructorRegisterBtnReady : ""}`}
                      >
                        {t('registerNow')}
                      </Link>
                      <Link
                        href={`/${locale}/registerInternalCourse?course_id=${id}`}
                        className={styles.instructorOutlineBtn}
                      >
                        {t('requestInternal')}
                      </Link>
                    </div>
                  </aside>
                </div>

                {course?.video && (
                  <div className={styles.videos}>
                    <div className={styles.top}>
                      <span>
                        <Play />
                      </span>
                      <div className={styles.info}>
                        <h2>{t('courseVideo')}</h2>
                        <p>{t('videoPreview')}</p>
                      </div>
                    </div>
                    <video src={course?.video}></video>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseDetails;
