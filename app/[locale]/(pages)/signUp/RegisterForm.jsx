"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { User, Mail, Phone, Building2, Briefcase, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import styles from "@/sass/pages/sign-up/register.module.scss";
import useLanguageStore from "@/store/useLanguageStore";
import { useRouter, useParams } from "next/navigation";
import useAuthStore from "@/store/useAuthStore";
import useCitiesStore from "@/store/useCitiesStore";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const RegisterForm = () => {
    const t = useTranslations('Auth.signUp');
    const router = useRouter();
    const { locale } = useLanguageStore();
    // useLanguageStore's locale only syncs to the real route locale after client-side
    // hydration (it defaults to 'en'), so it renders wrong on first paint for /ar pages —
    // fine for the post-submit logic below (only runs after a user interaction, well
    // after hydration), but not for a link that needs to be correct in the initial HTML.
    const { locale: urlLocale } = useParams();
    const { handleSignup, isLoading } = useAuthStore();
    const { countries,handleGetCountries } = useCitiesStore();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch, trigger } = useForm();
    const password = watch("password");

    const handlePasswordChange = () => {
        if (errors.password_confirmation) trigger("password_confirmation");
    };

    useEffect(() => { handleGetCountries(); }, [handleGetCountries]);

    const onSubmit = async (formData) => {
        const result = await handleSignup(formData, locale);
        if (result?.success && result?.member) {
            toast.success(t('successMsg'));
            setTimeout(() => { router.push(`/${locale}/myProfile`); }, 500);
        } else {
            toast.error(result?.error || t('errorMsg'));
        }
    };

    return (
        <div className={styles.formCard}>
            <div className={styles.formHeader}>
                <h1>{t('title')}</h1>
                <p>{t('subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <p className={styles.sectionLabel}>{t('personalInfo')}</p>

                <div className={styles.field}>
                    <label htmlFor="fullName">{t('fullName')} <span className={styles.required}>*</span></label>
                    <div className={`${styles.inputWrapper} ${errors.full_name ? styles.hasError : ""}`}>
                        <User size={16} className={styles.inputIcon} />
                        <input id="fullName" type="text" placeholder={t('fullNamePlaceholder')}
                            {...register("full_name", { required: t('fullNameRequired') })} />
                    </div>
                    {errors.full_name && <span className={styles.error}>{errors.full_name.message}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="email">{t('email')} <span className={styles.required}>*</span></label>
                    <div className={`${styles.inputWrapper} ${errors.email ? styles.hasError : ""}`}>
                        <Mail size={16} className={styles.inputIcon} />
                        <input id="email" type="email" placeholder={t('emailPlaceholder')}
                            {...register("email", {
                                required: t('emailRequired'),
                                pattern: { value: /^\S+@\S+\.\S+$/, message: t('emailInvalid') },
                            })} />
                    </div>
                    {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="phone">{t('phone')} <span className={styles.required}>*</span></label>
                    <div className={`${styles.inputWrapper} ${errors.phone ? styles.hasError : ""}`}>
                        <Phone size={16} className={styles.inputIcon} />
                        <input id="phone" type="tel" placeholder={t('phonePlaceholder')}
                            {...register("phone", { required: t('phoneRequired') })} />
                    </div>
                    {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="country_id">{t('country')} <span className={styles.required}>*</span></label>
                    <div className={`${styles.inputWrapper} ${styles.noIcon} ${errors.country_id ? styles.hasError : ""}`}>
                        <select id="country_id" defaultValue=""
                            {...register("country_id", { required: t('countryRequired') })}>
                            <option value="" disabled>{t('countryPlaceholder')}</option>
                            {countries?.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    {errors.country_id && <span className={styles.error}>{errors.country_id.message}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="company">{t('company')}</label>
                    <div className={styles.inputWrapper}>
                        <Building2 size={16} className={styles.inputIcon} />
                        <input id="company" type="text" placeholder={t('companyPlaceholder')}
                            {...register("company")} />
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="jobTitle">{t('jobTitle')}</label>
                    <div className={styles.inputWrapper}>
                        <Briefcase size={16} className={styles.inputIcon} />
                        <input id="jobTitle" type="text" placeholder={t('jobTitlePlaceholder')}
                            {...register("jobTitle")} />
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="password">{t('password')} <span className={styles.required}>*</span></label>
                    <div className={`${styles.inputWrapper} ${errors.password ? styles.hasError : ""}`}>
                        <Lock size={16} className={styles.inputIcon} />
                        <input id="password" type={showPassword ? "text" : "password"}
                            placeholder={t('passwordPlaceholder')}
                            {...register("password", { required: t('passwordRequired'), onChange: handlePasswordChange })} />
                        <button type="button" className={styles.eyeBtn}
                            onClick={() => setShowPassword((prev) => !prev)}>
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <span className={styles.error}>{errors.password.message}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="password_confirmation">{t('confirmPassword')} <span className={styles.required}>*</span></label>
                    <div className={`${styles.inputWrapper} ${errors.password_confirmation ? styles.hasError : ""}`}>
                        <Lock size={16} className={styles.inputIcon} />
                        <input id="password_confirmation" type={showConfirmPassword ? "text" : "password"}
                            placeholder={t('confirmPlaceholder')}
                            {...register("password_confirmation", {
                                required: t('confirmRequired'),
                                validate: (value) => value === password || t('confirmMismatch'),
                            })} />
                        <button type="button" className={styles.eyeBtn}
                            onClick={() => setShowConfirmPassword((prev) => !prev)}>
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <span className={styles.error}>{errors.password_confirmation.message}</span>
                    )}
                </div>

                <label className={styles.termsBox}>
                    <input type="checkbox" {...register("terms", { required: true })} />
                    <p>
                        {t('terms')}{" "}
                        <Link href="/terms" onClick={(e) => e.stopPropagation()}>{t('termsLink')}</Link>
                        {" "}{t('and')}{" "}
                        <Link href={`/${urlLocale}/privacy`} onClick={(e) => e.stopPropagation()}>{t('privacyLink')}</Link>
                    </p>
                </label>
                {errors.terms && <p className={styles.termsError}>{t('termsRequired')}</p>}

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                    {isLoading ? t('submitting') : t('submit')}
                    {!isLoading && <ArrowRight size={16} />}
                </button>
            </form>

            <p className={styles.alreadyHave}>
                {t('alreadyHave')}
                <Link href={`/${urlLocale}/signIn`}>{t('signIn')}</Link>
            </p>
        </div>
    );
};

export default RegisterForm;
