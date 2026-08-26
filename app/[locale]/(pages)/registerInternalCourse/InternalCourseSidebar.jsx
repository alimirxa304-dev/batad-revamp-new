"use client";
import React from 'react';
import styles from '@/sass/pages/request-course/request-course.module.scss';
import { useTranslations } from 'next-intl';

const InternalCourseSidebar = () => {
    const t = useTranslations('RegisterInternal');

    return (
        <div className={styles.summaryCard}>
            <div className={styles.summaryContent}>
                <div className={styles.priceSection} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                    <span className={styles.label}>{t('courseCost')}</span>
                    <div className={styles.priceContainer} style={{ textAlign: 'left' }}>
                        <span className={styles.newPrice}>£599</span>
                    </div>
                </div>

                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '12px' }}>{t('perMember')}</p>
                <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{t('feesNote')}</p>

                <div className={styles.divider} />

                <div className={styles.whatsIncluded}>
                    <h4>{t('including')}</h4>
                    <ul>
                        <li><span></span> {t('snacks')}</li>
                        <li><span></span> {t('materials')}</li>
                        <li><span></span> {t('certificate')}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default InternalCourseSidebar;
