"use client";
import styles from "@/sass/pages/blog/featured-article.module.scss";
import {
  ArrowRight,
  Calendar,
  ClipboardPlus,
  Clock,
  Eye,
  Heart,
  Share2,
  Star,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

// Temporary placeholder images
const placeholderImages = [
  "https://placehold.co/600x400/png?text=Image+1",
  "https://placehold.co/600x400/png?text=Image+2",
  "https://placehold.co/600x400/png?text=Image+3",
];

const FeaturedArticle = ({ postFeatured }) => {
  const t = useTranslations('Blog');
  const randomImageIndex = postFeatured?.id
    ? postFeatured.id % 3
    : Math.floor(Math.random() * 3);
  const randomImage = placeholderImages[randomImageIndex];

  return (
    <section className={styles.featuredArticle}>
      <h2>
        {" "}
        <Star fill="#C41E3A" size={18} color="#C41E3A" /> {t('featuredArticle')}
      </h2>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.image}>
            <Image
              src={randomImage}
              alt={postFeatured?.name || "Featured article"}
              fill
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>{" "}
          <span>
            {" "}
            <TrendingUp fill="#00C950" size={12} color="#00C950" /> {t('trending')}
          </span>
        </div>
        <div className={styles.right}>
          <span className={styles.featured}>
            <Star fill="#fff" size={18} color="#fff" /> {t('featured')}
          </span>
          <div className={styles.articleContent}>
            <div className={styles.articleInfo}>
              <div className={styles.articleType}>
                <span className={styles.type}>
                  {postFeatured?.category?.name}
                </span>
                <div className={styles.date}>
                  <span>
                    {" "}
                    <Calendar color="#6B7280" size={14} />
                    {postFeatured?.publish_date_raw}
                  </span>
                  <span>
                    {" "}
                    <Clock color="#6B7280" size={14} />
                    {postFeatured?.reading_time}
                  </span>
                </div>
              </div>
              <h2>{postFeatured?.name}</h2>
              <p>{postFeatured?.description}</p>
            </div>

            <div className={styles.articleAuthor}>
              <div className={styles.author}>
                <h3>{postFeatured?.author_name}</h3>
                <span>{t('author')}</span>
              </div>
              <div className={styles.articleReaction}>
                <span>
                  {" "}
                  <Eye color="#6B7280" size={14} />{" "}
                  {postFeatured?.total_views_formatted}
                </span>
                <span>
                  {" "}
                  <Heart color="#6B7280" size={14} /> 200
                </span>
                <span>
                  {" "}
                  <Star color="#C41E3A" fill="#C41E3A" size={14} /> 100
                </span>
              </div>
            </div>

            <div className={styles.articleActions}>
              <button>
                {t('readArticle')} <ArrowRight size={18} color="#fff" />
              </button>

              <div className={styles.icons}>
                <span>
                  <ClipboardPlus color="#364153" size={18} />
                </span>
                <span>
                  <Share2 color="#364153" size={18} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticle;
