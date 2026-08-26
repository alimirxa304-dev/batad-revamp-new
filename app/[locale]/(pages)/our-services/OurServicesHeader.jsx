"use client";
import styles from '@/sass/pages/privacy/privacy.module.scss';
import { useTranslations } from 'next-intl';

const OurServicesHeader = () => {
    const t = useTranslations('OurServices');
    return (
        <div className={styles.header}>
            <div className="container">
                <h1>{t('title')}</h1>
            </div>
        </div>
    );
};

export default OurServicesHeader;
