"use client";
import React from 'react';
import { User, Calendar, CreditCard, Check } from 'lucide-react';
import styles from '@/sass/components/common/stepper.module.scss';
import { useTranslations } from 'next-intl';

const Stepper = ({ currentStep = 1 }) => {
  const t = useTranslations('RegisterCourse');

  const steps = [
    { id: 1, number: 1, title: t('personalInfo'), icon: User },
    { id: 2, number: 2, title: t('courseDetailsStep'), icon: Calendar },
    // { id: 3, number: 3, title: t('payment.title'), icon: CreditCard },
  ];

  return (
    <div className={styles.stepperContainer}>
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className={styles.step}>
            <div
              className={`${styles.iconWrapper} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
            >
              {isCompleted ? <Check size={24} /> : <Icon size={24} />}
            </div>
            <div className={styles.stepLabel}>
              <span>{t('stepNumber', { number: step.number })}</span>
              <p>{step.title}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
