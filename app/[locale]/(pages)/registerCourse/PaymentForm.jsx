"use client";
import React from 'react';
import { CreditCard, Lock, ArrowLeft, ArrowRight } from 'lucide-react';
import styles from '@/sass/pages/register-course/payment-form.module.scss';
import { useTranslations } from 'next-intl';

const PaymentForm = ({ register, errors, handleBack, onSubmit, handleSubmit }) => {
  const t = useTranslations('RegisterCourse');

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>{t('payment.title')}</h2>
        <p className={styles.subtitle}>
          <Lock size={14} /> {t('payment.secure')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.formGrid}>
          <div className={styles.inputGroup}>
            <label>{t('payment.cardNumber')} <span>*</span></label>
            <div className={styles.inputWrapper}>
              <CreditCard className={styles.inputIcon} size={18} />
              <input type="text" placeholder="1234 5678 9012 3456"
                {...register("cardNumber", { required: true })} />
            </div>
            {errors.cardNumber && <span className={styles.errorText}>{t('fieldRequired', { field: t('payment.cardNumber') })}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label>{t('payment.cardName')} <span>*</span></label>
            <div className={styles.inputWrapper}>
              <input type="text" placeholder={t('payment.cardName')}
                {...register("cardHolderName", { required: true })} />
            </div>
            {errors.cardHolderName && <span className={styles.errorText}>{t('fieldRequired', { field: t('payment.cardName') })}</span>}
          </div>

          <div className={styles.flexRow}>
            <div className={styles.inputGroup}>
              <label>{t('payment.expiry')} <span>*</span></label>
              <div className={styles.inputWrapper}>
                <input type="text" placeholder="MM/YY"
                  {...register("expiryDate", { required: true })} />
              </div>
              {errors.expiryDate && <span className={styles.errorText}>{t('fieldRequired', { field: t('payment.expiry') })}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>{t('payment.cvv')} <span>*</span></label>
              <div className={styles.inputWrapper}>
                <input type="text" placeholder="123" maxLength={4}
                  {...register("cvv", { required: true })} />
              </div>
              {errors.cvv && <span className={styles.errorText}>{t('fieldRequired', { field: t('payment.cvv') })}</span>}
            </div>
          </div>
        </div>

        <div className={styles.footerActions}>
          <button type="button" onClick={handleBack} className={styles.btnBack}>
            <ArrowLeft size={18} /> {t('payment.prev')}
          </button>
          <button type="submit" className={styles.btnComplete}>
            {t('payment.submit')} <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
