"use client";
/**
 * HeroVisual — reusable floating-cards visual block
 *
 * Props
 * ─────
 * config {object} — override any of the four data sections:
 *   mainImage     { src, alt }
 *   coursesCard   { number, label }
 *   certifiedCard { image, alt, text }
 *   teamCard      { title, members[], moreText }
 *
 * Usage
 * ─────
 * import HeroVisual from "@/components/ui/HeroVisual";
 * <HeroVisual config={myConfig} />
 */

import { motion } from "framer-motion";
import Image from "next/image";
import { BookOpen, Users, BadgeCheck } from "lucide-react";
import styles from "@/sass/components/ui/hero-visual.module.scss";

// ── Default content (override via `config` prop) ───────────
const DEFAULT_CONFIG = {
  mainImage: {
    src: "/asstes/heroImage.jpeg",
    alt: "Student learning online",
  },
  coursesCard: {
    number: "600+",
    label:  "Premium Courses",
  },
  certifiedCard: {
    image: "/asstes/expert.jpg",
    alt:   "Certified program",
    text:  "Certified Programs",
  },
  teamCard: {
    title:    "Our Specialized Team",
    members:  ["S", "M", "E", "J"],
    moreText: "+500",
  },
};

// ── Framer Motion helpers ───────────────────────────────────
const fadeSlide = (delay = 0, x = 0, y = 0) => ({
  initial: { opacity: 0, x, y },
  animate: {
    opacity: 1, x: 0, y: 0,
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
  },
});

export default function HeroVisual({ config = {} }) {
  console.log(config , 'config')
  // Shallow merge so callers can override individual sections
  const cfg = {
    mainImage:     { ...DEFAULT_CONFIG.mainImage,     ...config.mainImage },
    coursesCard:   { ...DEFAULT_CONFIG.coursesCard,   ...config.coursesCard },
    certifiedCard: { ...DEFAULT_CONFIG.certifiedCard, ...config.certifiedCard },
    teamCard:      { ...DEFAULT_CONFIG.teamCard,      ...config.teamCard },
  };

  const { mainImage, coursesCard, certifiedCard, teamCard } = cfg;


  return (
    <div className={styles.wrapper}>

      {/* ── Decorative radial glows ── */}
      <div className={styles.glowTL} aria-hidden="true" />
      <div className={styles.glowBR} aria-hidden="true" />

      {/* ── 1. Main image ── */}
      <div className={styles.mainImg}>
        <Image
          src={mainImage?.src?.heroImage?.src}
          alt={mainImage.alt}
          fill
          sizes="(max-width: 480px) 90vw, (max-width: 768px) 75vw, 45vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>

      {/* ── 2. Courses stats card — top-right ── */}
      <motion.article
        className={`${styles.card} ${styles.cardCourses}`}
        aria-label={`${coursesCard.number} ${coursesCard.label}`}
        {...fadeSlide(0.4, 20, -12)}
      >
        <div className={styles.iconBox} aria-hidden="true">
          <BookOpen size={22} strokeWidth={2} />
        </div>
        <div className={styles.cardBody}>
          <strong className={styles.cardNumber}>{coursesCard.number}</strong>
          <span className={styles.cardLabel}>{coursesCard.label}</span>
        </div>
      </motion.article>

      {/* ── 3. Certified image card — bottom-right ── */}
      {certifiedCard.image && (
        <motion.div
          className={`${styles.card} ${styles.cardCertified}`}
          {...fadeSlide(0.56, 20, 0)}
        >
          <div className={styles.certImgWrap}>
            <Image
              src={certifiedCard.image}
              alt={certifiedCard.alt}
              fill
              sizes="(max-width: 480px) 144px, 180px"
              style={{ objectFit: "cover" }}
            />
            <div className={styles.certBadge}>
              <BadgeCheck
                size={14}
                strokeWidth={2.5}
                className={styles.certIcon}
                aria-hidden="true"
              />
              <span>{certifiedCard.text}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 4. Team card — bottom-left ── */}
      <motion.article
        className={`${styles.card} ${styles.cardTeam}`}
        {...fadeSlide(0.48, -20, 12)}
      >
        <div className={styles.iconBox} aria-hidden="true">
          <Users size={20} strokeWidth={2} />
        </div>
        <div className={styles.cardBody}>
          <span className={styles.cardTitle}>{teamCard.title}</span>
          <div className={styles.members} role="list" aria-label="Team members">
            {teamCard.members?.map((initial, i) => (
              <span
                key={i}
                className={styles.avatar}
                role="listitem"
                title={`Member ${initial}`}
              >
                {initial}
              </span>
            ))}
            {teamCard.moreText && (
              <span
                className={`${styles.avatar} ${styles.avatarMore}`}
                aria-label={`and ${teamCard.moreText} more`}
              >
                {teamCard.moreText}
              </span>
            )}
          </div>
        </div>
      </motion.article>

    </div>
  );
}
