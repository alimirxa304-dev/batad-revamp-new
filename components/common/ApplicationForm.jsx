"use client";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronDown, Mail, Phone, User } from "lucide-react";
import DropdownMenuCustom from "@/components/common/DropdownMenu";
import styles from "@/sass/components/common/application-modal.module.scss";
import useConsultingStore from "@/store/useConsultingStore";
import useCitiesStore from "@/store/useCitiesStore";
import SuccessfullMassage from "./SuccessfullMassage";
import { useTranslations } from "next-intl";

const ApplicationForm = ({ onClose, consultingServiceId }) => {
  const t = useTranslations('Consulting.form');
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      name: "", email: "", phone: "",
      country_id: null, details: "", consultancy_service_id: null,
    },
  });

  const { isBookingLoading, handleBookingConsultation } = useConsultingStore();
  const { cities, handleGetCities } = useCitiesStore();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    const countryId = data.country_id?.value || data.country_id;
    formData.append('country_id', countryId);
    formData.append('details', data.details);
    formData.append('consultancy_service_id', consultingServiceId);

    try {
      const response = await handleBookingConsultation(formData);
      if (response?.success) {
        setTimeout(() => setShowSuccessMessage(true), 1000);
        reset();
      }
    } catch (error) {
      console.error("Store Error:", error);
    }
  };

  useEffect(() => { handleGetCities(); }, []);

  if (showSuccessMessage) {
    return <SuccessfullMassage message="Success!" onClose={onClose} />;
  }

  return (
    <>
      <div className={styles.header}>
        <div>
          <Dialog.Title className={styles.title}>{t('title')}</Dialog.Title>
          <Dialog.Description className={styles.subtitle}>{t('subtitle')}</Dialog.Description>
        </div>
        <Dialog.Close asChild>
          <button className={styles.closeBtn} aria-label="Close">✕</button>
        </Dialog.Close>
      </div>

      <div className={styles.body}>
        <form id="consultation-form" onSubmit={handleSubmit(onSubmit)} noValidate>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <span className={styles.icon}><User color="#1E2749" size={16} /></span>
              {t('personalInfo')}
            </h3>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label className={styles.label}>
                  {t('fullName')} <span className={styles.req}>*</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><User color="#99A1AF" size={16} /></span>
                  <input
                    className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                    placeholder={t('fullNamePlaceholder')}
                    {...register("name", { required: t('fullNameRequired') })}
                  />
                </div>
                {errors.name && <span className={styles.errorMsg}>{errors.name.message}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  {t('email')} <span className={styles.req}>*</span>
                </label>
                <div className={styles.inputWrap}>
                  <span className={styles.inputIcon}><Mail color="#99A1AF" size={16} /></span>
                  <input
                    className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    {...register("email", {
                      required: t('emailRequired'),
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('emailInvalid') },
                    })}
                  />
                </div>
                {errors.email && <span className={styles.errorMsg}>{errors.email.message}</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                {t('phone')} <span className={styles.req}>*</span>
              </label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}><Phone color="#99A1AF" size={16} /></span>
                <input
                  className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                  placeholder={t('phonePlaceholder')}
                  {...register("phone", {
                    required: t('phoneRequired'),
                    pattern: { value: /^[+\d\s\-()]{7,20}$/, message: t('phoneInvalid') },
                  })}
                />
              </div>
              {errors.phone && <span className={styles.errorMsg}>{errors.phone.message}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                {t('country')} <span className={styles.req}>*</span>
              </label>
              <Controller
                name="country_id"
                control={control}
                rules={{ required: t('countryRequired') }}
                render={({ field }) => (
                  <div className={`${styles.dropdownWrap} ${errors.country ? styles.dropdownError : ""}`}>
                    <DropdownMenuCustom
                      label={field.value?.label ?? t('countryPlaceholder')}
                      options={cities?.map((item) => ({ label: item.name, value: item.id }))}
                      value={field.value}
                      onChange={(option) => field.onChange(option)}
                      triggerClassName={styles.dropdownTrigger}
                      icon={<ChevronDown size={16} className={styles.dropdownArrow} />}
                    />
                  </div>
                )}
              />
              {errors.country && <span className={styles.errorMsg}>{errors.country.message}</span>}
            </div>
          </section>

          <div className={styles.field}>
            <label className={styles.label}>{t('consultingDetails')}</label>
            <textarea
              className={`${styles.textarea} ${errors.details ? styles.inputError : ""}`}
              placeholder={t('detailsPlaceholder')}
              rows={6}
              {...register("details", {
                maxLength: { value: 1000, message: t('detailsMax') },
              })}
            />
            {errors.details && <span className={styles.errorMsg}>{errors.details.message}</span>}
          </div>

        </form>
      </div>

      <div className={styles.footer}>
        <button
          type="submit"
          form="consultation-form"
          disabled={isBookingLoading}
          className={styles.submitBtn}
        >
          {isBookingLoading ? <span>{t('loading')}</span> : t('submit')}
        </button>
      </div>
    </>
  );
};

export default ApplicationForm;
