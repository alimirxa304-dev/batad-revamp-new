"use client";
import React from 'react';
import { CheckCircle2, FileText, House, Download } from 'lucide-react';
import styles from '@/sass/pages/register-course/success-page.module.scss';
import { useTranslations } from 'next-intl';
import useLanguageStore from '@/store/useLanguageStore';
import Link from 'next/link';

const SuccessPage = ({ email = "nourskhail@gmail.com" }) => {
  const t = useTranslations('RegisterCourse');
  const { locale } = useLanguageStore();

  const details = [
    { label: t('course'),         value: 'Advanced Digital Marketing Masterclass' },
    { label: t('startDateLabel'), value: 'Oct 15, 2024' },
    { label: t('locationLabel'),  value: 'Dubai' },
    { label: t('durationLabel'),  value: '8 weeks' },
    { label: t('totalPaid'),      value: '£599', isBold: true },
  ];

  return (
    <div className={styles.successContainer}>
      <div className={styles.successCard}>
        <div className={styles.iconWrapper}>
          <CheckCircle2 size={80} color="#00D27B" strokeWidth={1.5} />
        </div>

        <h1 className={styles.title}>{t('successTitle')}</h1>
        <p className={styles.subtitle}>
          {t('successSub')} <strong>{email}</strong>
        </p>

        <div className={styles.detailsCard}>
          <h3 className={styles.detailsTitle}>
            <FileText size={18} /> {t('registrationDetails')}
          </h3>
          <div className={styles.detailsList}>
            {details.map((d, i) => (
              <div key={i} className={styles.detailRow}>
                <span className={styles.detailLabel}>{d.label}</span>
                <span className={`${styles.detailValue} ${d.isBold ? styles.bold : ''}`}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Link href={`/${locale}/search_course`} className={styles.btnSecondary}>
            <House size={16} /> {t('backToCourses')}
          </Link>
          <button className={styles.btnPrimary}>
            <Download size={16} /> {t('downloadReceipt')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
