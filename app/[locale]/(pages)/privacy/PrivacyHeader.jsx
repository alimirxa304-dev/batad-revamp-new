"use client";
import styles from '@/sass/pages/privacy/privacy.module.scss';
import { useTranslations } from 'next-intl';

const PrivacyHeader = () => {
    const t = useTranslations('Privacy');
    return (
        <div className={styles.header}>
            <div className="container">
                <h1>{t('title')}</h1>
                <p>{t('subtitle')}</p>
            </div>
        </div>
    );
};

export default PrivacyHeader;
