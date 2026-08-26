"use client";
import Link from "next/link";
import { ArrowLeft, Check, X } from "lucide-react";
import styles from "@/sass/pages/edit-my-profile/edit-my-profile.module.scss";
import container from "@/sass/components/common/container.module.scss";
import ProfilePicture from "./ProfilePicture";
import PersonalInfoForm from "./PersonalInfoForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { useTranslations } from "next-intl";

const EditProfilePage = () => {
    const t = useTranslations('EditProfile');
    return (
        <section className={styles.editProfilePage}>
            <div className={container.container}>

                {/* ── Page Header ── */}
                <div className={styles.pageHeader}>
                    <Link href="/myProfile" className={styles.backLink}>
                        <ArrowLeft size={14} />
                        {t('backToProfile')}
                    </Link>

                    <div className={styles.headerTop}>
                        <div className={styles.headerTitles}>
                            <h1>{t('title')}</h1>
                            <p>{t('subtitle')}</p>
                        </div>

                        <div className={styles.headerActions}>
                            <button className={styles.btnCancel}>
                                <X size={14} />
                                {t('cancel')}
                            </button>
                            <button className={styles.btnSave}>
                                <Check size={14} />
                                {t('save')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Two-column layout ── */}
                <div className={styles.editLayout}>

                    {/* Left panel */}
                    <div className={styles.leftPanel}>
                        <ProfilePicture />
                    </div>

                    {/* Right panel */}
                    <div className={styles.rightPanel}>
                        <PersonalInfoForm />
                        <ChangePasswordForm />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default EditProfilePage;
