"use client";
import styles from '@/sass/pages/privacy/privacy.module.scss';
import PrivacyHeader from './PrivacyHeader';
import styleContainer from "@/sass/components/common/container.module.scss";
import { useTranslations } from 'next-intl';

const Privacy = () => {
    const t = useTranslations('Privacy');

    return (
        <div className={styles.privacyPage}>
            <PrivacyHeader />
            <div className={styles.contentWrapper}>
                <div className={styleContainer.container}>
                    <div className={styles.card}>
                        <div className={styles.privacyContent}>

                            <h2>{t('intro.title')}</h2>
                            <p>{t('intro.text')}</p>

                            <h2>{t('collect.title')}</h2>
                            <p>{t('collect.text')}</p>
                            <ul>
                                <li><strong>{t('collect.personal')}</strong> {t('collect.personalDesc')}</li>
                                <li><strong>{t('collect.derivative')}</strong> {t('collect.derivativeDesc')}</li>
                                <li><strong>{t('collect.financial')}</strong> {t('collect.financialDesc')}</li>
                            </ul>

                            <h2>{t('use.title')}</h2>
                            <p>{t('use.text')}</p>
                            <ul>
                                <li>{t('use.item1')}</li>
                                <li>{t('use.item2')}</li>
                                <li>{t('use.item3')}</li>
                                <li>{t('use.item4')}</li>
                            </ul>

                            <h2>{t('security.title')}</h2>
                            <p>{t('security.text')}</p>

                            <div className={styles.lastUpdated}>
                                {t('lastUpdated')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
