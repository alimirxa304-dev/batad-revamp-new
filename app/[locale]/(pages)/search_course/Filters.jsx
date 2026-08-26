"use client";
import DropdownMenuCustom from "@/components/common/DropdownMenu";
import styles from "@/sass/pages/search-course/filters.module.scss";
import { Calendar, ChevronDown, MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

const Filters = ({ updateFilter, categories, specializations, cities }) => {
  const searchParams = useSearchParams();
  const t = useTranslations('SearchCourse');

  const currentCategoryId = searchParams.get("category_id");
  const currentSpecializationId = searchParams.get("specialization_id");
  const currentCityId = searchParams.get("city_id");
  const currentLang = searchParams.get("lang") || "";

  const selectedCategory = categories?.find(c => String(c.id) === currentCategoryId)?.name || "";
  const selectedSpecialization = specializations?.find(s => String(s.id) === currentSpecializationId)?.name || "";
  const selectedPlace = cities?.find(c => String(c.id) === currentCityId)?.name || "";

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const langOptions = [
    { label: t('langEnglish'), value: "English" },
    { label: t('langArabic'), value: "Arabic" },
  ];

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: t(`months.${i + 1}`),
    value: String(i + 1),
  }));

  const yearOptions = Array.from({ length: 3 }, (_, i) => ({
    label: String(new Date().getFullYear() + i),
    value: String(new Date().getFullYear() + i),
  }));

  const selectedLangLabel = langOptions.find(o => o.value === currentLang)?.label || "";
  const selectedMonthLabel = monthOptions.find(o => o.value === selectedMonth)?.label || "";
  const selectedYearLabel = yearOptions.find(o => o.value === selectedYear)?.label || "";

  return (
    <section className={styles.filter}>
      <div className={styles.filterRow}>

        <div className={styles.filterItem}>
          <DropdownMenuCustom
            label={t('language')}
            options={langOptions.map(o => o.label)}
            value={selectedLangLabel}
            onChange={(label) => {
              const val = langOptions.find(o => o.label === label)?.value || label;
              updateFilter("lang", val);
            }}
            icon={<ChevronDown size={12} />}
          />
        </div>

        <div className={styles.filterItem}>
          <DropdownMenuCustom
            label={t('month')}
            options={monthOptions.map(o => o.label)}
            value={selectedMonthLabel}
            onChange={(label) => {
              const val = monthOptions.find(o => o.label === label)?.value || label;
              setSelectedMonth(val);
              updateFilter("month", val);
            }}
            icon={<Calendar size={12} />}
          />
        </div>

        <div className={styles.filterItem}>
          <DropdownMenuCustom
            label={t('year')}
            options={yearOptions.map(o => o.label)}
            value={selectedYearLabel}
            onChange={(label) => {
              const val = yearOptions.find(o => o.label === label)?.value || label;
              setSelectedYear(val);
              updateFilter("year", val);
            }}
            icon={<Calendar size={12} />}
          />
        </div>

        <div className={styles.filterItem}>
          <DropdownMenuCustom
            label={t('category')}
            options={categories?.map(item => item.name)}
            value={selectedCategory}
            onChange={(name) => {
              const id = categories?.find(c => c.name === name)?.id;
              updateFilter("category_id", id);
            }}
            icon={<ChevronDown size={12} />}
          />
        </div>

        <div className={styles.filterItem}>
          <DropdownMenuCustom
            label={t('specialization')}
            options={specializations?.map(item => item.name)}
            value={selectedSpecialization}
            onChange={(name) => {
              const id = specializations?.find(s => s.name === name)?.id;
              updateFilter("specialization_id", id);
            }}
            icon={<ChevronDown size={12} />}
          />
        </div>

        <div className={styles.filterItem}>
          <DropdownMenuCustom
            label={t('place')}
            options={cities?.map(item => item.name)}
            value={selectedPlace}
            onChange={(name) => {
              const id = cities?.find(c => c.name === name)?.id;
              updateFilter("city_id", id);
            }}
            icon={<MapPin size={14} />}
          />
        </div>

      </div>
    </section>
  );
};

export default Filters;
