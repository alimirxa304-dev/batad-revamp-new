"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import DatePopUp from "./DatePopUp";
import styles from "@/sass/components/ui/Upcoming-Coures-Card.module.scss";
import { isPlaceholderImage } from "@/lib/seoMeta";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

// Single, deterministic fallback for every card — replaces the old id-based random
// rotation across 4 different placeholders, which made the same course show a
// different "no image" picture depending on its id.
const DEFAULT_COURSE_IMAGE = "/asstes/default-2.webp";

// The API returns a real URL, "", null, or (most commonly) a blank-image.svg CMS
// placeholder for courses with no photo — isPlaceholderImage() is the same helper
// page.jsx/lib/seoMeta.js already use to detect that exact placeholder elsewhere,
// so both the visible card and JSON-LD agree on what counts as "no image".
function resolveCourseImage(image) {
  if (typeof image !== "string") return DEFAULT_COURSE_IMAGE;
  const normalizedImage = image.trim();
  if (!normalizedImage || normalizedImage === "null" || normalizedImage === "undefined") {
    return DEFAULT_COURSE_IMAGE;
  }
  if (isPlaceholderImage(normalizedImage)) {
    return DEFAULT_COURSE_IMAGE;
  }
  return normalizedImage;
}

/**
 * @typedef {Object} Course
 * @property {number|string} id
 * @property {string} name
 * @property {string} [title]
 * @property {string} [slug]
 * @property {string} [image]
 * @property {number|string} [price]
 * @property {{ name: string }} [category]
 * @property {string} [created_at]
 * @property {string} [language]
 * @property {Array<{ date: string, time?: string }>} [dates]
 */

/**
 * @param {{ course: Course }} props
 */
const UpcomingCouresCard = ({
  course,
  onModalOpen,
  onModalClose,
  slideIndex,
  swiperRef,
  cityId,
  filterLanguage,
  locale: localeProp,
  index,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  // Tracks the last resolved src that actually failed to load (onError), not the
  // src to display — recomputing that from course.image on every render (below)
  // means a card reused for a different course (same map key) never shows a stale
  // fallback: the failure only applies while it still matches the current course.
  const [erroredImageSrc, setErroredImageSrc] = useState(null);
  // Prefer the locale the page explicitly resolved server-side (route param,
  // never wrong); next-intl's useLocale() — itself SSR-safe, unlike a Zustand
  // client store that starts at a hardcoded 'en' until a useEffect syncs it —
  // is only a fallback for the few callers that don't pass one yet.
  const contextLocale = useLocale();
  const locale = (localeProp ?? contextLocale) === "ar" ? "ar" : "en";
  const router = useRouter()
  const t =useTranslations();
  const handleOpen = () => {
    if (swiperRef?.current) {
      swiperRef.current.slideTo(slideIndex);
    }
    setIsOpen(true);
    onModalOpen?.();
  };

  const handleClose = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 1500);
    onModalClose?.();
  };

  const handleSelect = (session) => {
    setSelectedDate(session.date);
    const params = new URLSearchParams();
    if (course?.id) params.set("course_id", course.id);
    if (session?.date) params.set("date", session.date);
  
    router.push(`/${locale}/registerCourse?${params.toString()}`);
  };

  // Build registration URL with all available query params
  const registerUrl = useMemo(() => {
  
    const params = new URLSearchParams();
    if (course?.id) params.set("course_id", course.id);
    if (selectedDate) params.set("date", selectedDate);
    if (cityId) params.set("city_id", cityId);
    const lang = course?.language || filterLanguage;
    if (lang) params.set("language", lang);
    return `/${locale}/registerCourse?${params.toString()}`;
  }, [
    locale,
    course?.id,
    selectedDate,
    cityId,
    course?.language,
    filterLanguage,
  ]);

  // Resolved fresh from course.image every render (no useEffect) — present in the
  // very first server-rendered HTML, and automatically correct again if this same
  // card instance later gets a different course's data.
  const dataImageSrc = resolveCourseImage(course?.image);
  const imageSrc = erroredImageSrc === dataImageSrc ? DEFAULT_COURSE_IMAGE : dataImageSrc;
  return (
    <motion.div
      className={styles.card}
      initial={false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={course?.name || course?.title || 'Course thumbnail'}
          width={361}
          height={208}
          sizes="(max-width: 540px) 100vw, (max-width: 1024px) 50vw, 361px"
          // Only ever true for a caller that explicitly marks its first, above-the-fold
          // card (city/search/category/specialization grids) — every other usage (the
          // homepage slider, course_details "similar courses") doesn't pass index, so
          // this safely defaults to false instead of guessing.
          priority={index === 0}
          loading={index === 0 ? undefined : "lazy"}
          onError={() => {
            if (dataImageSrc !== DEFAULT_COURSE_IMAGE) {
              setErroredImageSrc(dataImageSrc);
            }
          }}
        />

        <div className={styles.overlay} />
        <div className={styles.imageLabels}>
          {course.category && (
            <span className={styles.categoryTag} title={course.category?.name}>
              {course.category?.name}
            </span>
          )}
        </div>
        {course.price && <span className={styles.priceTag}>£{course.price}</span>}
      </div>
      <div className={styles.content}>
        <p className={styles.description}>{course.name}</p>
        <div className={styles.meta}>
          <div className={styles.date}>
            <Calendar color="#1E2749" size={14} />
            <span className={styles.ceartedAt}>
              {course?.created_at?.split("T")[0]}
            </span>
          </div>

          <div className={styles.time}>
            <Clock color="#1E2749" size={14} />
            <span className={styles.time}>1-2 {t('weeks')}</span>
          </div>
        </div>
        <div className={styles.more}>
          <Calendar aria-hidden="true"/>

          <button
            type="button"
            className={styles.moreDates}
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            aria-label={`View more dates for ${course?.name}`}
          >
            +2  {t('dateAvailable')}
          </button>
          <DatePopUp
            isOpen={isOpen}
            onClose={handleClose}
            onSelect={handleSelect}
            courseName={course.title}
            dates={course?.dates}
            id={course?.id}
          />
        </div>
        <div className={styles.btns}>
          <Link href={registerUrl} className={styles.btnRegister}>
            {t('register')}
            <span className="sr-only"> for {course?.name}</span>
          </Link>
          <Link
            href={`/${locale}/course_details/${course?.id}/${encodeURIComponent(course?.slug ?? "")}`}
            className={styles.btnDetails}
          >
            {t('details')}
            <span className="sr-only"> of {course?.name}</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default UpcomingCouresCard;
