"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronRight, Filter, Search, X } from "lucide-react";
import styles from "@/sass/pages/search-course/search.module.scss";
import CategoriesBox from "@/components/common/CategoriesBox";
import Range from "@/components/ui/Range";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const SearchCourse = ({ className, updateFilter, onOpenFilters }) => {
  const searchParams = useSearchParams();
  const t = useTranslations('SearchCourse');
  const tCommon = useTranslations();
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchValue !== (searchParams.get("search") || "")) {
        updateFilter("search", searchValue);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue, updateFilter, searchParams]);

  return (
    <section className={styles.search}>
      <div className={styles.searchContent}>
        <div className={styles.searchContent__left}>
          <div
            className={styles.searchContent__left__icon}
            onClick={() => updateFilter("search", searchValue)}
          >
            <Search size={13} color="#99A1AF" />
          </div>
          <input
            type="text"
            placeholder={tCommon('searchPlacesholder')}
            className={styles.input}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        {onOpenFilters ? (
          <button
            className={`${styles.funnel} ${className}`}
            type="button"
            aria-label={t('filters')}
            onClick={onOpenFilters}
          >
            <Filter aria-hidden="true" />
          </button>
        ) : (
          <Dialog.Root modal={true}>
            <Dialog.Trigger asChild>
              <button
                className={`${styles.funnel} ${className}`}
                type="button"
                aria-label={t('filters')}
              >
                <Filter aria-hidden="true" />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className={styles.drawerOverlay} />
              <Dialog.Content className={styles.drawerContent}>
                <div className={styles.drawerHeader}>
                  <Dialog.Title className={styles.drawerTitle}>
                    {t('filters')}
                  </Dialog.Title>
                  <Dialog.Close
                    className={styles.drawerClose}
                    aria-label="Close filters"
                  >
                    <X size={20} aria-hidden="true" />
                  </Dialog.Close>
                </div>

                <div className={styles.filter}>
                  <CategoriesBox
                    title={t('allCategories')}
                    icon={<Filter size={18} />}
                  >
                    <div className={styles.sidebarFilterContent}>
                      <div className={styles.range}>
                        <h4 className={styles.filterGroupTitle}>{t('priceRange')}</h4>
                        <Range min={0} max={2000} step={10} />
                      </div>

                      <h4 className={styles.filterGroupTitle}>{t('courseType')}</h4>
                      <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                          <input type="checkbox" /> {t('featuredCourses')}
                        </label>
                        <label className={styles.checkboxLabel}>
                          <input type="checkbox" /> {t('approvedCourses')}
                        </label>
                        <label className={styles.checkboxLabel}>
                          <input type="checkbox" /> {t('discountedCourses')}
                        </label>
                      </div>
                    </div>
                  </CategoriesBox>

                  <CategoriesBox title={t('allCategory')}>
                    <ul className={styles.sidebarCategoryList}>
                      {["Business", "Technical", "Power", "Management", "Development"].map((item) => (
                        <li key={item}>
                          <span>{item}</span>
                          <div className={styles.badgeWrapper}>
                            <ChevronRight size={12} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CategoriesBox>

                  <CategoriesBox title={t('allTags')}>
                    <div className={styles.sidebarTagsContainer}>
                      {["Business", "Graphic Design", "Technology", "Business Idea",
                        "App Development", "Website Design", "Marketing",
                        "Leadership", "Finance", "Project Management"].map((tag) => (
                        <span key={tag} className={styles.tagPill}>{tag}</span>
                      ))}
                    </div>
                  </CategoriesBox>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}

        <div className={styles.searchContent__right}>
          <button type="button">{tCommon('search')}</button>
        </div>
      </div>
    </section>
  );
};

export default SearchCourse;
