"use client";
import { useEffect, useState } from "react";
import { TrendingUp, Calendar, Clock, CheckCircle, PlayCircle, ImageIcon, BookOpen } from "lucide-react";
import CourseDetailsModal from "./CourseDetailsModal";
import styles from "@/sass/pages/my-profile/my-profile.module.scss";
import useUserProfileStore from "@/store/useUserProfileStore";
import Image from "next/image";
import { useTranslations } from "next-intl";
import NoData from "@/components/common/NoData";

// const courses = [
//     {
//         id: 1,
//         title: "Professional Project Management (PMP)",
//         instructor: "Dr. Michael Brown",
//         category: "Management",
//         status: "inProgress",
//         enrolled: "2025-01-15",
//         duration: "8 weeks",
//         completedDate: null,
//         progress: 75,
//         image: null,
//         description:
//             "Master the fundamentals of project management using PMI's proven framework. This course covers project initiation, planning, execution, monitoring, and closure — preparing you for the globally recognized PMP certification.",
//     },
//     {
//         id: 2,
//         title: "Digital Marketing Masterclass",
//         instructor: "Emma Wilson",
//         category: "Marketing",
//         status: "completed",
//         enrolled: "2024-11-01",
//         duration: "12 weeks",
//         completedDate: "2024-12-20",
//         progress: 100,
//         image: null,
//         description:
//             "A comprehensive deep-dive into modern digital marketing strategies including SEO, social media, email campaigns, paid advertising, and analytics. Learn to build and scale campaigns that drive measurable business results.",
//     },
//     {
//         id: 3,
//         title: "Professional Project Management (PMP)",
//         instructor: "Dr. Michael Brown",
//         category: "Management",
//         status: "inProgress",
//         enrolled: "2025-01-15",
//         duration: "8 weeks",
//         completedDate: null,
//         progress: 75,
//         image: null,
//         description:
//             "Master the fundamentals of project management using PMI's proven framework. This course covers project initiation, planning, execution, monitoring, and closure — preparing you for the globally recognized PMP certification.",
//     },
// ];

const MyCourses = () => {
    const t = useTranslations('MyProfile');
    const [selectedCourse, setSelectedCourse] = useState(null);
    const activeCount = courses.filter((c) => c.status === "inProgress").length;
    const {userCourses , handleGetUserCourses} = useUserProfileStore();

    useEffect(() => {
        handleGetUserCourses();
    }, []);

    console.log(userCourses , 'courses')
    return (
        <div>
            <div className={styles.coursesHeader}>
                <h2>{t('courses.title')}</h2>
                <div className={styles.activeCount}>
                    <TrendingUp size={14} />
                    <span>{activeCount} {t('courses.active')}</span>
                </div>
            </div>
            {
                userCourses?.courses?.length > 0 ? (
                          <div className={styles.courseList}>
                {userCourses?.courses?.map((course) => {
                    const isCompleted = course.status === "completed";
                    return (
                        <div key={course.id} className={styles.courseCard}>
                            <div className={styles.courseImage}>
                                {course.image ? (
                                    <Image src={course.image} alt={course.title} width={100} height={100} unoptimized/>
                                ) : (
                                    <div className={styles.imagePlaceholder}>
                                        <ImageIcon size={32} color="#ffffff" />
                                    </div>
                                )}
                            </div>

                            <div className={styles.courseContent}>
                                <div className={styles.tagsRow}>
                                    <span className={`${styles.tag} ${styles.tagCategory}`}>
                                        {course.category}
                                    </span>
                                    <span className={`${styles.tag} ${isCompleted ? styles.tagCompleted : styles.tagInProgress}`}>
                                        {isCompleted ? t('courses.completed') : t('courses.inProgress')}
                                    </span>
                                </div>

                                <h3 className={styles.courseTitle}>{course.title}</h3>
                                <p className={styles.instructor}>{t('courses.instructor')} {course.instructor}</p>

                                <div className={styles.metaRow}>
                                    <span className={styles.metaItem}>
                                        <Calendar size={13} />
                                        {t('courses.enrolled')} {course.enrolled}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <Clock size={13} />
                                        {t('courses.duration')} {course.duration}
                                    </span>
                                    {course.completedDate && (
                                        <span className={styles.metaItem}>
                                            <CheckCircle size={13} />
                                            {t('courses.completedDate')} {course.completedDate}
                                        </span>
                                    )}
                                </div>

                                <div className={styles.progressSection}>
                                    <div className={styles.progressHeader}>
                                        <span>{t('courses.progress')}</span>
                                        <strong>{course.progress}%</strong>
                                    </div>
                                    <div className={styles.progressTrack}>
                                        <div
                                            className={`${styles.progressFill} ${isCompleted ? styles.completedFill : ""}`}
                                            style={{ width: `${course.progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className={styles.actionsRow}>
                                    {isCompleted ? (
                                        <button className={styles.btnCertificate}>
                                            <CheckCircle size={14} />
                                            {t('courses.viewCertificate')}
                                        </button>
                                    ) : (
                                        <button className={styles.btnContinue}>
                                            <PlayCircle size={14} />
                                            {t('courses.continueLearning')}
                                        </button>
                                    )}
                                    <button
                                        className={styles.btnDetails}
                                        onClick={() => setSelectedCourse(course)}
                                    >
                                        {t('courses.courseDetails')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>


                ) :(
                    <div className={styles.noCourses}>
                        <NoData message='No courses found' icon={BookOpen}/>
                    </div>  
                )
            }

      
            {selectedCourse && (
                <CourseDetailsModal
                    course={selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                />
            )}
        </div>
    );
};

export default MyCourses;
