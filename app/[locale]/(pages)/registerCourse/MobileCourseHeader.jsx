import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from '@/sass/pages/register-course/register-course.module.scss';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const MobileCourseHeader = ({ course }) => {
  const t = useTranslations('RegisterCourse');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.mobileHeader}>
      <div className={styles.headerTrigger} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.courseMiniInfo}>
          <Image
            src={course?.image || "/asstes/course1.jpg"}
            alt={course?.name || t('course')}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/40px?text=C'; }}
            width={400}
            height={400}
            unoptimized
          />
          <h3>{course?.name || t('course')}</h3>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isOpen && (
        <div className={styles.mobileDetails}>
          <div className={styles.instructor}>
            <p>{t('instructorLabel')}: <strong>Dr. Sarah Johnson</strong></p>
          </div>
          <div className={styles.stats}>
            <span>{t('duration')}: <strong>{t('weeksCount', { count: 8 })}</strong></span>
            <span>{t('priceLabel')}: <strong>£{course?.price || '—'}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileCourseHeader;
