"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import styles from "@/sass/pages/jobs/filter.module.scss";
import stylesContainer from "@/sass/components/common/container.module.scss";
import DropdownMenuCustom from "@/components/common/DropdownMenu";
import useCitiesStore from "@/store/useCitiesStore";
import { ChevronDown, Clock, FilterIcon } from "lucide-react";
import { useTranslations } from "next-intl";

const Filter = ({ updateFilter }) => {
    const t = useTranslations('Jobs');
    const searchParams = useSearchParams();
    const { cities, handleGetCities } = useCitiesStore();

    useEffect(() => {
        handleGetCities();
    }, [handleGetCities]);

    const cityOptions = cities.map((c) => ({ label: c.name, value: String(c.id) }));
    const typeOptions = [
        { label: t('fullTime'), value: "1" },
        { label: t('partTime'), value: "0" },
    ];

    const currentCityId = searchParams.get("city_id") || "";
    const currentType = searchParams.get("type") || "";

    return (
        <div className={styles.filter}>
            <div className={stylesContainer.container}>

                    <div className={styles.filters}>
                        <DropdownMenuCustom
                            label={t('allCities')}
                            options={cityOptions}
                            value={currentCityId}
                            onChange={(value) => updateFilter?.({ key: "city_id", value })}
                            multi={false}
                            icon={<ChevronDown size={14} />}
                            triggerClassName={styles.dropdownTrigger}
                        />
                        <DropdownMenuCustom
                        hasSearch={false}
                            label={t('allTypes')}
                            options={typeOptions}
                            value={currentType}
                            onChange={(value) => updateFilter?.({ key: "type", value })}
                            multi={false}
                            // icon={<Clock size={14} />}
                            triggerClassName={styles.dropdownTrigger}
                        />

                        <button className={styles.filtersBtn}> <FilterIcon /> {t('filters')}</button>
                    </div>

            </div>
        </div>
    );
};

export default Filter;