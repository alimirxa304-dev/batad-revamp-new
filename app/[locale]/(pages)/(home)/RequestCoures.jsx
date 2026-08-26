'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import {
  BookOpen,
  ChevronDown,
  Mail,
  Phone,
  Send,
  User
} from "lucide-react";

import Title from "@/components/common/Title";
import styles from '@/sass/pages/home/request-coures.module.scss';
import containerStyles from '@/sass/components/common/container.module.scss';
import DropdownMenuCustom from "@/components/common/DropdownMenu";
import useCoursesStore from '@/store/useCoursesStore';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), { ssr: false });

const FormField = ({ icon: Icon, error, children, className = "" }) => (
  <div className={`${styles['request-courses__field-group']} ${className}`}>
    <div className={`
      ${styles['request-courses__input-wrapper']}
      ${error ? styles['request-courses__input-wrapper--error'] : ''}
    `}>
      {Icon && <Icon size={20} className={styles['request-courses__input-icon']} />}
      {children}
    </div>
    {error && <span className={styles['request-courses__error']}>{error.message}</span>}
  </div>
);

const RequestCoures = () => {
  const t = useTranslations('RequestCourse');
  const router = useRouter();
  const { locale } = useParams();
  const { data: coursesData, handleGetCourses } = useCoursesStore();

  useEffect(() => {
    handleGetCourses();
  }, []);

  const courseOptions = useMemo(
    () => (coursesData?.courses || []).map((c) => ({ label: c.name, value: c.id })),
    [coursesData]
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", mobile: "", course: "" },
  });

  const selectedCourse = watch("course");
  const enableCaptcha = !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const onSubmit = async (data) => {
    const selected = courseOptions.find((o) => o.value === data.course);
    const params = new URLSearchParams({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      course_id: String(data.course ?? ""),
      course_name: selected?.label ?? "",
    });
    router.push(`/${locale}/registerInternalCourse?${params.toString()}`);
  };

  return (
    <section className={styles['request-courses']}>
      <div className={containerStyles.container}>
        <Title
          title={t('title')}
          span={t('titleSpan')}
          subtitle={t('subtitle')}
        />

        <div className={styles['request-courses__content']}>
          <div className={styles['request-courses__right']}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles['request-courses__form']}
              noValidate
            >
              <div className={styles['request-courses__field-row']}>
                <FormField error={errors.name} icon={User}>
                  <input
                    id="fullName"
                    type="text"
                    placeholder={t('form.fullName')}
                    className={styles['request-courses__input']}
                    {...register("name", {
                      required: t('form.errors.nameRequired'),
                      minLength: { value: 2, message: t('form.errors.nameMin') },
                    })}
                  />
                </FormField>

                <FormField error={errors.email} icon={Mail}>
                  <input
                    id="email"
                    type="email"
                    placeholder={t('form.emailAddress')}
                    className={styles['request-courses__input']}
                    {...register("email", {
                      required: t('form.errors.emailRequired'),
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: t('form.errors.emailInvalid'),
                      },
                    })}
                  />
                </FormField>
              </div>

              <FormField error={errors.mobile} icon={Phone}>
                <input
                  id="mobile"
                  type="tel"
                  placeholder={t('form.mobileNumber')}
                  className={styles['request-courses__input']}
                  {...register("mobile", {
                    required: t('form.errors.mobileRequired'),
                    pattern: {
                      value: /^[0-9+\s\-()\\.]{7,15}$/,
                      message: t('form.errors.mobileInvalid'),
                    },
                  })}
                />
              </FormField>

              <FormField error={errors.course} icon={BookOpen}>
                <Controller
                  name="course"
                  control={control}
                  rules={{ required: t('form.errors.courseRequired') }}
                  render={({ field }) => (
                    <DropdownMenuCustom
                      label={t('form.selectCourse')}
                      options={courseOptions}
                      value={field.value}
                      onChange={field.onChange}
                      triggerClassName={`
                        ${styles['request-courses__input']}
                        ${styles['request-courses__select']}
                        ${!selectedCourse ? styles.placeholder : ""}
                      `}
                      icon={<ChevronDown size={20} className={styles['request-courses__select-arrow']} />}
                    />
                  )}
                />
              </FormField>

              {enableCaptcha && (
                <div style={{ marginTop: '24px', minHeight: 78 }}>
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={(token) => setRecaptchaToken(token)}
                    onExpired={() => setRecaptchaToken(null)}
                  />
                  {!recaptchaToken && errors.recaptcha && (
                    <span style={{ color: '#EF4444', fontSize: '12px' }}>{t('form.errors.recaptcha')}</span>
                  )}
                </div>
              )}

              <button
                type="submit"
                className={styles['request-courses__submit']}
                disabled={isSubmitting}
              >
                {isSubmitting ? t('form.sending') : t('form.sendRequest')}
                {!isSubmitting && <Send size={16} color="#FFFFFF" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequestCoures;
