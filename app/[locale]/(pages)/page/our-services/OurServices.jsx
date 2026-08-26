"use client";
import styles from '@/sass/pages/privacy/privacy.module.scss';
import OurServicesHeader from './OurServicesHeader';
import styleContainer from "@/sass/components/common/container.module.scss";
import { useTranslations } from 'next-intl';

const OurServices = () => {
    const t = useTranslations('OurServices');

    return (
        <div className={styles.privacyPage}>
            <OurServicesHeader />
            <div className={styles.contentWrapper}>
                <div className={styleContainer.container}>
                    <div className={styles.card}>
                        <div className={styles.privacyContent}>

                            <p>{t('intro')}</p>

                            <h2>{t('training.title')}</h2>
                            <p>{t('training.text1')}</p>
                            <p>{t('training.text2')}</p>

                            <h2>{t('fieldTraining.title')}</h2>
                            <p>{t('fieldTraining.text')}</p>

                            <h2>{t('consulting.title')}</h2>
                            <p>{t('consulting.text1')}</p>
                            <p>{t('consulting.text2')}</p>

                            <h2>{t('quality.title')}</h2>
                            <p>{t('quality.text1')}</p>
                            <p>{t('quality.text2')}</p>

                            <p>{t('summary')}</p>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurServices;
