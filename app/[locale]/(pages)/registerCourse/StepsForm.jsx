import React, { useEffect, useState } from 'react';
import { User, Mail, Phone, Briefcase, ArrowRight, Users, Plus, X, ChevronDown } from 'lucide-react';
import { useFieldArray, Controller } from 'react-hook-form';
import RegistrationTypeToggle from './RegistrationTypeToggle';
import styles from '@/sass/pages/register-course/steps-form.module.scss';
import DropdownMenuCustom from '@/components/common/DropdownMenu';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), { ssr: false });

const StepsForm = ({ handleSubmit, onSubmit, errors, register, control, setRegType, regType,countries }) => {
  const t = useTranslations('RegisterCourse');
  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants"
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  useEffect(() => {
    if (regType === 'company' && fields.length === 0) {
      append({ fullName: '', email: '', jobTitle: '', phone: '', mobile: '' });
    }
  }, [regType, fields.length, append]);

  const countryOptions = countries?.map(country => ({
    value: country.id,
    label: country.name
  }));
  return (
    <div className={styles.formContent}>
      <div className={styles.formCard}>
        <div className={styles.formHeader}>
          <h2>{t('personalInfo')}</h2>
          <p className={styles.subtitle}>{t('personalSubtitle')}</p>
        </div>
        <div className={styles.registrationTypeSection}>
          <div className={styles.sectionTitle}>
            <Users color='#C9302C' size={20} /> {t('registrationType')} *
          </div>

          <RegistrationTypeToggle
            value={regType}
            onChange={setRegType}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>


          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <label>{t('fullName')} <span>*</span></label>
              <div className={styles.inputWrapper}>
                <User />
                <input type="text" placeholder={t('fullName')} {...register("fullName", { required: true })} />
              </div>
              {errors.fullName && <span className={styles.errorText}>{t('fieldRequired', { field: t('fullName') })}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>{t('email')} <span>*</span></label>
              <div className={styles.inputWrapper}>
                <Mail />
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                />
              </div>
              {errors.email && <span className={styles.errorText}>{t('invalidEmail')}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>{t('phone')} <span>*</span></label>
              <div className={styles.inputWrapper}>
                <Phone />
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register("phone", { required: true })}
                />
              </div>
              {errors.phone && <span className={styles.errorText}>{t('fieldRequired', { field: t('phone') })}</span>}
            </div>
            <div className={styles.inputGroup}>
              <label>{t('country')} <span>*</span></label>
              <div className={styles.inputWrapper}>
                <Controller
                  name="country"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DropdownMenuCustom
                      label={t('countryPlaceholder')}
                      options={countryOptions}
                      value={field.value}
                      onChange={field.onChange}
                      icon={<ChevronDown size={14} />}
                    />
                  )}
                />
              </div>
              {errors.country && <span className={styles.errorText}>{t('selectCountry')}</span>}
            </div>
          </div>

          {regType === 'individual' && (
            <div className={styles.optionalSection}>
              <h3>{t('professionalInfo')}</h3>
              <div className={styles.optinals} >
                <div className={styles.inputGroup}>
                  <label>{t('companyName')}</label>
                  <div className={styles.inputWrapper}>
                    <Briefcase />
                    <input
                      type="text"
                      placeholder={t('companyName')}
                      {...register("company_name")}
                    />
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label>{t('jobTitle')}</label>
                  <div className={styles.inputWrapper}>
                    <Briefcase />
                    <input type="text" placeholder={t('jobTitle')} {...register("jobTitle")} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {regType === 'company' && (
            <div className={styles.participantsSection}>
              <div className={styles.sectionHeader}>
                <div className={styles.titleWithBadge}>
                  <div className={styles.sectionTitle}>
                    <Users color='#C9302C' size={20} /> {t('participants')}
                  </div>
                  <span className={styles.participantBadge}>{fields.length} {fields.length === 1 ? t('participant') : t('participantsPlural')}</span>
                </div>
                <p className={styles.sectionSubtitle}>{t('participantsHint')}</p>
              </div>

              <div className={styles.participantsList}>
                {fields.map((field, index) => (
                  <div key={field.id} className={styles.participantCard}>
                    <div className={styles.participantCardHeader}>
                      <h4>{t('participantLabel')} {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className={styles.removeBtn}
                        disabled={fields.length === 1}
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className={styles.participantFields}>
                      <div className={styles.inputGroup}>
                        <label>{t('fullName')}</label>
                        <div className={styles.inputWrapper}>
                          <input
                            type="text"
                            placeholder={t('fullName')}
                            {...register(`participants.${index}.fullName`)}
                          />
                        </div>
                      </div>

                      <div className={styles.fieldRow}>
                        <div className={styles.inputGroup}>
                          <label>{t('email')}</label>
                          <div className={styles.inputWrapper}>
                            <input
                              type="email"
                              placeholder="nour@company.com"
                              {...register(`participants.${index}.email`)}
                            />
                          </div>
                        </div>
                        <div className={styles.inputGroup}>
                          <label>{t('jobTitle')}</label>
                          <div className={styles.inputWrapper}>
                            <input
                              type="text"
                              placeholder={t('jobTitle')}
                              {...register(`participants.${index}.jobTitle`)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className={styles.fieldRow}>
                        <div className={styles.inputGroup}>
                          <label>{t('phone')}</label>
                          <div className={styles.inputWrapper}>
                            <input
                              type="tel"
                              placeholder="+2010947523945"
                              {...register(`participants.${index}.phone`)}
                            />
                          </div>
                        </div>
                        <div className={styles.inputGroup}>
                          <label>{t('mobile')}</label>
                          <div className={styles.inputWrapper}>
                            <input
                              type="tel"
                              placeholder="+2010947523945"
                              {...register(`participants.${index}.mobile`)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className={styles.addParticipantBtn}
                onClick={() => append({ fullName: '', email: '', jobTitle: '', phone: '', mobile: '' })}
              >
                <Plus size={18} /> {t('addParticipant')}
              </button>
            </div>
          )}


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
          <div className={styles.footerActions}>
            <button type="submit" className={styles.btnContinue}>
              {t('next')} <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepsForm;