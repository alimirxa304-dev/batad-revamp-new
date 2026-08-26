import Blog from "../../Blog";
import { getPosts } from "@/action/posts";
import { SITE_URL, buildAlternates } from "@/lib/seoMeta";

// Resolves the real category name/slug for this id from the `categories` sidebar
// array already embedded in every /posts response (id, slug, name, posts_count) —
// mirrors the same lookup-by-id pattern already used in search_course/page.jsx's
// buildDynamicTitle, so this never needs a dedicated "get post category by id"
// endpoint that doesn't exist.
function resolveCategory(postsData, id) {
    return postsData?.categories?.find((c) => String(c.id) === String(id));
}

export async function generateMetadata({ params }) {
    const { locale, id, slug } = await params;
    const fallbackName = slug
        ? decodeURIComponent(slug).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        : "Category";

    const otherLocale = locale === "en" ? "ar" : "en";

    let categoryName = fallbackName;
    let postCount = 0;
    let enSlug = slug;
    let arSlug = slug;
    try {
        const [res, otherRes] = await Promise.all([
            getPosts(locale, `?category_id=${id}`),
            getPosts(otherLocale, `?category_id=${id}`),
        ]);
        const data = res?.data;
        const category = resolveCategory(data, id);
        categoryName = category?.name || fallbackName;
        postCount = data?.posts?.length || 0;

        const otherCategory = resolveCategory(otherRes?.data, id);
        enSlug = (locale === "en" ? category?.slug : otherCategory?.slug) || slug;
        arSlug = (locale === "ar" ? category?.slug : otherCategory?.slug) || slug;
    } catch (error) {
        console.error("Blog category metadata error:", error);
    }

    const title = `${categoryName} — British Academy for Training & Development`;
    const description = `Browse blog posts in the ${categoryName} category from the British Academy for Training & Development.`;

    return {
        metadataBase: new URL(SITE_URL),
        title,
        description,
        alternates: {
            canonical: `/${locale}/blog/${id}/${slug}`,
            ...buildAlternates({
                en: `/blog/${id}/${enSlug}`,
                ar: `/blog/${id}/${arSlug}`,
            }),
        },
        // TEMP: auto-noindex while this category has zero posts (currently true for
        // every category — no post is assigned a category yet, see action/posts.js
        // investigation). Becomes indexable automatically, with no redeploy, the
        // moment the content team assigns the first post to this category_id from
        // the CMS — the next request just sees postCount > 0.
        robots: postCount === 0 ? { index: false, follow: true } : { index: true, follow: true },
        openGraph: {
            title,
            description,
            type: "website",
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [{ url: "/og-image.png", width: 1200, height: 630 }],
        },
    };
}

// Renders the exact same /blog interface (same component, same client-side data
// flow via usePostsStore) — just pre-filtered to this one category_id. See the
// initialCategoryId prop on Blog itself for how the filter is applied without
// touching /blog's own unfiltered behavior.
export default async function BlogCategoryPage({ params }) {
    const { id } = await params;
    return <Blog initialCategoryId={id} />;
}
