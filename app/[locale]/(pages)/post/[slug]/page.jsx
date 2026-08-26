import { getPostBySlug } from "@/action/posts";
import AlternatePathsSetter from "@/components/common/AlternatePathsSetter";
import {
  SITE_URL,
  cleanMeta,
  cleanJsonLd,
  toIsoDate,
  buildAlternates,
  resolveOgImage,
  safeDecodeSlug,
  safeJsonLdString,
  resolveContentImageUrl,
  buildOrganizationNode,
  buildWebsiteNode,
  buildBreadcrumbSchema,
} from "@/lib/seoMeta";
import styleContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/blog/blog-details.module.scss";
import ArticleParts from "./ArticleParts";
import Header from "./Header";
import MainContent from "./MainContent";

// Same reused fallback as city/category/course_training/course_details — a real,
// existing asset, not a post-specific photo that would be wrong for every other post.
const FALLBACK_POST_IMAGE_PATH = "/asstes/details.jpg";

// Same shape as city/[id]/[slug]'s graph — WebSite/Organization/BreadcrumbList are
// shared helpers from lib/seoMeta.js, nothing duplicated here. BlogPosting is new
// (single-article schema, not an ItemList).
function buildPostGraph({ post, locale, routeSlug, siteUrl }) {
  const postSlug = safeDecodeSlug(routeSlug) || (locale === "ar" ? post.slug_ar : post.slug_en);
  if (!post?.name || !postSlug) return null;

  const postUrl = `${siteUrl}/${locale}/post/${encodeURIComponent(postSlug)}`;
  const organizationId = `${siteUrl}#organization`;
  const websiteId = `${siteUrl}#website`;
  const primaryImageId = `${postUrl}#primaryimage`;

  const website = buildWebsiteNode(siteUrl);
  const organization = buildOrganizationNode(siteUrl);

  const imageUrl = resolveContentImageUrl(post.image, siteUrl, FALLBACK_POST_IMAGE_PATH);
  const image = {
    "@type": "ImageObject",
    "@id": primaryImageId,
    url: imageUrl,
    contentUrl: imageUrl,
  };

  const description = cleanMeta(post.meta?.description) || post.description;

  // publish_date_raw is the only real, parseable date field the API returns (e.g.
  // "March 3, 2026" on the single-post endpoint, "2026-03-03" on the list endpoint) —
  // publish_date itself is a relative string ("4 months ago"), not machine-readable.
  // No updated_at/modified field exists anywhere on a post, verified against the live
  // API — dateModified is intentionally omitted rather than invented.
  const datePublished = toIsoDate(post.publish_date_raw);

  // author is a real, separate API field (post.author.name) distinct from the site's
  // own Organization — falls back to Organization only in the unlikely case a post
  // has no author at all, never fabricating a person.
  const author = post.author?.name
    ? { "@type": "Person", name: post.author.name }
    : { "@id": organizationId };

  const blogPosting = {
    "@type": "BlogPosting",
    "@id": `${postUrl}#article`,
    headline: post.name,
    description,
    url: postUrl,
    inLanguage: locale,
    image: { "@id": primaryImageId },
    author,
    publisher: { "@id": organizationId },
    datePublished,
    mainEntityOfPage: { "@id": `${postUrl}#webpage` },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${postUrl}#webpage`,
    url: postUrl,
    name: post.name,
    isPartOf: { "@id": websiteId },
    primaryImageOfPage: { "@id": primaryImageId },
    breadcrumb: { "@id": `${postUrl}#breadcrumb` },
    inLanguage: locale,
  };

  const breadcrumb = buildBreadcrumbSchema(
    [
      { name: locale === "ar" ? "الرئيسية" : "Home", url: `${siteUrl}/${locale}` },
      { name: locale === "ar" ? "المدونة" : "Blog", url: `${siteUrl}/${locale}/blog` },
      { name: post.name, url: postUrl },
    ],
    postUrl
  );

  const graph = cleanJsonLd([website, organization, image, webPage, breadcrumb, blogPosting]);
  if (!graph) return null;

  return { "@context": "https://schema.org", "@graph": graph };
}

export async function generateMetadata({ params }) {
  const { locale, slug } = await params;

  const niceName = slug
    ? decodeURIComponent(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Article";

  const fallback = {
    metadataBase: new URL(SITE_URL),
    title: `${niceName} `,
    description: `Read this article from the British Academy for Training & Development blog.`,
  };

  try {
    const response = await getPostBySlug(locale, slug);
    const res = response?.data;
    if (!res) {
      const defaultImages = [
        { url: "/og-image.png", width: 1200, height: 630, alt: fallback.title },
      ];
      return {
        ...fallback,
        openGraph: { ...fallback, type: "article", images: defaultImages },
        twitter: {
          card: "summary_large_image",
          ...fallback,
          images: defaultImages,
        },
      };
    }

    const meta = res.meta || {};
    const title = meta.title || res.name || fallback.title;
    const description =
      meta.description?.replace(/<[^>]*>?/gm, "") ||
      res.description ||
      fallback.description;

    let keywords = meta.keyword;
    if (keywords && typeof keywords === "string" && keywords.startsWith("[")) {
      try {
        const parsed = JSON.parse(keywords);
        keywords = parsed.map((k) => k.value).join(", ");
      } catch (e) {
        console.error("Error parsing keywords:", e);
      }
    }

    const ogImage = resolveOgImage(res?.image);

    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      keywords: keywords || undefined,
      alternates: {
        canonical: `/${locale}/post/${slug}`,
        ...buildAlternates({
          en: `/post/${res.slug_en || slug}`,
          ar: `/post/${res.slug_ar || slug}`,
        }),
      },

      openGraph: {
        title,
        description,
        type: "article",

        ...(ogImage
          ? { images: [ogImage] }
          : {
              images: [
                {
                  url: "/og-image.png",
                  width: 1200,
                  height: 630,
                  alt: title,
                },
              ],
            }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(ogImage
          ? { images: [ogImage] }
          : {
              images: [
                {
                  url: "/og-image.png",
                  width: 1200,
                  height: 630,
                  alt: title,
                },
              ],
            }),
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    const defaultImages = [
      { url: "/og-image.png", width: 1200, height: 630, alt: fallback.title },
    ];
    return {
      ...fallback,
      openGraph: { ...fallback, type: "article", images: defaultImages },
      twitter: {
        card: "summary_large_image",
        ...fallback,
        images: defaultImages,
      },
    };
  }
}

export default async function BlogDetailsPage({ params }) {
  const { locale, id, slug } = await params;
  let blogData = {};
  try {
    const res = await getPostBySlug(locale, slug);
    blogData = res?.data || {};
  } catch (error) {
    console.error("Failed to fetch course details:", error);
  }

  const postSchema = blogData?.name
    ? buildPostGraph({ post: blogData, locale, routeSlug: slug, siteUrl: SITE_URL })
    : null;

  return (
    <>
      {postSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(postSchema) }}
        />
      )}
      {blogData?.slug_en && blogData?.slug_ar && (
        <AlternatePathsSetter
          enPath={`/post/${blogData.slug_en}`}
          arPath={`/post/${blogData.slug_ar}`}
        />
      )}
      <div className={styles.blogDetailsPage}>
        <Header post={blogData} />
        <div className={styleContainer.container}>
          <div className={styles.content}>
            <ArticleParts post={blogData} />
            <MainContent post={blogData} />
          </div>
        </div>
      </div>
    </>
  );
}
