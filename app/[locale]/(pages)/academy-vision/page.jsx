"use client";
import styles from '@/sass/pages/privacy/privacy.module.scss';
import AcademyVisionHeader from './AcademyVisionHeader';
import styleContainer from "@/sass/components/common/container.module.scss";
import { useTranslations } from 'next-intl';

const AcademyVisionPage = () => {
    const t = useTranslations('AcademyVision');

    return (
        <div className={styles.privacyPage}>
            <AcademyVisionHeader />
            <div className={styles.contentWrapper}>
                <div className={styleContainer.container}>
                    <div className={styles.card}>
                        <div className={styles.privacyContent}>

                            <h2>{t('overview.title')}</h2>
                            <p>{t('overview.text1')}</p>
                            <p>{t('overview.text2')}</p>
                            <p>{t('overview.text3')}</p>

                            <h2>{t('vision.title')}</h2>
                            <p>{t('vision.text1')}</p>
                            <p>{t('vision.text2')}</p>
                            {t.has('vision.text3') && <p>{t('vision.text3')}</p>}

                            <h2>{t('mission.title')}</h2>
                            <p>{t('mission.text')}</p>
                            <ul>
                                <li>{t('mission.item1')}</li>
                                <li>{t('mission.item2')}</li>
                                <li>{t('mission.item3')}</li>
                                <li>{t('mission.item4')}</li>
                            </ul>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AcademyVisionPage;
