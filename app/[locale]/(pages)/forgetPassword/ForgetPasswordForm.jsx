"use client";
import { useForm } from "react-hook-form";
import { Mail, ArrowRight } from "lucide-react";
import styles from "@/sass/pages/sign-In/login.module.scss";
import useAuthStore from "@/store/useAuthStore";
import useLanguageStore from "@/store/useLanguageStore";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const ForgetPasswordForm = () => {
    const t = useTranslations('ForgetPassword');
    const { locale } = useLanguageStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const {
        forgetPassword, isLoading
    } = useAuthStore();

    const onSubmit = async (data) => {

        const result = await forgetPassword(data, locale);
        if (result?.success) {
            toast.success(result?.data?.message);
        } else {
            toast.error(result?.error || "Failed to send reset email");
        }

    };

    return (
        <div className={styles.formCard}>
            <div className={styles.formHeader}>
                <h1>{t('title')}</h1>
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
                                required: "Email is required",
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message: t('emailInvalid'),
                                },
                            })}
                        />
                    </div>
                    {errors.email && (
                        <span className={styles.error}>{errors.email.message}</span>
                    )}
                </div>



                <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isLoading}
                >
                    {isLoading ? t('submitting') : t('submit')}
                    {!isLoading && <ArrowRight size={16} />}
                </button>
            </form>

        </div>
    );
};

export default ForgetPasswordForm;
