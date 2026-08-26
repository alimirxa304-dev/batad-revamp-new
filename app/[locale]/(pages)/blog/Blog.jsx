"use client";
import LatestPostsCard from "@/components/common/LatestPostsCard";
import SelectCategories from "@/components/common/SelectCategories";
import DisplayType from "@/components/ui/DisplayType";
import Skeleton from "@/components/ui/Skeleton";
import Sort from "@/components/ui/Sort";
import stylesContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/blog/blog.module.scss";
import usePostsStore from "@/store/usePostsStore";
import { ChevronRight, Filter, SquareArrowOutUpRight, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FeaturedArticle from "./FeaturedArticle";
import LatestArticles from "./LatestArticles";
import SearchInput from "./Search";
import MotionWrapper from "@/components/common/MotionWrapper";
import CategoriesBox from "@/components/common/CategoriesBox";
import * as Dialog from "@radix-ui/react-dialog";
import { useTranslations } from "next-intl";

// initialCategoryId: used by blog/[id]/[slug]/page.jsx to reuse this exact same
// component/UI as a category-scoped view — same interface as /blog, just
// pre-filtered to one category_id instead of showing everything. Optional and
// unused on the plain /blog route, so that page's own behavior is unchanged.
const Blog = ({ initialCategoryId } = {}) => {
  const t = useTranslations('Blog');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState("grid");
  const { handleGetPosts, posts, isLoading } = usePostsStore();
  const [visibleCount, setVisibleCount] = useState(6);

  // The category filter is only ever forced in via initialCategoryId when the
  // URL itself doesn't already carry one (e.g. the user picked a different
  // category from the sidebar, which pushes its own ?category_id= via
  // updateFilter below and takes over from here).
  const activeCategoryId = searchParams.get("category_id") || (initialCategoryId != null ? String(initialCategoryId) : null);

  const firstPostId = posts?.posts?.[0]?.id;

  useEffect(() => {
    setVisibleCount(6);
    setMounted(true);
  }, [firstPostId]);

  const handleViewMore = () => {
    if (posts?.posts && visibleCount < posts.posts.length) {
      setVisibleCount((prev) => prev + 6);
    } else if (posts?.has_more) {
      setVisibleCount((prev) => prev + 6);
      const params = new URLSearchParams(window.location.search);
      if (initialCategoryId != null && !params.has("category_id")) {
        params.set("category_id", initialCategoryId);
      }
      params.set("cursor", posts.next_cursor);
      handleGetPosts(`?${params.toString()}`, true);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (initialCategoryId != null && !params.has("category_id")) {
      params.set("category_id", initialCategoryId);
    }
    const paramsString = params.toString();
    const queryString = paramsString ? `?${paramsString}` : "";
    handleGetPosts(queryString);
  }, [searchParams, handleGetPosts, initialCategoryId]);

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <section className={styles.blog}>
      <div className={styles.top}>
        <div className={stylesContainer.container}>
          <div className={styles.top__content}>
            <SearchInput updateFilter={updateFilter} />
            <div className={styles.top__right}>
              <Sort
                activeSort={searchParams.get("sort") || "latest"}
                onChange={(value) => updateFilter("sort", value)}
              />
              <DisplayType view={view} onChange={setView} />
            </div>
            <div className={styles.top_filter}>
              <Dialog.Root modal={true}>
                <Dialog.Trigger asChild>
                  <button
                    className={styles.top_mobile_right}
                    type="button"
                    aria-label="Open filters"
                
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M9.10059 18.9418C8.70092 18.9418 8.30129 18.8419 7.93493 18.6421C7.19388 18.2258 6.75254 17.4846 6.75254 16.6437V12.1891C6.75254 11.7645 6.47776 11.1399 6.21964 10.8152L3.05561 7.49297C2.53104 6.96841 2.12305 6.05249 2.12305 5.37805V3.44635C2.12305 2.10579 3.13889 1.05664 4.42948 1.05664H15.5369C16.8109 1.05664 17.8433 2.08913 17.8433 3.36308V5.21154C17.8433 6.08582 17.3188 7.0933 16.8192 7.58455C16.5777 7.82602 16.178 7.82602 15.9366 7.58455C15.6951 7.34309 15.6951 6.94342 15.9366 6.70195C16.2447 6.39388 16.5944 5.7028 16.5944 5.21154V3.36308C16.5944 2.78023 16.1198 2.3056 15.5369 2.3056H4.42948C3.83831 2.3056 3.37201 2.80521 3.37201 3.44635V5.37805C3.37201 5.68613 3.62181 6.29398 3.94654 6.61871L7.15224 9.99086C7.57689 10.5154 7.99317 11.3981 7.99317 12.1891V16.6437C7.99317 17.1932 8.36786 17.4597 8.53439 17.5513C8.89243 17.7511 9.31707 17.7428 9.65013 17.5429L10.8158 16.7936C11.0573 16.6521 11.2904 16.194 11.2904 15.886C11.2904 15.5446 11.5735 15.2615 11.9149 15.2615C12.2563 15.2615 12.5394 15.5446 12.5394 15.886C12.5394 16.6353 12.0731 17.493 11.4819 17.851L10.3246 18.6004C9.94988 18.8252 9.52524 18.9418 9.10059 18.9418Z"
                        fill="white"
                      />
                      <path
                        d="M13.3807 14.3796C11.5656 14.3796 10.0918 12.9059 10.0918 11.0907C10.0918 9.27553 11.5656 7.80176 13.3807 7.80176C15.1959 7.80176 16.6697 9.27553 16.6697 11.0907C16.6697 12.9059 15.1959 14.3796 13.3807 14.3796ZM13.3807 9.05072C12.2567 9.05072 11.3408 9.96663 11.3408 11.0907C11.3408 12.2148 12.2567 13.1307 13.3807 13.1307C14.5048 13.1307 15.4207 12.2148 15.4207 11.0907C15.4207 9.96663 14.5048 9.05072 13.3807 9.05072Z"
                        fill="white"
                      />
                      <path
                        d="M16.5448 14.8793C16.3866 14.8793 16.2285 14.821 16.1036 14.6961L15.2709 13.8635C15.0295 13.622 15.0295 13.2224 15.2709 12.9809C15.5124 12.7394 15.9121 12.7394 16.1535 12.9809L16.9862 13.8135C17.2277 14.055 17.2277 14.4547 16.9862 14.6961C16.8696 14.8127 16.703 14.8793 16.5448 14.8793Z"
                        fill="white"
                      />
                    </svg>
                  </button>
                </Dialog.Trigger>

                {mounted && (
                  <Dialog.Portal>
                    <Dialog.Overlay className={styles.drawerOverlay} />
                    <Dialog.Content className={styles.drawerContent}>
                      <div className={styles.drawerHeader}>
                        <Dialog.Title className={styles.drawerTitle}>
                          {t('filters')}
                        </Dialog.Title>
                        <Dialog.Close className={styles.drawerClose}>
                          <X size={20} />
                        </Dialog.Close>
                      </div>
                      <div className={styles.filter}>
                        <CategoriesBox
                          title={t('sortBy')}
                          icon={<Filter size={18} />}
                        >
                          <div className={styles.sidebarFilterContent}>
                            <Sort
                              activeSort={searchParams.get("sort") || "latest"}
                              onChange={(value) => updateFilter("sort", value)}
                              style={{
                                width: "100%",
                              }}
                            />
                          </div>
                        </CategoriesBox>
                        <CategoriesBox
                          title={t('allCategories')}
                          icon={<Filter size={18} />}
                        >
                          <ul className={styles.sidebarCategoryList}>
                            {posts?.categories?.map((category) => (
                              <li
                                key={category.id}
                                onClick={() =>
                                  updateFilter("category", category.id)
                                }
                              >
                                <span>{category.name}</span>
                                <div className={styles.badgeWrapper}>
                                  <span className={styles.badge}>
                                    {category.post_count}
                                  </span>
                                  <ChevronRight size={12} />
                                </div>
                              </li>
                            ))}
                          </ul>
                        </CategoriesBox>
                      </div>
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </Dialog.Root>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.moblieTop}>
        <h2>{t('blogPosts')}</h2>

        <Dialog.Root modal={true}>
          <Dialog.Trigger asChild>
            <button className={styles.moblieTop__right}  type="button"
    aria-label="Open filters">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true" 
              >
                <path
                  d="M9.10059 18.9418C8.70092 18.9418 8.30129 18.8419 7.93493 18.6421C7.19388 18.2258 6.75254 17.4846 6.75254 16.6437V12.1891C6.75254 11.7645 6.47776 11.1399 6.21964 10.8152L3.05561 7.49297C2.53104 6.96841 2.12305 6.05249 2.12305 5.37805V3.44635C2.12305 2.10579 3.13889 1.05664 4.42948 1.05664H15.5369C16.8109 1.05664 17.8433 2.08913 17.8433 3.36308V5.21154C17.8433 6.08582 17.3188 7.0933 16.8192 7.58455C16.5777 7.82602 16.178 7.82602 15.9366 7.58455C15.6951 7.34309 15.6951 6.94342 15.9366 6.70195C16.2447 6.39388 16.5944 5.7028 16.5944 5.21154V3.36308C16.5944 2.78023 16.1198 2.3056 15.5369 2.3056H4.42948C3.83831 2.3056 3.37201 2.80521 3.37201 3.44635V5.37805C3.37201 5.68613 3.62181 6.29398 3.94654 6.61871L7.15224 9.99086C7.57689 10.5154 7.99317 11.3981 7.99317 12.1891V16.6437C7.99317 17.1932 8.36786 17.4597 8.53439 17.5513C8.89243 17.7511 9.31707 17.7428 9.65013 17.5429L10.8158 16.7936C11.0573 16.6521 11.2904 16.194 11.2904 15.886C11.2904 15.5446 11.5735 15.2615 11.9149 15.2615C12.2563 15.2615 12.5394 15.5446 12.5394 15.886C12.5394 16.6353 12.0731 17.493 11.4819 17.851L10.3246 18.6004C9.94988 18.8252 9.52524 18.9418 9.10059 18.9418Z"
                  fill="white"
                />
                <path
                  d="M13.3807 14.3796C11.5656 14.3796 10.0918 12.9059 10.0918 11.0907C10.0918 9.27553 11.5656 7.80176 13.3807 7.80176C15.1959 7.80176 16.6697 9.27553 16.6697 11.0907C16.6697 12.9059 15.1959 14.3796 13.3807 14.3796ZM13.3807 9.05072C12.2567 9.05072 11.3408 9.96663 11.3408 11.0907C11.3408 12.2148 12.2567 13.1307 13.3807 13.1307C14.5048 13.1307 15.4207 12.2148 15.4207 11.0907C15.4207 9.96663 14.5048 9.05072 13.3807 9.05072Z"
                  fill="white"
                />
                <path
                  d="M16.5448 14.8793C16.3866 14.8793 16.2285 14.821 16.1036 14.6961L15.2709 13.8635C15.0295 13.622 15.0295 13.2224 15.2709 12.9809C15.5124 12.7394 15.9121 12.7394 16.1535 12.9809L16.9862 13.8135C17.2277 14.055 17.2277 14.4547 16.9862 14.6961C16.8696 14.8127 16.703 14.8793 16.5448 14.8793Z"
                  fill="white"
                />
              </svg>
            </button>
          </Dialog.Trigger>

          {mounted && (
            <Dialog.Portal>
              <Dialog.Overlay className={styles.drawerOverlay} />
              <Dialog.Content className={styles.drawerContent}>
                <div className={styles.drawerHeader}>
                  <Dialog.Title className={styles.drawerTitle}>
                    {t('filters')}
                  </Dialog.Title>
                  <Dialog.Close className={styles.drawerClose}>
                    <X size={20} />
                  </Dialog.Close>
                </div>
                <div className={styles.filter}>
                  <CategoriesBox title={t('sortBy')} icon={<Filter size={18} />}>
                    <div className={styles.sidebarFilterContent}>
                      <Sort
                        activeSort={searchParams.get("sort") || "latest"}
                        onChange={(value) => updateFilter("sort", value)}
                        style={{
                          width: "100%",
                        }}
                      />
                    </div>
                  </CategoriesBox>
                  <CategoriesBox
                    title={t('allCategories')}
                    icon={<Filter size={18} />}
                  >
                    <ul className={styles.sidebarCategoryList}>
                      {posts?.categories?.map((category) => (
                        <li
                          key={category.id}
                          onClick={() => updateFilter("category", category.id)}
                        >
                          <span>{category.name}</span>
                          <div className={styles.badgeWrapper}>
                            <span className={styles.badge}>
                              {category.post_count}
                            </span>
                            <ChevronRight size={12} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CategoriesBox>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </Dialog.Root>
      </div>
      <div className={stylesContainer.container}>
        <div className={styles.blogContent}>
          <MotionWrapper className={styles.blogContent__left}>
            {isLoading ? (
              <div className={styles.skeletonContainer}>
                <div className={styles.skeletonGridRow}>
                  <Skeleton type="card" className={styles.skeletonCard} />
                  <Skeleton type="card" className={styles.skeletonCard} />
                </div>
              </div>
            ) : (
              <>
                <div className={styles.categories}>
                  <h2 className={styles.title}>{t('allCategories')}</h2>
                  {posts?.categories?.map((category) => {
                    const isActive = activeCategoryId === String(category.id);
                    return (
                      <SelectCategories
                        key={category.id}
                        category={category}
                        isActive={isActive}
                        onClick={() =>
                          updateFilter(
                            "category_id",
                            isActive ? "" : category.id,
                          )
                        }
                      />
                    );
                  })}
                </div>

                <div className={styles.latestPosts}>
                  <div className={styles.title}>
                    <div className={styles.left}>
                      <div className={styles.icon}>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-label="Latest Posts"
                        >
                          <g clipPath="url(#clip0_355_5195)">
                            <mask
                              id="mask0_355_5195"
                              style={{ maskType: "alpha" }}
                              maskUnits="userSpaceOnUse"
                              x="0"
                              y="0"
                              width="14"
                              height="14"
                            >
                              <path d="M0 0H14V14H0V0Z" fill="white" />
                            </mask>
                            <g mask="url(#mask0_355_5195)">
                              <path
                                d="M11.025 0.656006H13.172L8.482 6.03001L14 13.344H9.68L6.294 8.90901L2.424 13.344H0.275L5.291 7.59401L0 0.657006H4.43L7.486 4.71001L11.025 0.656006ZM10.27 12.056H11.46L3.78 1.87701H2.504L10.27 12.056Z"
                                fill="white"
                              />
                            </g>
                          </g>
                          <defs>
                            <clipPath id="clip0_355_5195">
                              <rect width="14" height="14" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                      <h2>{t('latestPosts')}</h2>
                    </div>
                    <div className={styles.right}>
                      <SquareArrowOutUpRight color="#333333" size={14} />
                    </div>
                  </div>
                  {posts?.posts?.slice(0, 2).map((item) => (
                    <LatestPostsCard key={item.id} item={item} />
                  ))}
                  <div className={styles.follow}>
                    <button>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Follow @batadacademy"
                      >
                        <g clipPath="url(#clip0_355_5390)">
                          <mask
                            id="mask0_355_5390"
                            style={{ maskType: "alpha" }}
                            maskUnits="userSpaceOnUse"
                            x="0"
                            y="0"
                            width="14"
                            height="14"
                          >
                            <path d="M0 0H14V14H0V0Z" fill="white" />
                          </mask>
                          <g mask="url(#mask0_355_5390)">
                            <path
                              d="M11.025 0.656006H13.172L8.482 6.03001L14 13.344H9.68L6.294 8.90901L2.424 13.344H0.275L5.291 7.59401L0 0.657006H4.43L7.486 4.71001L11.025 0.656006ZM10.27 12.056H11.46L3.78 1.87701H2.504L10.27 12.056Z"
                              fill="white"
                            />
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_355_5390">
                            <rect width="14" height="14" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      {t('follow')}
                    </button>
                  </div>
                </div>
              </>
            )}
          </MotionWrapper>
          <MotionWrapper className={styles.blogContent__right}>
            {isLoading ? (
              <div className={styles.skeletonContainer}>
                <Skeleton type="card" className={styles.skeletonFeatured} />
                <div className={styles.skeletonGrid}>
                  <Skeleton type="card" className={styles.skeletonCard} />
                  <Skeleton type="card" className={styles.skeletonCard} />
                  <Skeleton type="card" className={styles.skeletonCard} />
                  <Skeleton type="card" className={styles.skeletonCard} />
                </div>
              </div>
            ) : (
              <>
                <FeaturedArticle postFeatured={posts?.featured} />
                <LatestArticles
                  view={view}
                  posts={posts}
                  visibleCount={visibleCount}
                  handleViewMore={handleViewMore}
                />
              </>
            )}
          </MotionWrapper>
        </div>
      </div>
    </section>
  );
};

export default Blog;
