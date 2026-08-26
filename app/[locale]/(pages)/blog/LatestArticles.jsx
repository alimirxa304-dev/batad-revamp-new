"use client";
import { ArrowRight } from "lucide-react";
import LatestArticlesCard from "./LatestArticlesCard";
import styles from "@/sass/pages/blog/latest-articles.module.scss";
import { useTranslations } from "next-intl";

const LatestArticles = ({ view, posts, visibleCount, handleViewMore }) => {
    const t = useTranslations('Blog');
    return (
        <div className={styles.latestArticles}>
            <h2>{t('latestArticles')}</h2>
            <div className={`${styles.cards} ${styles[view]}`}>
                {posts?.posts?.slice(0, visibleCount).map((article) => (
                    <LatestArticlesCard key={article.id} article={article} view={view} />
                ))}
            </div>
            {(visibleCount < posts?.posts?.length || posts?.has_more) && (
                <button className={styles.viewMore} onClick={handleViewMore}>
                    {t('viewMore')} <ArrowRight />
                </button>
            )}
        </div>
    );
};

export default LatestArticles;
