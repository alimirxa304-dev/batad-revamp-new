"use client";
import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Globe, ArrowLeft, ArrowRight, CircleCheck, ChevronDown } from 'lucide-react';
import { Controller, useWatch } from 'react-hook-form';
import Image from 'next/image';
import DropdownMenuCustom from '@/components/common/DropdownMenu';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReCAPTCHA from 'react-google-recaptcha';
import styles from '@/sass/pages/register-course/course-details-form.module.scss';
import { useTranslations } from 'next-intl';

const CourseDetailsForm = ({cities,durations,dates,isLoading,register, control, setValue, errors, handleBack, onSubmit, handleSubmit }) => {
  console.log(dates , 'dates from course details')
  const t = useTranslations('RegisterCourse');
  const [mounted, setMounted] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);

useEffect(() => {
    setMounted(true);
  }, []);


  const { course_date, duration_id, city_id, language = "english" } = useWatch({ control });

  const getDisplayDate = () => {
    if (course_date) {
      return course_date instanceof Date
        ? course_date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : course_date;
    }
    return t('notSelected');
  };

  const isFormComplete = course_date && duration_id && city_id;

  const selectedDuration = durations?.find(d => d.id == duration_id)?.name;
  const selectedCity = cities?.find(c => c.id == city_id)?.name;

  if (!mounted) return null;

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>{t('chooseSchedule')}</h2>
        <p className={styles.subtitle}>{t('scheduleSubtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Available Dates */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Calendar size={18} color="#1E293B" />
            <span>{t('availableDates')}</span>
          </div>
          <div className={styles.dateGrid}>
            {dates && dates.length > 0 ? (
              dates.map((item, index) => (
                <label key={index} className={styles.dateCard}>
                  <input
                    type="radio"
                    value={item.date}
                    {...register("course_date")}
                  />
                  <div className={styles.cardContent}>
                    <div className={styles.iconBox}>
                      <Calendar size={20} />
                    </div>
                    <div className={styles.info}>
                      <span className={styles.dateText}>{item.date}</span>
                    </div>
                  </div>
                </label>
              ))
            ) : (
              <p style={{ color: '#64748b', fontSize: '14px', marginTop: '10px' }}>{t('noDates')}</p>
            )}
          </div>
        </div>

        {/* Custom Date */}
        <div className={styles.customDateSection}>
          <div className={styles.customDateHeader}>
            <Calendar size={16} color="#C9302C" />
            <span>{t('customDate')}</span>
          </div>
          <div className={styles.inputWrapper}>
            <Controller
              control={control}
              name="course_date"
              render={({ field }) => (
                <DatePicker
                  placeholderText="DD / MM / YYYY"
                  onChange={(date) => {
                    field.onChange(date);
                  }}
                  selected={
                    field.value instanceof Date
                      ? field.value
                      : typeof field.value === "string" &&
                          /^\d{4}-\d{2}-\d{2}$/.test(field.value)
                        ? new Date(`${field.value}T00:00:00`)
                        : null
                  }
                  className={styles.datePickerInput}
                  dateFormat="dd / MM / yyyy"
                  isClearable
                />
              )}
            />
            {!course_date && <Calendar className={styles.inputIcon} size={18} />}
          </div>
          <p className={styles.helperText}>✨ {t('customDateHint')}</p>
        </div>

        {/* Course Duration */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Clock size={18} color="#1E293B" />
            <span>{t('courseDuration')}</span>
          </div>
          <div className={styles.durationGrid}>
            {durations.map((item, index) => (
              <label key={index} className={styles.durationCard}>
                <input type="radio" name="duration_id" value={item.id} {...register("duration_id", { required: true })} />
                <div className={styles.cardContent}>
                  <div className={styles.iconBox}>
                    <Clock size={20} />
                  </div>
                  <div className={styles.info}>
                    <span className={styles.titleText}>{item.name}</span>
                    <span className={styles.priceText}>{item.price}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Training Location */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <MapPin size={18} color="#1E293B" />
            <span>{t('trainingLocation')}</span>
          </div>
          <div className={styles.selectWrapper}>
            <Controller
              name="city_id"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DropdownMenuCustom
                  label={t('locationPlaceholder')}
                  options={cities?.map(city => ({
                    value: city.id,
                    label: city.name
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                  icon={<ChevronDown size={14} />}
                />
              )}
            />
          </div>
        </div>

        {/* Course Language */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <Globe size={18} color="#1E293B" />
            <span>{t('courseLanguage')}</span>
          </div>
          <div className={styles.languageToggle}>
            <label className={styles.langOption}>
              <input type="radio" name="language" value="english" {...register("language")} />
              <div className={styles.langContent}>
                <Image src="/asstes/en.png" alt="English" width={30} height={30} />

                <span>English</span>
              </div>
            </label>
            <label className={styles.langOption}>
              <input type="radio" name="language" value="arabic" {...register("language")} />
              <div className={styles.langContent}>
                <Image src="/asstes/ar.png" alt="Arabic" width={30} height={30} />
                <span>العربية</span>
              </div>
            </label>
          </div>
        </div>

        {
          isFormComplete && (
            <div className={styles.dataConfirmed}>
              <div className={styles.title} >
                <CircleCheck color='#00A63E' size={20} />
                <h3>{t('selectionConfirmed')}</h3>

              </div>
              <div className={styles.confirmedData}>
                <div className={styles.item}>
                  <span className={styles.icon}><Calendar size={18} color="#1E293B" /></span>
                  <div className={styles.info}>
                    <span className={styles.label}>{t('startDate')}</span>
                    <span className={styles.value}>{getDisplayDate()}</span>

                  </div>

                </div>

                <div className={styles.item}>
                  <span className={styles.icon}><Clock size={18} color="#1E293B" /></span>
                  <div className={styles.info}>
                    <span className={styles.label}>{t('duration')}</span>
                    <span className={styles.value}>{selectedDuration || t('notSelected')}</span>

                  </div>

                </div>

                <div className={styles.item}>
                  <span className={styles.icon}><MapPin size={18} color="#1E293B" /></span>
                  <div className={styles.info}>
                    <span className={styles.label}>{t('location')}</span>
                    <span className={styles.value}>{selectedCity || t('notSelected')}</span>

                  </div>

                </div>


                <div className={styles.item}>
                  <span className={styles.icon}><Globe size={18} color="#1E293B" /></span>
                  <div className={styles.info}>
                    <span className={styles.label}>{t('language')}</span>
                    <span className={styles.value}>{language.charAt(0).toUpperCase() + language.slice(1)}</span>

                  </div>


                </div>
              </div>

            </div>

          )
        }

     {/* <div style={{ marginTop: '24px' }}>

            <ReCAPTCHA

              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
              onChange={(token) => setRecaptchaToken(token)}
              onExpired={() => setRecaptchaToken(null)}
            />
            {!recaptchaToken && errors.recaptcha && (
              <span style={{ color: '#EF4444', fontSize: '12px' }}>يرجى إتمام التحقق</span>
            )}
          </div> */}
        {/* Actions */}
        <div className={styles.footerActions}>
          <button type="button" onClick={handleBack} className={styles.btnBack}>
            <ArrowLeft size={18} /> {t('prev')}
          </button>
          <button type="submit" className={styles.btnContinue}>
            {
              isLoading ? t('loading') : t('next')
            } <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseDetailsForm;
