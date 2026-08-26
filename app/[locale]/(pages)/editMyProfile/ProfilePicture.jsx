"use client";

import { Camera, Upload, ShieldCheck } from "lucide-react";
import styles from "@/sass/pages/edit-my-profile/edit-my-profile.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";

const mockUser = {
    name: "Ahmed Johnson",
    initials: "AJ",
    avatarUrl: null,
    memberSince: "Jan 2024",
    coursesEnrolled: "3 Courses",
    certificates: "1 Earned",
};

const ProfilePicture = () => {
    const t = useTranslations('EditProfile');
    return (
        <>
            {/* ── Profile Picture Card ── */}
            <div className={styles.card}>
                <p className={styles.cardTitle}>
                    <Camera size={16} />
                    {t('profilePicture')}
                </p>

                <div className={styles.avatarArea}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}>
                            {mockUser.avatarUrl ? (
                                <Image src={mockUser.avatarUrl} alt={mockUser.name} width={400} height={400}/>
                            ) : (
                                mockUser.initials
                            )}
                        </div>
                        <button className={styles.cameraBtn} aria-label="Change photo">
                            <Camera size={13} />
                        </button>
                    </div>

                    <div className={styles.avatarHint}>
                        <p>{t('photoHint1')}</p>
                        <p>{t('photoHint2')}</p>
                    </div>
                </div>

                <button className={styles.uploadBtn}>
                    <Upload size={14} />
                    {t('uploadPhoto')}
                </button>
            </div>

            {/* ── Account Status Card ── */}
            <div className={styles.accountStatusCard}>
                <div className={styles.statusHeader}>
                    <div className={styles.statusIconWrap}>
                        <ShieldCheck size={20} />
                    </div>
                    <div className={styles.statusTitles}>
                        <h3>{t('accountStatus')}</h3>
                        <span>{t('verifiedAccount')}</span>
                    </div>
                </div>

                <div className={styles.statusDivider} />

                <div className={styles.statusList}>
                    <div className={styles.statusItem}>
                        <span>{t('memberSince')}</span>
                        <span>{mockUser.memberSince}</span>
                    </div>
                    <div className={styles.statusItem}>
                        <span>{t('coursesEnrolled')}</span>
                        <span>{mockUser.coursesEnrolled}</span>
                    </div>
                    <div className={styles.statusItem}>
                        <span>{t('certificates')}</span>
                        <span>{mockUser.certificates}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePicture;
