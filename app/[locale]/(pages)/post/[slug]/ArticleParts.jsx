"use client";

import React, { useState } from "react";
import { BookOpen, ChevronRight } from "lucide-react";
import styles from "@/sass/pages/blog/article-parts.module.scss";
import Skeleton from "@/components/ui/Skeleton";
import NoData from "@/components/common/NoData";
import { useTranslations } from "next-intl";

const ArticleParts = ({ post }) => {
  const t = useTranslations('Blog');
  const [activeId, setActiveId] = useState(null);

  const tableOfContents = post?.table_of_contents || [];
  const readTime = post?.read_time;

  const handleScrollToTitle = (title, index) => {
    setActiveId(index);
    // Find all headings
    const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));

    // Find the heading that matches the title
    const targetHeading = headings.find(el => {
      const headingText = el.textContent.trim();
      const titleText = title.trim();
      // Match if the heading text contains the title text or vice versa 
      // (some titles might be truncated in the backend)
      if (!headingText || !titleText) return false;
      return headingText.includes(titleText) || titleText.includes(headingText);
    });

    if (targetHeading) {
      // Calculate top offset, considering fixed header height (approx 100px)
      const y = targetHeading.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Assuming level starts from 2 or 3 usually, we normalize it to calculate left margin.
  // We can find the minimum level to use as base.
  // if tableOfContents is empty, minLevel might be Infinity, so handle it safely.
  const minLevel = tableOfContents.length > 0 ? Math.min(...tableOfContents.map(item => item.level)) : 0;

  // if (tableOfContents.length === 0) return null;

  return (
    <div className={styles.tocContainer}>
      <header className={styles.header}>
        <BookOpen size={20} strokeWidth={2.5} className={styles.headerIcon} />
        <h3 className={styles.headerTitle}>{t('inThisArticle')}</h3>
      </header>

      {tableOfContents && tableOfContents.length > 0 ? (
        <>
          <div className={styles.divider} />

          <nav className={styles.nav}>
            {tableOfContents.map((item, index) => {
              // Calculate indentation based on heading level relative to minimum level
              const marginLeft = Math.max(0, (item.level - minLevel)) * 12;

              return (
                <div key={index} className={styles.itemGroup}>
                  <button
                    onClick={() => handleScrollToTitle(item.title, index)}
                    className={`${styles.navItem} ${activeId === index ? styles.active : ""}`}
                    style={{ paddingLeft: `${marginLeft}px` }}
                  >
                    <span className={styles.chevron}>
                      <ChevronRight size={16} />
                    </span>
                    <span className={styles.title}>{item.title}</span>
                  </button>
                </div>
              );
            })}
          </nav>

          {readTime && (
            <>
              <div className={styles.footerDivider} />
              <footer className={styles.footer}>
                <span className={styles.readingTime}>{readTime} {t('minRead')}</span>
              </footer>
            </>
          )}
        </>
      ) : (
       <NoData message={t('noHeadings')} />
      )}
    </div>
  );

};

export default ArticleParts;
