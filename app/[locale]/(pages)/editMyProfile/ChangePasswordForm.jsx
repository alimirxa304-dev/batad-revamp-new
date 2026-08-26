"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, Circle, KeyRound } from "lucide-react";
import styles from "@/sass/pages/edit-my-profile/edit-my-profile.module.scss";
import { useTranslations } from "next-intl";

const PasswordField = ({ id, label, placeholder, required }) => {
    const [show, setShow] = useState(false);
    return (
        <div className={`${styles.field} ${required === "full" ? styles.fullWidth : ""}`}>
            <label htmlFor={id} className={styles.fieldLabel}>
                {label}
                {required && required !== "full" && <span className={styles.required}>*</span>}
                {required === "full" && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.inputWrapperPassword}>
                <span className={styles.inputIcon}>
                    <Lock size={15} />
                </span>
                <input
                    id={id}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShow((s) => !s)}
                    aria-label={show ? "Hide password" : "Show password"}
                >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
        </div>
    );
};

const ChangePasswordForm = () => {
    const t = useTranslations('EditProfile');

    const requirements = [
        { id: "length",    label: t('passwordReqs.length') },
        { id: "number",    label: t('passwordReqs.number') },
        { id: "case",      label: t('passwordReqs.case') },
        { id: "special",   label: t('passwordReqs.special') },
    ];

    return (
        <div className={styles.card}>
            <h2 className={styles.sectionTitle}>
                <KeyRound size={17} />
                {t('changePassword')}
            </h2>
            <p className={styles.sectionSubtitle}>
                {t('changePasswordHint')}
            </p>

            <div className={styles.passwordGrid}>
                {/* Current password — full width */}
                <PasswordField
                    id="currentPassword"
                    label={t('currentPassword')}
                    placeholder={t('currentPasswordPlaceholder')}
                    required="full"
                />

                {/* New + confirm side by side */}
                <PasswordField
                    id="newPassword"
                    label={t('newPassword')}
                    placeholder={t('newPasswordPlaceholder')}
                    required={true}
                />
                <PasswordField
                    id="confirmPassword"
                    label={t('confirmPassword')}
                    placeholder={t('confirmPasswordPlaceholder')}
                    required={true}
                />

                {/* Requirements */}
                <div className={styles.passwordRequirements}>
                    <p className={styles.reqTitle}>
                        <CheckCircle2 size={14} />
                        {t('passwordRequirements')}
                    </p>
                    <div className={styles.reqGrid}>
                        {requirements.map((r) => (
                            <div key={r.id} className={styles.reqItem}>
                                <span className={styles.reqIcon}>
                                    <Circle size={9} />
                                </span>
                                {r.label}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordForm;
