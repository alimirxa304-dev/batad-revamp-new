"use client";
import { useEffect } from "react";
import {
    X, User, Calendar, Clock, CheckCircle, PlayCircle,
    BarChart2, BookOpen, Award, ImageIcon,
} from "lucide-react";
import styles from "@/sass/pages/my-profile/my-profile.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";

const CourseDetailsModal = ({ course, onClose }) => {
    const t = useTranslations('MyProfile');
    const isCompleted = course.status === "completed";

    // lock body scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                {/* Image banner */}
                <div className={styles.modalImageArea}>
                    {course.image ? (
                        <Image src={course.image} alt={course.title} width={400} height={400}/>
                    ) : (
                        <div className={styles.modalImagePlaceholder}>
                            <ImageIcon size={48} color="#ffffff" />
                        </div>
                    )}

                    <button
                        className={styles.modalCloseBtn}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <X size={16} />
                    </button>

                    <div className={styles.modalImageTitle}>
                        <h2>{course.title}</h2>
                    </div>
                </div>

                {/* Body */}
                <div className={styles.modalBody}>

                    {/* Tags */}
                    <div className={styles.modalTagsRow}>
                        <span className={`${styles.tag} ${styles.tagCategory}`}>
                            {course.category}
                        </span>
                        <span className={`${styles.tag} ${isCompleted ? styles.tagCompleted : styles.tagInProgress}`}>
                            {isCompleted ? t('courses.completed') : t('courses.inProgress')}
                        </span>
                    </div>

                    {/* Instructor */}
                    <div className={styles.modalInstructor}>
                        <User size={15} />
                        <span>{t('courses.instructor')} <strong>{course.instructor}</strong></span>
                    </div>

                    {/* Info grid */}
                    <div className={styles.modalInfoGrid}>
                        <div className={styles.modalInfoItem}>
                            <Calendar size={16} />
                            <div>
                                <span>{t('courses.enrolled')}</span>
                                <span>{course.enrolled}</span>
                            </div>
                        </div>
                        <div className={styles.modalInfoItem}>
                            <Clock size={16} />
                            <div>
                                <span>{t('courses.duration')}</span>
                                <span>{course.duration}</span>
                            </div>
                        </div>
                        <div className={styles.modalInfoItem}>
                            <BookOpen size={16} />
                            <div>
                                <span>{t('modal.category')}</span>
                                <span>{course.category}</span>
                            </div>
                        </div>
                        <div className={styles.modalInfoItem}>
                            {isCompleted ? <Award size={16} /> : <BarChart2 size={16} />}
                            <div>
                                <span>{isCompleted ? t('courses.completed') : t('modal.status')}</span>
                                <span>{isCompleted ? course.completedDate : t('courses.inProgress')}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.modalDivider} />

                    {/* Progress */}
                    <div className={styles.modalProgressSection}>
                        <div className={styles.progressHeader}>
                            <span>{t('modal.courseProgress')}</span>
                            <strong>{course.progress}%</strong>
                        </div>
                        <div className={styles.progressTrack}>
                            <div
                                className={`${styles.progressFill} ${isCompleted ? styles.completedFill : ""}`}
                                style={{ width: `${course.progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className={styles.modalDescription}>
                        <h4>{t('modal.about')}</h4>
                        <p>{course.description}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className={styles.modalFooter}>
                    {isCompleted ? (
                        <button className={styles.btnCertificate} style={{ flex: 1 }}>
                            <CheckCircle size={15} />
                            {t('courses.viewCertificate')}
                        </button>
                    ) : (
                        <button className={styles.btnContinue} style={{ flex: 1 }}>
                            <PlayCircle size={15} />
                            {t('courses.continueLearning')}
                        </button>
                    )}
                    <button className={styles.modalBtnSecondary} onClick={onClose}>
                        {t('modal.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsModal;
