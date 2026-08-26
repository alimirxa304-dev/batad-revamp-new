"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Clock, Eye, Heart, User } from "lucide-react";
import styles from "@/sass/pages/blog/blog-details.module.scss";
import useLanguageStore from "@/store/useLanguageStore";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
const SOCIAL_LINKS = [
  {
    id: "x",
    label: "Share on X",
    svg: (
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_344_11274)">
          <path
            d="M15.7349 2.85961C15.7349 2.85961 15.2342 4.36155 14.3044 5.29132C15.4488 12.4434 7.58147 17.6645 1.43066 13.5878C3.00413 13.6593 4.57759 13.1586 5.72192 12.1573C2.14587 11.0845 0.357849 6.86478 2.14587 3.57482C3.71934 5.43436 6.15105 6.50718 8.58277 6.43566C7.93908 3.43178 11.4436 1.71527 13.5892 3.71786C14.376 3.71786 15.7349 2.85961 15.7349 2.85961Z"
            stroke="white"
            strokeWidth="1.43042"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_344_11274">
            <rect width="17.165" height="17.165" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
  },
  {
    id: "facebook",
    label: "Share on Facebook",
    svg: (
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.8732 1.42969H10.7275C9.77911 1.42969 8.86953 1.80645 8.19889 2.47709C7.52825 3.14773 7.15149 4.05731 7.15149 5.00574V7.15137H5.00586V10.0122H7.15149V15.7339H10.0123V10.0122H12.158L12.8732 7.15137H10.0123V5.00574C10.0123 4.81605 10.0877 4.63414 10.2218 4.50001C10.3559 4.36588 10.5379 4.29053 10.7275 4.29053H12.8732V1.42969Z"
          stroke="white"
          strokeWidth="1.43042"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "print",
    label: "Print",
    svg: (
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.00586 5.71973V1.42969H12.8732V5.71973"
          stroke="white"
          strokeWidth="1.43042"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5.00586 12.8735H2.86084C2.48142 12.8735 2.11763 12.7228 1.84937 12.4545C1.58112 12.1863 1.43042 11.8225 1.43042 11.4431V7.86987C1.43042 7.49045 1.58112 7.12665 1.84937 6.8584C2.11763 6.59014 2.48142 6.43945 2.86084 6.43945H15.0182C15.3977 6.43945 15.7614 6.59014 16.0297 6.8584C16.298 7.12665 16.4487 7.49045 16.4487 7.86987V11.4431C16.4487 11.8225 16.298 12.1863 16.0297 12.4545C15.7614 12.7228 15.3977 12.8735 15.0182 12.8735H12.8732"
          stroke="white"
          strokeWidth="1.43042"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.8732 9.29785H5.00586V16.4501H12.8732V9.29785Z"
          stroke="white"
          strokeWidth="1.43042"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const LARAVEL_SITE_URL = "https://batdacademy.com";
const Header = ({ post }) => {
  const t = useTranslations('Blog');
  const locale = useLanguageStore((state) => state.locale);
  // useLanguageStore's locale only syncs to the real route locale after client-side
  // hydration (it defaults to 'en'), so it renders wrong on first paint for /ar pages —
  // fine for the print handler below (only runs after a user interaction, well after
  // hydration), but not for the "back to blog" link that needs to be correct on first paint.
  const { locale: urlLocale } = useParams();

  const handleSocialClick = (id) => {
    if (id === "facebook") {
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    } else if (id === "x") {
      // URL-only: X unfurls title/description/image itself from the page's own
      // meta tags, so passing a duplicate `text` would just show redundant text
      // above the card instead of a clean link preview.
      const shareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`;
      window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=400");
    } else if (id === "print") {
      // Served by the Laravel site (not part of this Next.js app), so it can't
      // be built from NEXT_PUBLIC_SITE_URL — that resolves to localhost in dev,
      // where this route doesn't exist.
      const printUrl = `${LARAVEL_SITE_URL}/${locale}/post/print/${post?.id}`;
      window.open(printUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.back}>
            <Link href={`/${urlLocale}/blog`}>
              <ArrowLeft size={20} color="#FFFFFFCC" aria-hidden="true" />
              {t('backToBlog')}
            </Link>
          </div>
          <div className={styles.contentItem}>
            {(post?.category?.name || post?.is_featured) && (
              <div className={styles.type}>
                {post?.category?.name && <span>{post?.category?.name}</span>}
                {post?.is_featured && (
                  <span className={styles.featured}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      aria-label={"Featured Article"}
                    >
                      <path
                        d="M8.39034 1.72401C8.14035 1.47394 7.80127 1.33342 7.44767 1.33334H2.66634C2.31272 1.33334 1.97358 1.47382 1.72353 1.72387C1.47348 1.97392 1.33301 2.31305 1.33301 2.66668V7.44801C1.33308 7.8016 1.47361 8.14069 1.72367 8.39068L7.52634 14.1933C7.82935 14.4944 8.23917 14.6634 8.66634 14.6634C9.09351 14.6634 9.50333 14.4944 9.80634 14.1933L14.193 9.80668C14.4941 9.50367 14.6631 9.09385 14.6631 8.66668C14.6631 8.23951 14.4941 7.82969 14.193 7.52668L8.39034 1.72401Z"
                        stroke="white"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.00033 5.33332C5.18442 5.33332 5.33366 5.18408 5.33366 4.99999C5.33366 4.81589 5.18442 4.66666 5.00033 4.66666C4.81623 4.66666 4.66699 4.81589 4.66699 4.99999C4.66699 5.18408 4.81623 5.33332 5.00033 5.33332Z"
                        fill="white"
                        stroke="white"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t('featured')}
                  </span>
                )}
              </div>
            )}
            <h2>{post?.name}</h2>
            <div className={styles.media}>
              <div className={styles.reactions}>
                <div className={styles.reaction}>
                  <Calendar size={20} />
                  <span>{post?.publish_date_raw}</span>
                </div>
                <div className={styles.reaction}>
                  <Clock size={20} />
                  <span> {post?.read_time} {t('minRead')} </span>
                </div>
                <div className={styles.reaction}>
                  <Eye size={20} />
                  <span>2.3k {t('views')}</span>
                </div>
                <div className={styles.reaction}>
                  <Heart size={20} />
                  <span>150 {t('likes')}</span>
                </div>
              </div>
              <div className={styles.social}>
                {SOCIAL_LINKS.map((item) => (
                  <Link
                    key={item.id}
                    href="#"
                    aria-label={item.label}
                    onClick={(e) => {
                      e.preventDefault();
                      handleSocialClick(item.id);
                    }}
                  >
                    {item.svg}
                  </Link>
                ))}
              </div>
            </div>

            {post?.user ? (
              <div className={styles.author}>
                <div className={styles.avatar}>
                  {post?.user?.image ? (
                    <Image
                      src={post?.user?.image}
                      alt={post?.user?.name || "Author"}
                      width={50}
                      height={50}
                    />
                  ) : post?.user?.name ? (
                    <div>{post?.user?.name?.charAt(0).toUpperCase()}</div>
                  ) : (
                    <User size={40} color="white" strokeWidth={1} />
                  )}
                </div>
                <div className={styles.authorInfo}>
                  <h3>{post?.user?.name}</h3>
                  <p>{t('author')}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
