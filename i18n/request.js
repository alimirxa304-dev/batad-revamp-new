import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  // ── import each page's messages ──────────────────────────────
  const topNavMessages = (
    await import(`../messages/layout/${locale}/top-nav.json`)
  ).default;
  const mainNavMessages = (
    await import(`../messages/layout/${locale}/main-navbar.json`)
  ).default;

  const heroMessages = (
    await import(`../messages/(pages)/home/${locale}/hero.json`)
  ).default;
    const homeMessages = (
    await import(`../messages/(pages)/home/${locale}/home.json`)
  ).default;
   const titleMessages = (
    await import(`../messages/(pages)/home/${locale}/title.json`)
  ).default;
  const navgationBarMessages = (
    await import(`../messages/common/${locale}/NavgationBar.json`)
  ).default;
  const headerCourseMessages = (
    await import(`../messages/(pages)/courseDetails/${locale}/header.json`)
  ).default;
  const headerCityMessages = (
    await import(`../messages/(pages)/city/${locale}/header.json`)
  ).default;
    const titleCityMessages = (
    await import(`../messages/(pages)/city/${locale}/title.json`)
  ).default;
    const footerMessages = (
    await import(`../messages/layout/${locale}/footer.json`)
  ).default;
  const commonMessages = (
    await import(`../messages/common/${locale}/common.json`)
  ).default;
  const metaMessages = (
    await import(`../messages/layout/${locale}/meta.json`)
  ).default;
  const errorMessages = (
    await import(`../messages/layout/${locale}/error.json`)
  ).default;
  // const footerMessages = (
  //   await import(`../messages/layout/${locale}/footer.json`)
  // ).default;
  const searchCourseMessages = (
    await import(`../messages/(pages)/search_course/${locale}/search-course.json`)
  ).default;
  const courseDetailsMessages = (
    await import(`../messages/(pages)/courseDetails/${locale}/course-details.json`)
  ).default;
  const showCitiesMessages = (
    await import(`../messages/(pages)/show_cities/${locale}/show-cities.json`)
  ).default;
  const courseTraningMessages = (
    await import(`../messages/(pages)/course_traning/${locale}/course-traning.json`)
  ).default;
  const consultingMessages = (
    await import(`../messages/(pages)/consulting/${locale}/consulting.json`)
  ).default;
  const blogMessages = (
    await import(`../messages/(pages)/blog/${locale}/blog.json`)
  ).default;
  const faqMessages = (
    await import(`../messages/(pages)/fqa/${locale}/fqa.json`)
  ).default;
  const privacyMessages = (
    await import(`../messages/(pages)/privacy/${locale}/privacy.json`)
  ).default;
  const academyVisionMessages = (
    await import(`../messages/(pages)/academy-vision/${locale}/academy-vision.json`)
  ).default;
  const ourServicesMessages = (
    await import(`../messages/(pages)/our-services/${locale}/our-services.json`)
  ).default;
  const yearPlanMessages = (
    await import(`../messages/(pages)/year_plan/${locale}/year-plan.json`)
  ).default;
  const printCategoryMessages = (
    await import(`../messages/(pages)/printCategory/${locale}/print-category.json`)
  ).default;
  const authMessages = (
    await import(`../messages/(pages)/auth/${locale}/auth.json`)
  ).default;
  const forgetPasswordMessages = (
    await import(`../messages/(pages)/forgetPassword/${locale}/forget-password.json`)
  ).default;
  const myProfileMessages = (
    await import(`../messages/(pages)/myProfile/${locale}/my-profile.json`)
  ).default;
  const editProfileMessages = (
    await import(`../messages/(pages)/editMyProfile/${locale}/edit-profile.json`)
  ).default;
  const jobsMessages = (
    await import(`../messages/(pages)/jobs/${locale}/jobs.json`)
  ).default;
  const registerCourseMessages = (
    await import(`../messages/(pages)/registerCourse/${locale}/register-course.json`)
  ).default;
  const registerInternalMessages = (
    await import(`../messages/(pages)/registerInternalCourse/${locale}/register-internal.json`)
  ).default;
  const contactMessages = (
    await import(`../messages/(pages)/contact_us/${locale}/contact.json`)
  ).default;
  return {
    locale,
    messages: {
      ...mainNavMessages,
      ...topNavMessages,
      ...heroMessages,
      ...titleMessages,
      ...headerCourseMessages,
      ...homeMessages,
      ...headerCityMessages,
      ...titleCityMessages,
      ...footerMessages,
      ...commonMessages,
      ...navgationBarMessages,
      ...metaMessages,
      ...errorMessages,
      ...footerMessages,
      ...searchCourseMessages,
      ...courseDetailsMessages,
      ...showCitiesMessages,
      ...courseTraningMessages,
      ...consultingMessages,
      ...blogMessages,
      ...faqMessages,
      ...privacyMessages,
      ...academyVisionMessages,
      ...ourServicesMessages,
      ...yearPlanMessages,
      ...printCategoryMessages,
      ...authMessages,
      ...forgetPasswordMessages,
      ...myProfileMessages,
      ...editProfileMessages,
      ...jobsMessages,
      ...registerCourseMessages,
      ...registerInternalMessages,
      ...contactMessages,
    },
  };
});