"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import styles from "@/sass/pages/sign-In/login.module.scss";
import useAuthStore from "@/store/useAuthStore";
import useLanguageStore from "@/store/useLanguageStore";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const LoginForm = () => {
    const t = useTranslations('Auth.signIn');
    const [showPassword, setShowPassword] = useState(false);
    const { locale } = useLanguageStore();
    // useLanguageStore's locale only syncs to the real route locale after client-side
    // hydration (it defaults to 'en'), so it renders wrong on first paint for /ar pages —
    // fine for the post-submit logic below (only runs after a user interaction, well
    // after hydration), but not for a link that needs to be correct in the initial HTML.
    const { locale: urlLocale } = useParams();
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { handleLogin, isLoading } = useAuthStore();

    const onSubmit = async (data) => {
        const result = await handleLogin(data, locale);
        if (result?.success && result?.data?.member) {
            toast.success(t('loginSuccess'));
            setTimeout(() => { router.push(`/${locale}/myProfile`); }, 3000);
        } else {
            toast.error(result?.error || t('loginFailed'));
        }
    };

    return (
        <div className={styles.formCard}>
            <div className={styles.formHeader}>
                <h1>{t('welcome')}</h1>
                <p>{t('subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={styles.field}>
                    <label htmlFor="email">
                        {t('email')} <span className={styles.required}>*</span>
                    </label>
                    <div className={`${styles.inputWrapper} ${errors.email ? styles.hasError : ""}`}>
                        <Mail size={16} className={styles.inputIcon} />
                        <input
                            id="email"
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

                <div className={styles.field}>
                    <label htmlFor="password">
                        {t('password')} <span className={styles.required}>*</span>
                    </label>
                    <div className={`${styles.inputWrapper} ${errors.password ? styles.hasError : ""}`}>
                        <Lock size={16} className={styles.inputIcon} />
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder={t('passwordPlaceholder')}
                            {...register("password", { required: t('passwordRequired') })}
                        />
                        <button
                            type="button"
                            className={styles.eyeBtn}
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <span className={styles.error}>{errors.password.message}</span>}
                </div>

                <div className={styles.formOptions}>
                    <label className={styles.rememberMe}>
                        <input type="checkbox" {...register("rememberMe")} />
                        <span>{t('rememberMe')}</span>
                    </label>
                    <Link href={`/${urlLocale}/forgetPassword`} className={styles.forgotLink}>
                        {t('forgotPassword')}
                    </Link>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                    {isLoading ? t('submitting') : t('submit')}
                    {!isLoading && <ArrowRight size={16} />}
                </button>
            </form>

            <div className={styles.divider}>
                <span>{t('newUser')}</span>
            </div>

            <Link href={`/${urlLocale}/signUp`} className={styles.signUpBtn}>
                {t('signUp')}
            </Link>
        </div>
    );
};

export default LoginForm;
