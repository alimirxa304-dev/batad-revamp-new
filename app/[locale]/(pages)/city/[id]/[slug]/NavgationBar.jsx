import Link from "next/link";
import styles from "@/sass/pages/course-details-by-city/navgation-bar.module.scss";
import stylesContainer from "@/sass/components/common/container.module.scss";
import { ArrowLeft, ArrowRight, House } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import useLanguageStore from "@/store/useLanguageStore";
const NavgationBar = ({ cityName }) => {
  const locale = useLanguageStore();
  const params = useParams();
  const routeLocale = params?.locale;
  const resolvedCityName = cityName || decodeURIComponent(params?.slug || "");
  const t = useTranslations("NavBar");
  return (
    <section className={styles.navgationBar}>
      <div className={stylesContainer.container}>
        <div className={styles.wrapper}>
          <div className={styles.breadcrumb}>
            <ArrowLeft color="#2F327D" size={20} />
            <span>{t("backToCourse")}</span>
          </div>
          <span>|</span>
          <Link href={`/${routeLocale}`} aria-label={routeLocale === "ar" ? "الرئيسية" : "Home"}>
            <House color="#4A5565" size={20} />
          </Link>
          <ArrowRight color="#4A5565" size={20} />
          <Link href={`/${routeLocale}/show_cities`}>{t("cities")}</Link>
          {locale === "ar" ? (
            <ArrowRight />
          ) : (
            <ArrowLeft color="#4A5565" size={20} />
          )}

          <span>{resolvedCityName}</span>
        </div>
      </div>
    </section>
  );
};
export default NavgationBar;
