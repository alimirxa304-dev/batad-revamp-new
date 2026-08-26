"use client";
import React from 'react';
import { Clock, Award, Check, Mail, Phone } from 'lucide-react';
import styles from '@/sass/pages/register-course/register-course.module.scss';
import courseImg from '/public/asstes/course1.jpg';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const CourseSummaryCard = ({ course }) => {
  const t = useTranslations('RegisterCourse');

  return (
    <aside className={styles.sidebar}>
      <div className={styles.summaryCard}>
        <Image
          src={course?.image || courseImg}
          alt={course?.name || 'Course'}
          className={styles.courseImg}
          width={400}
          height={400}
        />
        <div className={styles.summaryContent}>
          <h3>{course?.name}</h3>

          <div className={styles.instructor}>
            <div className={styles.avatar}>
              <span className={styles.initials}>SJ</span>
            </div>
            <div className={styles.info}>
              <span>{t('instructorLabel')}</span>
              <p>Dr. Sarah Johnson</p>
            </div>
          </div>

          <div className={styles.detailsRow}>
            <div className={styles.label}><Clock color='#2F327D' /> {t('duration')}</div>
            <div className={styles.value}>{t('weeksCount', { count: 8 })}</div>
          </div>

          <div className={styles.detailsRow}>
            <div className={styles.label}><Award color='#C41E3A' /> {t('certificate')}</div>
            <div className={styles.value}>{t('included')}</div>
          </div>

          <div className={styles.divider} />

          <div className={styles.priceSection}>
            <div className={styles.label}>{t('summary.coursePrice')}</div>
            <div className={styles.priceContainer}>
              <span className={styles.newPrice}>£{course?.price}</span>
            </div>
          </div>

          <div className={styles.whatsIncluded}>
            <h4>{t('summary.whatsIncluded')}</h4>
            <ul>
              <li><Check color='#00A63E' /> {t('summary.item1')}</li>
              <li><Check color='#00A63E' /> {t('summary.item2')}</li>
              <li><Check color='#00A63E' /> {t('summary.item3')}</li>
              <li><Check color='#00A63E' /> {t('summary.item4')}</li>
              <li><Check color='#00A63E' /> {t('summary.item5')}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.helpCard}>
        <h3>{t('summary.needHelp')}</h3>
        <p>{t('summary.helpText')}</p>
        <div className={styles.contactInfo}>
          <div className={styles.item}><Mail size={16} /> info@batdacademy.org.uk</div>
          <div className={styles.item}><Phone size={16} /> +44 20 3582 7999</div>
        </div>
      </div>
    </aside>
  );
};

export default CourseSummaryCard;
