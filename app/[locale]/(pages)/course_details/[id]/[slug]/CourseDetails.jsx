"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  Banknote,
  BookOpen,
  ChevronRight,
  Clock,
  Languages,
  Mail,
  Play,
  Printer,
  Star,
  Users,
} from "lucide-react";
import Tabs from "@/components/common/Tabs";
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
  const course = initialCourse;
  const registerUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.set("course_id", id);
    if (selectedDate) params.set("date", selectedDate);
    if (selectedCity) params.set("city_id", selectedCity);
    return `/${locale}/registerCourse?${params.toString()}`;
  }, [locale, id, selectedDate, selectedCity]);

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
  const courseTabs = course?.tabs;
  const activeTab =
    courseTabs?.find((tab) => tab.id === activeTabId) || courseTabs?.[0];
  return (
    <section>
      <Header />
      {/* ── Title hero band (reference style) ── */}
      <div className={styles.pageHero}>
        <div className={stylesContainer.container}>
          <div className={styles.pageHeroInner}>
            <h1 className={styles.pageHeroTitle}>{course?.name}</h1>
            {course?.category?.name && (
              <p className={styles.pageHeroCategory}>
                <BookOpen size={17} aria-hidden="true" /> {course.category.name}
              </p>
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

                      <div className={styles.img}>
                        {course?.image ? (
                          <Image
                            src={course?.image}
                            alt="course-details"
                            width={0}
                            height={0}
                            sizes="100vw"
                          />
                        ) : (
                          <Image
                            src={"/asstes/details.jpg"}
                            alt="course-details"
                            width={0}
                            height={0}
                            sizes="100vw"
                          />
                        )}
                      </div>
                    </div>

                  </div>

                  <div className={styles.summaryIcons}>
                    <div className={styles.item}>
                      <div className={`${styles.icon} ${styles.yellow}`}>
                        <Star size={24} color="#D08700" />
                      </div>
                      <div className={styles.content}>
                        <p className={styles.statNumber}>+600k</p>
                        <p>{t('reviews')}</p>
                      </div>
                    </div>

                    <div className={styles.item}>
                      <div className={`${styles.icon} ${styles.blue}`}>
                        <Users size={24} color="#2F327D" />
                      </div>
                      <div className={styles.content}>
                        <p className={styles.statNumber}>+800k</p>
                        <p>{t('students')}</p>
                      </div>
                    </div>

                    <div className={styles.item}>
                      <div className={`${styles.icon} ${styles.green}`}>
                        <Clock size={24} color="#9810FA" />
                      </div>
                      <div className={styles.content}>
                        <p className={styles.statNumber}>{course?.week_number ? `${course.week_number} ${tCommon('weeks')}` : `1-2 ${tCommon('weeks')}`}</p>
                        <p>{t('duration')}</p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.tabContainer}>
                    <Tabs
                      tabs={course?.tabs}
                      activeTabId={activeTabId}
                      onTabChange={setActiveTabId}
                      className={styles.courseTabs}
                      tabClassName={styles.courseTabItem}
                      activeTabClassName={styles.active}
                    />
                    <div className={styles.tabContent}>
                      <h3>{activeTab?.title}</h3>
                      <div
                        dangerouslySetInnerHTML={{ __html: activeTab?.content }}
                      />
                    </div>
                  </div>

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

                      <select
                        className={styles.cardSelect}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        aria-label={t('courseDates')}
                      >
                        <option value="">{t('courseDates')}</option>
                        {course?.dates?.map((session) => (
                          <option key={session.id} value={session.date}>
                            {session.date}{session.time ? ` — ${session.time}` : ""}
                          </option>
                        ))}
                      </select>

                      <select
                        className={styles.cardSelect}
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        aria-label={t('courseCities')}
                      >
                        <option value="">{t('courseCities')}</option>
                        {cities?.map((city) => (
                          <option key={city.id} value={city.id}>{city.name}</option>
                        ))}
                      </select>

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
