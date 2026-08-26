"use client";
import React from 'react';
import { User, Users, CheckCircle2 } from 'lucide-react';
import styles from '@/sass/pages/register-course/registration-type-toggle.module.scss';
import { useTranslations } from 'next-intl';

const RegistrationTypeToggle = ({ value, onChange }) => {
  const t = useTranslations('RegisterCourse');
  return (
    <div className={styles.typeToggle}>
      <div className={`${styles.typeCard} ${value === 'individual' ? styles.active : ''}`} onClick={() => onChange('individual')}>
        <div className={styles.iconBox}><User size={24} /></div>
        <div className={styles.info}>
          <h3>{t('individual')}</h3>
          <p>{t('individualDesc')}</p>
        </div>
        {value === 'individual' && <CheckCircle2 className={styles.checkIcon} size={20} />}
      </div>

      <div className={`${styles.typeCard} ${value === 'company' ? styles.active : ''}`} onClick={() => onChange('company')}>
        <div className={styles.iconBox}><Users size={24} /></div>
        <div className={styles.info}>
          <h3>{t('company')}</h3>
          <p>{t('companyDesc')}</p>
        </div>
        {value === 'company' && <CheckCircle2 className={styles.checkIcon} size={20} />}
      </div>
    </div>
  );
};

export default RegistrationTypeToggle;
