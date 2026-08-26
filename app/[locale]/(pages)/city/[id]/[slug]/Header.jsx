"use client";
import styles from "@/sass/pages/course-details-by-city/header.module.scss";
import { Aperture, ChevronDown } from "lucide-react";
import DropdownMenuCustom from "@/components/common/DropdownMenu";
import { useEffect, useState } from "react";
import SearchCourse from "../../../search_course/Search";
import useCitiesStore from "@/store/useCitiesStore";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const Header = ({ updateFilter, onOpenFilters, cityName, cityDescription }) => {
    const  t = useTranslations('header');
    const tLables = useTranslations()
    const { slug, locale } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [specialization, setSpecialization] = useState(searchParams.get("specialization") || "");
    const [city, setCity] = useState( decodeURIComponent(slug)|| "");
    const { stats, specializations, cities, handleGetCities } = useCitiesStore();

    useEffect(() => {
        handleGetCities();
    }, [handleGetCities]);

    const specializationOptions = specializations.map((s) => ({ label: s.name, value: s.slug }));
    const cityOptions = cities.map((c) => ({ label: c.name, value: c.slug }));

    const handleSpecializationChange = (val) => {
        setSpecialization(val);
        updateFilter?.("specialization", val);
    };

    const handleCityChange = (val) => {
        setCity( val);
        console.log(city,'city')
        const targetCity = cities.find(c => c.slug === val);
        if (targetCity) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("city");
            router.push(`/${locale}/city/${targetCity.id}/${targetCity.slug}?${params.toString()}`);
        }
    };

    return (
        <div className={styles.header}>
            <div className={styles.content}>
                <div className={styles.title}>
                    <span><Aperture color="#B12E33" size={22} />{t('globle')}</span>
                    {/* <h1> {t('title')} <br /> {t('subTitle')}  {cityName}</h1> */}
                    <h1> {t('title')} {cityName}</h1>
                    {cityDescription && <p>{cityDescription}</p>}
                    {/* <p> {t('text')} {stats?.cities || "..."} {t('subText')} </p> */}
                </div>
                <div className={styles.searchCourse}>
                    <SearchCourse
                        className={styles.filter}
                        updateFilter={updateFilter}
                        onOpenFilters={onOpenFilters}
                    />
                    <div className={styles.locationSelect}>
                        <DropdownMenuCustom
                            label={tLables('allSpecial')}
                            options={specializationOptions}
                            value={specialization}
                            onChange={handleSpecializationChange}
                            multi={false}
                            icon={<ChevronDown size={14} />}
                            triggerClassName={styles.dropdownTrigger}
                        />
                        <DropdownMenuCustom
                            label={tLables('allCities')}
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
