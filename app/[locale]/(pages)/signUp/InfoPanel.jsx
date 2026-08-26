"use client";
import { GraduationCap, CircleCheckBig } from "lucide-react";
import styles from "@/sass/pages/sign-up/register.module.scss";
import { useTranslations } from "next-intl";

const InfoPanel = () => {
    const t = useTranslations('Auth.signUp');

    const features = [
        { title: t('features.access'),     description: t('features.accessDesc')     },
        { title: t('features.dashboard'),  description: t('features.dashboardDesc')  },
        { title: t('features.community'),  description: t('features.communityDesc')  },
        { title: t('features.career'),     description: t('features.careerDesc')     },
    ];

    return (
        <div className={styles.infoPanel}>
            <div className={styles.infoPanelInner}>
                <div className={styles.capIcon}>
                    <GraduationCap size={24} color="#ffffff" />
                </div>
                <h2 className={styles.panelTitle}>{t('panelTitle')}</h2>
                <p className={styles.panelDesc}>{t('panelDesc')}</p>

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

                <p className={styles.trustText}>{t('trustText')}</p>
            </div>
        </div>
    );
};

export default InfoPanel;
