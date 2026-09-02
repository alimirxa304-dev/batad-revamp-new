'use client'
import { motion } from "framer-motion";
import Title from "@/components/common/Title";
import Skeleton from "@/components/ui/Skeleton";
import styleContainer from '@/sass/components/common/container.module.scss';
import styles from '@/sass/pages/home/course-by-special.module.scss';
import useCategoriesStore from "@/store/useCategoriesStore";
import { isPlaceholderImage } from "@/lib/seoMeta";
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Same "no image" detection used everywhere else (isPlaceholderImage): the API
// returns a blank-image.svg CMS placeholder for specializations with no icon.
// <BookOpen /> stays as the fallback icon.
const SpecIcon = ({ item }) => {
    const [iconFailed, setIconFailed] = useState(false);
    const hasValidIcon =
        !iconFailed && typeof item?.icon === "string" && item.icon.trim() && !isPlaceholderImage(item.icon);
    return (
        <div className={styles.specIcon}>
            {hasValidIcon ? (
                <Image
                    src={item.icon}
                    alt={item.name}
                    width={40}
                    height={40}
                    onError={() => setIconFailed(true)}
                />
            ) : (
                <BookOpen aria-hidden="true" />
            )}
        </div>
    );
};

const CoursesBySpecial = () => {
    const t = useTranslations('CoursesBySpecial');
    const locale = useLocale();
    const isRtl = locale === 'ar';
    const { categories, handleGetCategories, isLoading } = useCategoriesStore();
    const [activeTabId, setActiveTabId] = useState(null);
    // Mobile accordion: which category bar is expanded.
    const [expandedId, setExpandedId] = useState(null);
    // Guards the default-open effect below so it only runs once — without
    // this, closing the auto-opened category set expandedId back to null,
    // which the effect would immediately treat as "not opened yet" and
    // force back open, making that one bar impossible to collapse.
    const hasAutoOpened = useRef(false);

    useEffect(() => {
        handleGetCategories();
    }, [])

    useEffect(() => {
        if (categories?.length > 0 && !activeTabId) {
            setActiveTabId(categories[0].id)
        }
    }, [categories, activeTabId])

    // Mobile: open the first category's accordion by default instead of
    // landing on an all-collapsed list.
    useEffect(() => {
        if (categories?.length > 0 && !hasAutoOpened.current) {
            const first = categories.find((cat) => cat?.specializations?.length > 0);
            if (first) {
                hasAutoOpened.current = true;
                setExpandedId(first.id);
            }
        }
    }, [categories])

    const withSpecs = categories?.filter((cat) => cat?.specializations?.length > 0) || [];
    const activeCategory = withSpecs.find((cat) => cat.id === activeTabId) || withSpecs[0];
    const specs = activeCategory?.specializations?.slice(0, 6) || [];

    const ViewAllArrow = isRtl ? ArrowLeft : ArrowRight;

    return (
        <section>
            <div className={styleContainer.container}>
                <Title title={t('title')} span={t('titleSpan')} subtitle={t('subtitle')} />
                {
                    isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <Skeleton type="card" className={styles.skeletonCard} />
                            <Skeleton type="card" className={styles.skeletonCard} />
                        </div>
                    ) : (
                        <>
                        {/* ── Mobile accordion (category bars → sub-specialisations) ── */}
                        <div className={styles.accordion}>
                            {withSpecs.map((cat) => {
                                const isOpen = expandedId === cat.id;
                                return (
                                    <div key={cat.id} className={styles.accordionItem}>
                                        <button
                                            type="button"
                                            className={styles.accordionBar}
                                            aria-expanded={isOpen}
                                            onClick={() => setExpandedId(isOpen ? null : cat.id)}
                                        >
                                            <div className={styles.accordionBarLeft}>
                                                <div className={styles.accordionBarIcon}>
                                                    {cat.specializations.length}
                                                </div>
                                                <span className={styles.accordionBarText}>
                                                    <span className={styles.accordionBarName}>{cat.name}</span>
                                                    <span className={styles.accordionBarCount}>
                                                        {cat.specializations.length} {t('subCategoriesCount')}
                                                    </span>
                                                </span>
                                            </div>
                                            <span className={`${styles.accordionChevron} ${isOpen ? styles.accordionChevronOpen : ''}`}>
                                                <ChevronDown size={16} aria-hidden="true" />
                                            </span>
                                        </button>
                                        {isOpen && (
                                            <>
                                                <div className={styles.accordionSubs}>
                                                    {cat.specializations.map((item) => (
                                                        <Link
                                                            key={item.id}
                                                            href={`/course_training/${item.id}/${encodeURIComponent(item.slug)}`}
                                                            className={styles.accordionSub}
                                                        >
                                                            <SpecIcon item={item} />
                                                            <span className={styles.accordionSubName} title={item.name}>{item.name}</span>
                                                            <span className={styles.accordionSubCount}>
                                                                {item.courses_count} {t('coursesCount')}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                                <Link
                                                    href={`/category/${cat.id}/${encodeURIComponent(cat.slug)}`}
                                                    className={styles.viewAll}
                                                >
                                                    {t('viewAll')} <ViewAllArrow size={16} aria-hidden="true" />
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles.layout}>
                            {/* ── Main specializations (left) ── */}
                            <div className={styles.categoryList} role="tablist" aria-label={t('titleSpan')}>
                                {withSpecs.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={cat.id === activeCategory?.id}
                                        className={`${styles.categoryBtn} ${cat.id === activeCategory?.id ? styles.categoryBtnActive : ''}`}
                                        onClick={() => setActiveTabId(cat.id)}
                                        title={cat.name}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* ── Sub-specializations of the active one (right) ── */}
                            <div className={styles.specsPanel}>
                                <motion.div
                                    key={activeCategory?.id}
                                    className={styles.specsGrid}
                                    initial="hidden"
                                    animate="visible"
                                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
                                >
                                    {specs.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            className={styles.specCard}
                                            variants={{
                                                hidden: { opacity: 0, y: 16 },
                                                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
                                            }}
                                        >
                                            <SpecIcon item={item} />
                                            <h3 className={styles.specName} title={item.name}>{item.name}</h3>
                                            <p className={styles.specCount}>{item.courses_count} {t('coursesCount')}</p>
                                            <Link
                                                href={`/course_training/${item.id}/${encodeURIComponent(item.slug)}`}
                                                className={styles.specBtn}
                                            >
                                                {t('viewCourses')}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {activeCategory && (
                                    <Link
                                        href={`/category/${activeCategory.id}/${encodeURIComponent(activeCategory.slug)}`}
                                        className={styles.viewAll}
                                    >
                                        {t('viewAll')} <ViewAllArrow size={16} aria-hidden="true" />
                                    </Link>
                                )}
                            </div>
                        </div>
                        </>
                    )
                }
            </div>
        </section>
    );
};

export default CoursesBySpecial;
