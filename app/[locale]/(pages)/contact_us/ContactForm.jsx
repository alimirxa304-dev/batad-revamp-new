'use client';
import { useState } from "react";
import dynamic from "next/dynamic";
import { useForm, Controller } from "react-hook-form";
import { User, Mail, Phone, Package, MessageSquare, Send, MessageCircle, ChevronDown, CheckCircle } from "lucide-react";
import DropdownMenuCustom from "@/components/common/DropdownMenu";
import styles from "@/sass/pages/contact/form.module.scss";
import { submitContact } from "@/action/contact";
import useLanguageStore from "@/store/useLanguageStore";
import { useTranslations } from "next-intl";

const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), { ssr: false });

const ContactForm = () => {
    const t = useTranslations('Contact');

    const subjects = [
        t('subjects.courseInquiry'),
        t('subjects.trainingPrograms'),
        t('subjects.consultingServices'),
        t('subjects.technicalSupport'),
        t('subjects.other'),
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const enableCaptcha = !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    const { register, control, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (formData) => {
        if (enableCaptcha && !recaptchaToken) return;
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const locale = useLanguageStore.getState().locale;
            const result = await submitContact(locale, {
                name: formData.fullName,
                email: formData.email,
                phone: formData.phone || "",
                po_box: formData.poBox || "",
                subject: formData.subject,
                message: formData.message,
            });
            if (result?.success) {
                setSubmitted(true);
                reset();
                setTimeout(() => setSubmitted(false), 4000);
            } else {
                setSubmitError(result?.message || t('errorMsg'));
            }
        } catch {
            setSubmitError(t('errorMsg'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formCard}>
            <div className={styles.formHeader}>
                <div className={styles.iconBox}>
                    <MessageCircle size={22} color="#fff" />
                </div>
                <div>
                    <h2>{t('formTitle')}</h2>
                    <p>{t('formSubtitle')}</p>
                </div>
            </div>

            {submitted && (
                <div className={styles.successMessage}>
                    <CheckCircle size={18} />
                    <span>{t('successMsg')}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.field}>
                    <label>{t('fullName')} <span>*</span></label>
                    <div className={`${styles.inputWrapper} ${errors.fullName ? styles.hasError : ""}`}>
                        <User size={16} className={styles.inputIcon} />
                        <input
                            type="text"
                            placeholder={t('fullNamePlaceholder')}
                            {...register("fullName", { required: t('fullNameRequired') })}
                        />
                    </div>
                    {errors.fullName && <span className={styles.error}>{errors.fullName.message}</span>}
                </div>

                <div className={styles.field}>
                    <label>{t('email')} <span>*</span></label>
                    <div className={`${styles.inputWrapper} ${errors.email ? styles.hasError : ""}`}>
                        <Mail size={16} className={styles.inputIcon} />
                        <input
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            {...register("email", {
                                required: t('emailRequired'),
                                pattern: { value: /^\S+@\S+\.\S+$/, message: t('emailInvalid') },
                            })}
                        />
                    </div>
                    {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                </div>

                <div className={styles.row}>
                    <div className={styles.field}>
                        <label>{t('phone')}</label>
                        <div className={styles.inputWrapper}>
                            <Phone size={16} className={styles.inputIcon} />
                            <input type="tel" placeholder={t('phonePlaceholder')} {...register("phone")} />
                        </div>
                    </div>
                    <div className={styles.field}>
                        <label>{t('poBox')}</label>
                        <div className={styles.inputWrapper}>
                            <Package size={16} className={styles.inputIcon} />
                            <input type="text" placeholder={t('poBoxPlaceholder')} {...register("poBox")} />
                        </div>
                    </div>
                </div>

                <div className={styles.field}>
                    <label>{t('subject')} <span>*</span></label>
                    <div className={`${styles.inputWrapper} ${styles.selectWrapper} ${errors.subject ? styles.hasError : ""}`}>
                        <MessageSquare size={16} className={styles.inputIcon} />
                        <Controller
                            name="subject"
                            control={control}
                            rules={{ required: t('subjectRequired') }}
                            render={({ field }) => (
                                <DropdownMenuCustom
                                    label={t('subjectPlaceholder')}
                                    options={subjects}
                                    value={field.value}
                                    onChange={field.onChange}
                                    icon={<ChevronDown size={14} />}
                                />
                            )}
                        />
                    </div>
                    {errors.subject && <span className={styles.error}>{errors.subject.message}</span>}
                </div>

                <div className={styles.field}>
                    <label>{t('message')} <span>*</span></label>
                    <div className={`${styles.inputWrapper} ${styles.textareaWrapper} ${errors.message ? styles.hasError : ""}`}>
                        <textarea
                            rows={5}
                            placeholder={t('messagePlaceholder')}
                            {...register("message", { required: t('messageRequired') })}
                        />
                    </div>
                    {errors.message && <span className={styles.error}>{errors.message.message}</span>}
                </div>

                {enableCaptcha && (
                    <div style={{ marginTop: '24px' }}>
                        <ReCAPTCHA
                            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                            onChange={(token) => setRecaptchaToken(token)}
                            onExpired={() => setRecaptchaToken(null)}
                        />
                        {!recaptchaToken && errors.recaptcha && (
                            <span style={{ color: '#EF4444', fontSize: '12px' }}>{t('recaptchaError')}</span>
                        )}
                    </div>
                )}

                {submitError && (
                    <p style={{ color: "#EF4444", fontSize: "13px", marginTop: "8px" }}>{submitError}</p>
                )}

                <button type="submit" className={styles.submitBtn} disabled={isSubmitting || (enableCaptcha && !recaptchaToken)}>
                    <Send size={16} />
                    {isSubmitting ? t('sending') : submitted ? t('sent') : t('send')}
                </button>
            </form>
        </div>
    );
};

export default ContactForm;
