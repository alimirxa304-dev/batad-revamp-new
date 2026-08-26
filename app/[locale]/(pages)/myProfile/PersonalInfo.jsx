import { useEffect, useMemo } from "react";
import { User, Mail, Phone, Globe, Briefcase, Building2, MapPin } from "lucide-react";
import styles from "@/sass/pages/my-profile/my-profile.module.scss";
import useCitiesStore from "@/store/useCitiesStore";
import { useTranslations } from "next-intl";

const PersonalInfo = ({ user }) => {
    const t = useTranslations('MyProfile');
    const { cities, handleGetCities } = useCitiesStore();

    useEffect(() => {
        if (cities.length === 0) {
            handleGetCities();
        }
    }, [cities.length, handleGetCities]);

    const countryName = useMemo(() => {
        if (!user?.country_id) return user?.country || t('notSpecified');
        const found = cities.find(c => c.id === user.country_id);
        return found ? found.name : (user?.country || t('notSpecified'));
    }, [cities, user?.country_id, user?.country]);

    const fields = [
        { label: t('personalInfo.fullName'), value: user?.full_name, icon: User, colSpan: false },
        { label: t('personalInfo.email'), value: user?.email, icon: Mail, colSpan: false },
        { label: t('personalInfo.phone'), value: user?.phone, icon: Phone, colSpan: false },
        { label: t('personalInfo.mobile'), value: user?.mobile, icon: Phone, colSpan: false },
        { label: t('personalInfo.country'), value: countryName, icon: Globe, colSpan: false },
        { label: t('personalInfo.jobTitle'), value: user?.job_title, icon: Briefcase, colSpan: false },
        { label: t('personalInfo.company'), value: user?.company_name, icon: Building2, colSpan: false },
        { label: t('personalInfo.address'), value: user?.location, icon: MapPin, colSpan: true },
    ];

    return (
        <div>
            <h2 className={styles.sectionTitle}>{t('tabs.personalInfo')}</h2>
            <div className={styles.fieldsGrid}>
                {fields?.map((f) => {
                    const Icon = f.icon;
                    return (
                        <div
                            key={f.label}
                            className={`${styles.field} ${f.colSpan ? styles.fullWidth : ""}`}
                        >
                            <span className={styles.fieldLabel}>{f.label}</span>
                            <div className={styles.fieldValue}>
                                <Icon size={15} />
                                <span>{f.value}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PersonalInfo;
