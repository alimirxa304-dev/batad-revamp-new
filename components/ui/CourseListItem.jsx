import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import styles from "@/sass/components/ui/course-list-item.module.scss";
import { isPlaceholderImage } from "@/lib/seoMeta";

const DEFAULT_COURSE_IMAGE = "/asstes/default-2.webp";

function resolveCourseImage(image) {
  if (typeof image !== "string") return DEFAULT_COURSE_IMAGE;
  const normalizedImage = image.trim();
  if (!normalizedImage || normalizedImage === "null" || normalizedImage === "undefined") {
    return DEFAULT_COURSE_IMAGE;
  }
  if (isPlaceholderImage(normalizedImage)) return DEFAULT_COURSE_IMAGE;
  return normalizedImage;
}

// List-view row for a course — the horizontal counterpart to
// UpcomingCouresCard's grid card. Shared by any page offering both views
// (search_course, a specialisation's own course listing, ...).
const CourseListItem = ({ course, locale: localeProp, filterLanguage }) => {
  // register/details/weeks live in the root/common messages (same source
  // UpcomingCouresCard already reads them from), not a page-scoped namespace.
  const t = useTranslations();
  const contextLocale = useLocale();
  const locale = localeProp ?? contextLocale;

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
          alt={course?.name || course?.title || "Course thumbnail"}
          width={180}
          height={100}
          sizes="(max-width: 640px) 100vw, 180px"
          loading="lazy"
        />
        {course?.category && (
          <span className={styles.listItemCategoryTag} title={course.category?.name}>
            {course.category?.name}
          </span>
        )}
        {course?.price && <span className={styles.listItemPriceTag}>£{course.price}</span>}
      </div>
      <div className={styles.listItemContent}>
        <p className={styles.listItemDescription}>{course?.name}</p>
        <div className={styles.listItemMeta}>
          <div className={styles.listItemDate}>
            <Calendar color="#1E2749" size={14} />
            <span>{course?.created_at?.split("T")[0]}</span>
          </div>
          <div className={styles.listItemDuration}>
            <Clock color="#1E2749" size={14} />
            <span>1-2 {t("weeks")}</span>
          </div>
        </div>
        <div className={styles.listItemBtns}>
          <a href={registerUrl} className={styles.listItemBtnRegister}>
            {t("register")}
          </a>
          <a href={detailUrl} className={styles.listItemBtnDetails}>
            {t("details")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CourseListItem;
