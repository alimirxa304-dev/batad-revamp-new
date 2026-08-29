'use client';
import { motion } from 'framer-motion';

import stylesConteiner from '@/sass/components/common/container.module.scss';
import styles from '@/sass/pages/home/hero.module.scss';
import {
    ChevronLeft,
    ChevronRight,
    GraduationCap,
    Landmark,
    Search,
    Star,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import heroImage from "@/public/asstes/heroup.jpeg"
import { useRouter } from 'next/navigation';
import useSearchAutocomplete from '@/hooks/useSearchAutocomplete';
import { useEffect, useRef, useState } from 'react';
import SearchSuggestions from '@/components/ui/SearchSuggestions';

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['600', '700', '800'],
    variable: '--font-heading',
});

export default function Hero() {
    const t = useTranslations('Hero');
    const locale = useLocale();
    const isRtl = locale === 'ar';
    const router = useRouter();

    const { query, setQuery, suggestions, isLoading, clearSuggestions } = useSearchAutocomplete();
    const showDropdown = query.length >= 2 && suggestions.length > 0;

    const statsTrackRef = useRef(null);
    const linksTrackRef = useRef(null);
    // Which end of each horizontal track is currently reachable — drives
    // hiding the prev/next arrow once there's nothing left in that direction.
    const [linksEdges, setLinksEdges] = useState({ atStart: true, atEnd: false });
    const [statsEdges, setStatsEdges] = useState({ atStart: true, atEnd: false });

    const quickLinks = [
        { label: t('links.upcoming'), href: `/${locale}/search_course` },
        { label: t('links.cities'), href: `/${locale}/show_cities` },
        { label: t('links.consulting'), href: `/${locale}/consulting` },
        { label: t('links.blog'), href: `/${locale}/blog` },
        { label: t('links.contact'), href: `/${locale}/contact_us` },
    ];

    const stats = [
        {
            icon: <GraduationCap aria-hidden="true" />,
            title: t('statsBar.courses.title'),
            text: t('statsBar.courses.text'),
        },
        {
            icon: <Star aria-hidden="true" />,
            title: t('statsBar.alumni.title'),
            text: t('statsBar.alumni.text'),
        },
        {
            icon: <Landmark aria-hidden="true" />,
            title: t('statsBar.clients.title'),
            text: t('statsBar.clients.text'),
        },
    ];

    // User clicks a suggestion
    const handleSelect = (course) => {
        setQuery(course.name);
        clearSuggestions();
        router.push(`/${locale}/search_course?search=${encodeURIComponent(course.name)}`);
    };

    // User clicks Search button or presses Enter
    const handleSearch = () => {
        if (!query.trim()) return;
        clearSuggestions();
        router.push(`/${locale}/search_course?search=${encodeURIComponent(query)}`);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(`.${styles.searchBar}`)) {
                clearSuggestions();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scrolls a horizontal track one "page"; direction is flipped in RTL so the
    // visual arrows always move content the way they point.
    const scrollTrack = (ref, dir, ratio = 1) => {
        const el = ref.current;
        if (!el) return;
        el.scrollBy({
            left: dir * (isRtl ? -1 : 1) * el.clientWidth * ratio,
            behavior: 'smooth',
        });
    };

    // Whether a track's first/last child is currently visible within its own
    // viewport — i.e. whether there's anything left to scroll to on that side.
    // Compares actual bounding boxes rather than scrollLeft, since scrollLeft's
    // sign convention in RTL differs across browsers and is easy to get wrong.
    // In RTL the browser lays the DOM-first child out on the *right* (flex-
    // direction: row still follows DOM order, but the start edge flips), so
    // which side counts as "start" vs "end" has to flip too.
    const measureEdges = (ref) => {
        const el = ref.current;
        if (!el || !el.children.length) return { atStart: true, atEnd: true };
        const trackRect = el.getBoundingClientRect();
        const first = el.children[0].getBoundingClientRect();
        const last = el.children[el.children.length - 1].getBoundingClientRect();
        return isRtl
            ? {
                atStart: first.right <= trackRect.right + 1,
                atEnd: last.left >= trackRect.left - 1,
            }
            : {
                atStart: first.left >= trackRect.left - 1,
                atEnd: last.right <= trackRect.right + 1,
            };
    };

    useEffect(() => {
        const linksEl = linksTrackRef.current;
        const statsEl = statsTrackRef.current;
        const onLinksScroll = () => setLinksEdges(measureEdges(linksTrackRef));
        const onStatsScroll = () => setStatsEdges(measureEdges(statsTrackRef));

        onLinksScroll();
        onStatsScroll();

        linksEl?.addEventListener('scroll', onLinksScroll, { passive: true });
        statsEl?.addEventListener('scroll', onStatsScroll, { passive: true });
        window.addEventListener('resize', onLinksScroll);
        window.addEventListener('resize', onStatsScroll);
        return () => {
            linksEl?.removeEventListener('scroll', onLinksScroll);
            statsEl?.removeEventListener('scroll', onStatsScroll);
            window.removeEventListener('resize', onLinksScroll);
            window.removeEventListener('resize', onStatsScroll);
        };
    }, []);

    const NextIcon = isRtl ? ChevronLeft : ChevronRight;
    const PrevIcon = isRtl ? ChevronRight : ChevronLeft;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
    };

    return (
        // Single wrapper so the page-level flex gap doesn't split the hero from
        // its stats strip.
        <div>
            <section className={`${styles.hero} ${plusJakarta.variable}`}>
                <div className={styles.bgPattern} aria-hidden="true" />
                <div className={stylesConteiner.container}>
                    <motion.div
                        className={styles.content}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* ── LEFT ── */}
                        <div className={styles.left}>
                            <motion.h1 className={styles.title} variants={itemVariants}>
                                {t.rich('headline', {
                                    highlight: (chunks) => <span>{chunks}</span>,
                                })}
                            </motion.h1>

                            <motion.p className={styles.tagline} variants={itemVariants}>
                                {t.rich('tagline', {
                                    highlight: (chunks) => <span>{chunks}</span>,
                                })}
                            </motion.p>

                            <motion.div className={styles.searchPanel} variants={itemVariants}>
                                <div className={styles.searchRow}>
                                    <div className={`${styles.searchBar}`}>
                                        <span className={styles.searchIcon}>
                                            <Search size={16} />
                                        </span>
                                        <input
                                            type="text"
                                            placeholder={t('searchPlaceholder')}
                                            className={styles.searchInput}
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <SearchSuggestions
                                            suggestions={suggestions}
                                            isLoading={isLoading}
                                            onSelect={handleSelect}
                                            visible={showDropdown}
                                        />
                                    </div>
                                    <button className={styles.btnSearch} onClick={handleSearch}>
                                        <span className={styles.btnSearchLabel}>{t('searchCourses')}</span>
                                        <Search className={styles.btnSearchIcon} size={20} aria-hidden="true" />
                                    </button>
                                </div>

                                <div className={styles.quickLinks}>
                                    {!linksEdges.atStart && (
                                        <button
                                            type="button"
                                            className={styles.quickChevron}
                                            aria-label="previous"
                                            onClick={() => scrollTrack(linksTrackRef, -1, 0.6)}
                                        >
                                            <PrevIcon size={18} />
                                        </button>
                                    )}
                                    <div className={styles.quickLinksTrack} ref={linksTrackRef}>
                                        {quickLinks.map((link) => (
                                            <Link key={link.href} href={link.href} className={styles.quickLink}>
                                                {link.label}
                                            </Link>
                                        ))}
                                    </div>
                                    {!linksEdges.atEnd && (
                                        <button
                                            type="button"
                                            className={styles.quickChevron}
                                            aria-label="next"
                                            onClick={() => scrollTrack(linksTrackRef, 1, 0.6)}
                                        >
                                            <NextIcon size={18} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* ── RIGHT — person visual ── */}
                        <motion.div
                            className={styles.right}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                        >
                            <div className={styles.personWrap}>
                                <Image
                                    src={heroImage}
                                    alt={t('statsBar.alumni.title')}
                                    fill
                                    priority
                                    sizes="(max-width: 768px) 200px, 420px"
                                    className={styles.personImage}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section className={styles.statsStrip}>
                <div className={stylesConteiner.container}>
                    <div className={styles.statsInner}>
                        {!statsEdges.atStart && (
                            <button
                                type="button"
                                className={styles.statsArrow}
                                aria-label="previous"
                                onClick={() => scrollTrack(statsTrackRef, -1)}
                            >
                                <PrevIcon size={22} />
                            </button>
                        )}
                        <div className={styles.statsTrack} ref={statsTrackRef}>
                            {stats.map((stat, i) => (
                                <div key={i} className={styles.statItem}>
                                    <span className={styles.statIcon}>{stat.icon}</span>
                                    <span className={styles.statContent}>
                                        <strong className={styles.statTitle}>{stat.title}</strong>
                                        <span className={styles.statText}>{stat.text}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                        {!statsEdges.atEnd && (
                            <button
                                type="button"
                                className={styles.statsArrow}
                                aria-label="next"
                                onClick={() => scrollTrack(statsTrackRef, 1)}
                            >
                                <NextIcon size={22} />
                            </button>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
