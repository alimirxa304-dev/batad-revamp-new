"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "@/sass/pages/blog/lastest-articles-card.module.scss";
import { ArrowRight, Clock, Eye, Heart } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import img1 from "/public/asstes/default-1.jpeg";
import img2 from "/public/asstes/course1.jpg";
import img3 from "/public/asstes/default-2.webp";

const placeholderImages = [
  "https://batdacademy.com/uploads/placeholder_image.webp",
  img2,
  img1,
  img3,
];
const LatestArticlesCard = ({ article, view }) => {
  const t = useTranslations('Blog');
  const { locale } = useParams();
  const randomImageIndex = article?.id
    ? article.id % 3
    : Math.floor(Math.random() * 3);
  const randomImage = placeholderImages[randomImageIndex];

  return (
    <motion.div
      className={`${styles.card} ${styles[view]}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -10,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className={styles.image}>
        <Image
          alt={article?.name || "Post thumbnail"}
          width={100}
          height={100}
          src={article?.image || randomImage}
          style={{ objectFit: "cover", borderRadius: "8px" }}
        />
      </div>
      <div className={styles.content}>
        <div className={styles.articleInfo}>
          <div className={styles.articleType}>
            <div className={styles.type}>{article?.category?.name}</div>
            <div className={styles.date}>
              <Clock color="#6A7282" size={14} />
              <span> {article.publish_date}</span>
            </div>
          </div>
          <h2>{article?.name}</h2>
          <p>{article?.description}</p>
        </div>

        <div className={styles.articleAuthor}>
          <div className={styles.author}>
            <h3>{article?.author_name}</h3>
            <span>{t('author')}</span>
          </div>
          <div className={styles.articleReaction}>
            <span>
              {" "}
              <Eye color="#6B7280" size={14} /> 2.4k
            </span>
            <span>
              {" "}
              <Heart color="#6B7280" size={14} /> 200
            </span>
          </div>
        </div>

        <Link
          className={styles.readMore}
          href={`/${locale}/post/${encodeURIComponent(article.slug)}`}
        >
          {t('readMore')}
          <span className="sr-only"> about {article?.name}</span>
          <ArrowRight size={14} color="#fff" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
};

export default LatestArticlesCard;
