"use client";

import styles from "@/sass/pages/course-details-by-city/header.module.scss";
import { Aperture, ChevronDown } from "lucide-react";
import DropdownMenuCustom from "@/components/common/DropdownMenu";
import { useEffect, useState } from "react";
import SearchCourse from "../../../search_course/Search";
import useCitiesStore from "@/store/useCitiesStore";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const Header = ({ specializationName }) => {
    const t = useTranslations('CourseTraning');
    const router = useRouter();
    const { locale } = useParams();
    const [specialization, setSpecialization] = useState("");
    const [city, setCity] = useState("");
    // Same accepted pattern as city/[id]/[slug]/Header.jsx: these two dropdowns are
    // filter-navigation chrome, not primary page content, so client-fetched options
    // here are fine — they used to be hardcoded ("Specialization 1", "City 1")
    // placeholder text instead of real data, which is the actual bug this replaces.
    const { specializations, cities, handleGetCities } = useCitiesStore();
    useEffect(() => {
        handleGetCities();
    }, [handleGetCities]);

    const specializationOptions = specializations.map((s) => ({ label: s.name, value: s.slug }));
    const cityOptions = cities.map((c) => ({ label: c.name, value: c.slug }));

    const handleSpecializationChange = (val) => {
        setSpecialization(val);
        const target = specializations.find((s) => s.slug === val);
        if (target) {
            router.push(`/${locale}/course_training/${target.id}/${target.slug}`);
        }
    };

    const handleCityChange = (val) => {
        setCity(val);
        const target = cities.find((c) => c.slug === val);
        if (target) {
            router.push(`/${locale}/city/${target.id}/${target.slug}`);
        }
    };

    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <div className={styles.title}>
                    <span><Aperture color="#B12E33" size={22} />{t('explore')}</span>
                    <h1>{t('specializationTitle')} {specializationName}</h1>
                    <p>{t('subtitle')}</p>
                </div>
                <div className={styles.searchCourse}>
                    <SearchCourse className={styles.filter} />
                    <div className={styles.locationSelect}>
                        <DropdownMenuCustom
                            label={t('allSpecializations')}
                            options={specializationOptions}
                            value={specialization}
                            onChange={handleSpecializationChange}
                            multi={false}
                            icon={<ChevronDown size={14} />}
                            triggerClassName={styles.dropdownTrigger}
                        />
                        <DropdownMenuCustom
                            label={t('allCities')}
                            options={cityOptions}
                            value={city}
                            onChange={handleCityChange}
                            multi={false}
                            icon={<ChevronDown size={14} />}
                            triggerClassName={styles.dropdownTrigger}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
