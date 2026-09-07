"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Filter, Search, X } from "lucide-react";
import styles from "@/sass/pages/search-course/search.module.scss";
import FilterPanel from "./FilterPanel";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const SearchCourse = ({ className, updateFilter, onOpenFilters, categories, specializations, cities }) => {
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

                {/* Phone drawer: the same full filter set as the desktop sidebar
                    (keywords, category, specialisation, city, price, discount,
                    dates, language, ...) — every field drives the course query. */}
                <div className={styles.filter}>
                  <FilterPanel cities={cities} categories={categories} specializations={specializations} />
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
