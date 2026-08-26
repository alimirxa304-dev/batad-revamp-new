"use client";
import { Lock, CircleCheckBig } from "lucide-react";
import styles from "@/sass/pages/sign-In/login.module.scss";
import { useTranslations } from "next-intl";

const InfoPanel = () => {
    const t = useTranslations('ForgetPassword');

    const features = [
        {
            title: t('features.instructors'),
            description: t('features.instructorsDesc'),
        },
        {
            title: t('features.flexible'),
            description: t('features.flexibleDesc'),
        },
        {
            title: t('features.certified'),
            description: t('features.certifiedDesc'),
        },
    ];

    const stats = [
        { value: "10K+", label: t('statsStudents') },
        { value: "500+", label: t('statsCourses') },
        { value: "95%", label: t('statsSatisfaction') },
    ];

    return (
        <div className={styles.infoPanel}>
            <div className={styles.infoPanelInner}>
                <div className={styles.lockIcon}>
                    <Lock size={24} color="#ffffff" />
                </div>

                <h2 className={styles.panelTitle}>{t('panelTitle')}</h2>

                <p className={styles.panelDesc}>
                    {t('panelDesc')}
                </p>

                <ul className={styles.featureList}>
                    {features.map((f) => (
                        <li key={f.title} className={styles.featureItem}>
                            <CircleCheckBig size={20} className={styles.checkIcon} />
                            <div className={styles.featureText}>
                                <strong>{f.title}</strong>
                                <span>{f.description}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className={styles.panelDivider} />

                <div className={styles.stats}>
                    {stats.map((s) => (
                        <div key={s.label} className={styles.statItem}>
                            <strong>{s.value}</strong>
                            <span>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InfoPanel;
