'use client'
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight, BookOpen, Briefcase, Clock, Eye, Play,
    MessageSquare, Users, GraduationCap, MapPin, Building2,
    Sparkles, TrendingUp, ChevronRight, Calendar, FileText,
    Star, BadgeCheck, Lightbulb
} from 'lucide-react';
import Tabs from "@/components/common/Tabs";
import Title from "@/components/common/Title";
import Skeleton from "@/components/ui/Skeleton";
import styleContainer from '@/sass/components/common/container.module.scss';
import styles from '@/sass/pages/home/lastest-publication.module.scss';
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import useCoursesStore from "@/store/useCoursesStore";
import usePostsStore from "@/store/usePostsStore";
import useConsultingStore from "@/store/useConsultingStore";
import defaultImage from "/public/asstes/default-1.jpeg";
import videoThumbnail from "/public/asstes/logo.png";

const videoData = [
    {
        id: 1,
        title: "What Is The Marketing?",
        description: "Marketing is a vital administrative science globally. Due to its significant developments, the marketing function has become an essential means for businesses to ensure professional success and sustainability in the business environment.",
        duration: "12:45",
        views: "2.5K Views",
        date: "2 days ago",
        thumbnail: videoThumbnail,
    },
]

const Videos = ({ watchNow }) => {
    return (
        <div>
            {videoData.map((video) => (
                <div key={video.id} className={styles.videoCard}>
                    <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 1200px"
                        className={styles.videoThumbnail}
                    />
                    <button className={styles.playBtn} aria-label="Play video">
                        <Play />
                    </button>
                    <div className={styles.videoContent}>
                        <h3 className={styles.videoTitle}>{video.title}</h3>
                        <p className={styles.videoDescription}>{video.description}</p>

                        <div className={styles.videoMeta}>
                            <span className={styles.metaItem}>
                                <Clock /> {video.duration}
                            </span>
                            <span className={styles.metaItem}>
                                <Eye /> {video.views}
                            </span>
                            <span className={styles.metaItem}>
                                {video.date}
                            </span>
                        </div>

                        <button className={styles.watchNowBtn}>
                            {watchNow} <ArrowRight />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

// ─── Blogs Tab ──────────────────────────────────────────────
const Blogs = ({ t, locale }) => {
    const cards = ['card1', 'card2', 'card3'];
    const images = ['/asstes/default-1.jpeg', '/asstes/course1.jpg', '/asstes/default-2.webp'];
    const categoryColors = ['#C62839', '#162554', '#3b82f6'];
    const { handleGetPosts, posts, isLoading } = usePostsStore();
    useEffect(() => {
        handleGetPosts();
    }, [])

    if (isLoading) {
        return (
            <div className={styles.blogsGrid}>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} type="card" />
                ))}
            </div>
        );
    }

    return (
        <div className={styles.blogsGrid}>
            {posts?.posts?.slice(0, 3)?.map((post, i) => {
                const { id, name, description, date, publish_date, image } = post;
                return (
                    <motion.div
                        key={id ?? i}
                        className={styles.blogCard}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        whileHover={{ y: -8 }}
                    >
                        <div className={styles.blogImageWrapper}>
                            <Image
                                src={image || defaultImage}
                                alt={name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className={styles.blogImage}
                            />
                            <div className={styles.blogImageOverlay} />
                            {/* {
                            category && (
                                   <span
                            className={styles.blogCategory}
                            style={{ backgroundColor: categoryColors[i] }}
                        >
                            {category}
                        </span>

                            )
                        } */}

                        </div>
                        <div className={styles.blogContent}>
                            <h3 className={styles.blogTitle}>{name}</h3>
                            <p className={styles.blogExcerpt}>{description
                            }</p>
                            <div className={styles.blogFooter}>
                                <span className={styles.blogDate}>{date}</span>
                                <div className={styles.blogReadTime}>
                                    <Clock size={13} />
                                    <span>{
                                        publish_date} {t('published')}</span>
                                </div>
                            </div>
                            <Link href={`/${locale}/post/${encodeURIComponent(post?.slug ?? "")}`} className={styles.blogReadBtn}>
                                {t('readArticle')} <ArrowRight size={15} />
                            </Link>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    );
};

// ─── Courses Tab ────────────────────────────────────────────
const Courses = ({ t, locale }) => {
   
    const { handleGetCourses, data, isLoading } = useCoursesStore();

    useEffect(() => {
        handleGetCourses();
    }, []);

    if (isLoading) {
        return (
            <div className={styles.coursesGrid}>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} type="card" />
                ))}
            </div>
        );
    }

    return (
        <div className={styles.coursesGrid}>
            {data?.courses?.slice(0, 3)?.map((course, i) => (
                <motion.div
                    key={course.id}
                    className={styles.courseCard}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                >
                    <div className={styles.courseImageWrapper}>
                        <Image
                            src={course.image || defaultImage}
                            alt={course.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className={styles.courseImage}
                        />
                        <div className={styles.courseImageOverlay} />
                        <span className={styles.coursePrice}>
                            {course.price}
                        </span>
                        <span className={styles.courseCategoryBadge}>
                            {course?.category?.name}
                        </span>
                    </div>
                    <div className={styles.courseContent}>
                        <h3 className={styles.courseTitle}>{course.name}</h3>
                        <div className={styles.courseStats}>
                            {/* <div className={styles.courseStat}>
                                <Users size={14} />
                                <span>{t(course.studentCount)} {t('students')}</span>
                            </div> */}
                            {/* <div className={styles.courseStat}>
                                <BookOpen size={14} />
                                <span>{t(course.lessonCount)} {t('lessons')}</span>
                            </div>
                            <div className={styles.courseStat}>
                                <Clock size={14} />
                                <span>{t(`courses.${key}.durationWeeks`)} {t('weeks')}</span>
                            </div>
                        </div>
                        <div className={styles.courseRating}>
                            {[...Array(5)].map((_, si) => (
                                <Star key={si} size={14} fill="#f59e0b" color="#f59e0b" />
                            ))}
                            <span className={styles.ratingText}>4.9</span>
                        </div> */}
                            <Link href={`/${locale}/course_details/${course?.id}/${encodeURIComponent(course?.slug ?? "")}`} className={styles.courseEnrollBtn}>
                                {t('details')} <ArrowRight size={15} />
                            </Link>
                        </div>

                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// ─── Consultancy Tab ────────────────────────────────────────
const Consultancy = ({ t, locale }) => {
    const cards = ['card1', 'card2', 'card3'];
    const iconComponents = [
        <Lightbulb key="l" size={28} />,
        <Users key="u" size={28} />,
        <TrendingUp key="t" size={28} />
    ];
    const gradients = [
        'linear-gradient(135deg, #162554 0%, #3b82f6 100%)',
        'linear-gradient(135deg, #C62839 0%, #e85d6a 100%)',
        'linear-gradient(135deg, #0f766e 0%, #2dd4bf 100%)',
    ];

    const {handleGetConsulting , data, isLoading} = useConsultingStore();


    useEffect(() =>{
        handleGetConsulting()

    }, []);


    if (isLoading) {
        return (
            <div className={styles.consultancyGrid}>
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} type="card" />
                ))}
            </div>
        );
    }

    return (
        <div className={styles.consultancyGrid}>
            {data?.items?.slice(0,3).map((item, i) => (
                <motion.div
                    key={item?.id}
                    className={styles.consultancyCard}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                >
                    <div className={styles.consultancyIconWrapper} style={{ background: gradients[i] }}>
                        {iconComponents[i]}
                    </div>
                    <h3 className={styles.consultancyTitle}>{item?.name}</h3>
                    <p className={styles.consultancyDescription}>
                        {item?.description}
                    </p>
                    {/* <div className={styles.consultancyFeatures}>
                        {item?.consult_services?.map((feat, fi) => (
                            <span key={fi} className={styles.featureTag}>
                                <BadgeCheck size={12} /> {feat.trim()}
                            </span>
                        ))}
                    </div> */}
                    <Link href={`/${locale}/page/${encodeURIComponent(item?.slug ?? "")}`} className={styles.consultancyBtn}>
                        {t('requestConsultation')} <ChevronRight size={16} />
                    </Link>
                </motion.div>
            ))}
        </div>
    );
};

// ─── Work With Us Tab ───────────────────────────────────────
const WorkWithUs = ({ t, locale }) => {
    const cards = ['card1', 'card2', 'card3'];
    const typeBadgeColors = {
        'Full Time': '#162554',
        'دوام كامل': '#162554',
        'Remote': '#0f766e',
        'عن بُعد': '#0f766e',
    };

    return (
        <div className={styles.jobsGrid}>
            {cards.map((key, i) => (
                <motion.div
                    key={key}
                    className={styles.jobCard}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    whileHover={{ y: -6 }}
                >
                    <div className={styles.jobHeader}>
                        <div className={styles.jobIconCircle}>
                            <Briefcase size={22} />
                        </div>
                        <span
                            className={styles.jobTypeBadge}
                            style={{
                                backgroundColor: (typeBadgeColors[t(`workWithUs.${key}.type`)] || '#162554') + '14',
                                color: typeBadgeColors[t(`workWithUs.${key}.type`)] || '#162554'
                            }}
                        >
                            {t(`workWithUs.${key}.type`)}
                        </span>
                    </div>
                    <h3 className={styles.jobRole}>{t(`workWithUs.${key}.role`)}</h3>
                    <div className={styles.jobMeta}>
                        <span className={styles.jobMetaItem}>
                            <Building2 size={15} />
                            {t(`workWithUs.${key}.department`)}
                        </span>
                        <span className={styles.jobMetaItem}>
                            <MapPin size={15} />
                            {t(`workWithUs.${key}.location`)}
                        </span>
                    </div>
                    <div className={styles.jobDivider} />
                    <Link href={`/${locale}/jobs`} className={styles.jobApplyBtn}>
                        {t('applyNow')} <ArrowRight size={15} />
                    </Link>
                </motion.div>
            ))}
        </div>
    );
};


// ─── Main Component ─────────────────────────────────────────
// Blogs only — the Videos/Courses/Consultancy/WorkWithUs tabs above are kept
// in this file in case they're brought back later.
const LastestPublication = () => {
    const t = useTranslations('LatestPublication');
    const { locale } = useParams();

    return (
        <section>
            <div className={styleContainer.container}>
                <Title title={t('title')} span={t('titleSpan')} />
                <Blogs t={t} locale={locale} />
            </div>
        </section>
    );
};

export default LastestPublication;