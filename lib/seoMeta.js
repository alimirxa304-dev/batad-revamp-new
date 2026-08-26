 export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://batdacademy.com";

const ENTITY_MAP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&rsquo;": "’",
  "&lsquo;": "‘",
  "&rdquo;": "”",
  "&ldquo;": "“",
  "&mdash;": "—",
  "&ndash;": "–",
  "&hellip;": "…",
  "&nbsp;": " ",
  "&copy;": "©",
  "&reg;": "®",
  "&trade;": "™",
};

function decodeEntitiesOnce(input) {
  return input.replace(
    /&(amp|lt|gt|quot|#39|apos|rsquo|lsquo|rdquo|ldquo|mdash|ndash|hellip|nbsp|copy|reg|trade);/g,
    (m) => ENTITY_MAP[m] ?? m
  );
}

export function cleanMeta(input, { maxLength = 0 } = {}) {
  if (input == null) return undefined;
  let out = String(input).replace(/<[^>]*>?/gm, "");
  let prev;
  do {
    prev = out;
    out = decodeEntitiesOnce(out);
  } while (out !== prev);
  out = out.replace(/\s+/g, " ").trim();
  if (maxLength > 0 && out.length > maxLength) {
    out = out.slice(0, maxLength - 1).replace(/\s+\S*$/, "") + "…";
  }
  return out || undefined;
}

export function parseKeywords(raw) {
  if (!raw) return undefined;
  if (Array.isArray(raw)) return raw.filter(Boolean).join(", ") || undefined;
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return (
          parsed
            .map((k) => (typeof k === "string" ? k : k?.value))
            .filter(Boolean)
            .join(", ") || undefined
        );
      }
    } catch {
      /* fall through */
    }
  }
  return trimmed || undefined;
}

export function resolveOgImage(image) {
  if (!image || typeof image !== "string") return undefined;
  // Facebook/Messenger/Twitter crawlers don't render SVG for og:image, and
  // the CMS returns a blank-image.svg placeholder when no image is set.
  if (/\.svg(\?.*)?$/i.test(image)) return undefined;
  return image;
}

// The API sometimes returns this generic CMS placeholder instead of omitting the
// image field entirely — treat it as "no image" everywhere (courses, cities, ...).
const PLACEHOLDER_IMAGE_PATTERN = /blank-image/i;

export function isPlaceholderImage(url) {
  return typeof url === "string" && PLACEHOLDER_IMAGE_PATTERN.test(url);
}

// Single source of truth for resolving a content image (course, city, ...) used by
// both Open Graph and JSON-LD, so the channels never advertise different pictures.
// `fallbackPath` is a site-relative path (e.g. "/asstes/details.jpg") to a real,
// already-existing asset — callers own which fallback fits their content type.
export function resolveContentImageUrl(rawImage, siteUrl, fallbackPath) {
  const resolved = isPlaceholderImage(rawImage) ? undefined : resolveOgImage(rawImage);
  return resolved || `${siteUrl}${fallbackPath}`;
}

// Hosts already trusted to serve real content images to end users — mirrors
// next.config.mjs images.remotePatterns exactly. This is the single allowlist
// shared by resolveSocialImage below and app/api/image-proxy/route.js: a CMS URL
// on one of these hosts is safe to re-serve from our own domain for social
// crawlers; anything else still isn't trusted.
export const TRUSTED_MEDIA_HOSTS = ["batdacademy.simplesdev.space"];

// Resolves an image for anything shared OFF our own page — Open Graph, Twitter
// cards, JSON-LD image/logo nodes — where a broken or unexpected host looks far
// worse (a dead preview card on Facebook/X, a bad Google rich-result) than it does
// for an on-page <img>. Unlike resolveContentImageUrl above (which trusts any real,
// non-placeholder CMS URL for content actually rendered on this page), this only
// trusts an absolute URL when it's same-origin with the site itself, OR on the
// known/trusted CMS media host — in which case it's routed through
// /api/image-proxy so the URL social crawlers actually fetch is still same-origin
// and always reachable, instead of collapsing every city to the same generic
// fallback picture. Any other, unrecognized host (e.g. a random staging domain)
// still isn't trusted, and falls back instead of guessing a hostname swap that
// could 404.
export function resolveSocialImage({ image, fallbackImage, siteUrl }) {
  const fallbackUrl = fallbackImage.startsWith("http")
    ? fallbackImage
    : `${siteUrl}${fallbackImage}`;

  if (typeof image !== "string") return fallbackUrl;
  const trimmed = image.trim();
  if (!trimmed || isPlaceholderImage(trimmed)) return fallbackUrl;

  if (trimmed.startsWith("/")) return `${siteUrl}${trimmed}`;

  try {
    const imageHost = new URL(trimmed).hostname;
    const siteHost = new URL(siteUrl).hostname;
    if (imageHost === siteHost) return trimmed;
    if (TRUSTED_MEDIA_HOSTS.includes(imageHost)) {
      return `${siteUrl}/api/image-proxy?url=${encodeURIComponent(trimmed)}`;
    }
  } catch {
    // Not a valid absolute URL — fall through to the fallback below.
  }
  return fallbackUrl;
}

// Builds a descriptive, locale-correct Open Graph / Twitter title for a city page —
// "Manchester" alone tells a social preview nothing about what the link is. Kept
// centralized so every social channel (and any future city-like page) agrees on the
// same phrasing instead of re-deriving it inline.
export function buildCitySocialTitle({ locale, cityName }) {
  const brand = locale === "ar" ? BRAND_NAME_AR : BRAND_NAME;
  if (!cityName) return brand;
  return locale === "ar"
    ? `الدورات التدريبية الاحترافية في ${cityName} | ${brand}`
    : `Professional Training Courses in ${cityName} | ${brand}`;
}

export const BRAND_NAME = "British Academy for Training & Development";
export const BRAND_NAME_AR = "الأكاديمية البريطانية للتدريب والتطوير";
export const PROVIDER_LOGO_PATH = "/asstes/batdacademy-logo.png";
// Prices are always GBP across the app (see the hardcoded "£" in CourseSummaryCard.jsx /
// MobileCourseHeader.jsx) — the API never returns a per-course currency field.
export const COURSE_CURRENCY = "GBP";

export function resolveCoursePriceCurrency(course) {
  return course?.currency || course?.price_currency || COURSE_CURRENCY;
}

// Narrow, purpose-built word list for buildCourseKeywordsFallback below — not a
// general NLP stopword list. Besides ordinary grammatical filler, it also excludes
// catalog-wide boilerplate ("training", "certificate", ...) that appears in nearly
// every course name and would never actually distinguish one course's keywords
// from another's.
const KEYWORD_STOPWORDS_EN = new Set([
  "a", "an", "the", "in", "of", "for", "to", "and", "or", "with", "on", "at",
  "by", "from", "is", "are", "this", "that", "your", "using",
  "training", "course", "courses", "program", "programme", "preparation",
  "certificate", "certification", "development",
]);
const KEYWORD_STOPWORDS_AR = new Set([
  "في", "من", "إلى", "و", "أو", "مع", "على", "هذا", "هذه", "التي", "الذي", "عن",
  "دورة", "دورات", "تدريب", "تدريبية", "برنامج", "تحضير", "شهادة", "اعتماد",
]);

// Pulls the most distinctive 2-3 words out of a course name (after stripping
// punctuation and the stopwords above) — used only as one ingredient of the
// keywords fallback, never as a standalone "keyword generator".
function extractNameKeywords(name, locale, max = 3) {
  if (!name) return [];
  const stopwords = locale === "ar" ? KEYWORD_STOPWORDS_AR : KEYWORD_STOPWORDS_EN;
  const words = name
    .replace(/[()"“”‘’,.:;!?/&-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const seen = new Set();
  const picked = [];
  for (const raw of words) {
    const key = raw.toLowerCase();
    if (raw.length < 3 || stopwords.has(key) || seen.has(key)) continue;
    seen.add(key);
    picked.push(raw);
    if (picked.length >= max) break;
  }
  return picked;
}

// TEMP FALLBACK — only runs when the course has no real description anywhere
// (meta_description / meta.description / details all empty, e.g. a course whose
// CMS entry was never finished). Built exclusively from fields that already exist
// on the course itself (name, category, specialization, week_number, certified,
// price) — it never invents a duration, a certification, or any detail the data
// doesn't already confirm. Remove this once the content team backfills real
// descriptions for every course.
function buildCourseDescriptionFallback({ course, locale }) {
  const name = course?.name;
  if (!name) return undefined;

  const category = course?.category?.name;
  const specialization =
    course?.specialization?.name && course.specialization.name !== category
      ? course.specialization.name
      : undefined;
  const weeks = course?.week_number != null ? String(course.week_number).trim() : "";
  const certified = course?.certified === true;
  const priceNum = parseFloat(course?.price);
  const hasPrice =
    course?.price != null && course.price !== "" && !Number.isNaN(priceNum) && priceNum > 0;
  const currency = resolveCoursePriceCurrency(course);
  const provider = locale === "ar" ? BRAND_NAME_AR : BRAND_NAME;

  if (locale === "ar") {
    let sentence = `"${name}" هي دورة تدريبية`;
    if (category) sentence += ` في مجال ${category}`;
    if (specialization) sentence += ` وتخصص ${specialization}`;
    sentence += ` تقدمها ${provider}`;
    if (weeks) sentence += ` على مدار ${weeks} أسابيع`;
    sentence += ".";
    if (certified) sentence += ` تمنح شهادة عند إتمام الدورة بنجاح.`;
    if (hasPrice) sentence += ` سعر الدورة ${priceNum} ${currency}.`;
    return sentence;
  }

  let sentence = `${name} is`;
  sentence += category ? ` a ${category} training course` : ` a training course`;
  if (specialization) sentence += ` in ${specialization}`;
  sentence += ` offered by ${provider}`;
  if (weeks) sentence += ` over ${weeks} weeks`;
  sentence += ".";
  if (certified) sentence += ` Successful completion leads to a certificate.`;
  if (hasPrice) sentence += ` The course is priced at ${currency} ${priceNum}.`;
  return sentence;
}

// TEMP FALLBACK — see buildCourseDescriptionFallback above (same trigger condition:
// only used when the course's own meta.keyword is empty). Only pulls terms that are
// already real, structured data about this exact course — its category, its
// specialization, and the most distinctive words already present in its own name —
// never unrelated/invented keywords. Remove once the content team backfills real
// keywords for every course.
function buildCourseKeywordsFallback({ course, locale }) {
  const terms = [];
  if (course?.category?.name) terms.push(course.category.name);
  if (course?.specialization?.name && course.specialization.name !== course?.category?.name) {
    terms.push(course.specialization.name);
  }
  terms.push(...extractNameKeywords(course?.name, locale));
  const unique = [...new Set(terms.filter(Boolean))];
  return unique.length ? unique.join(", ") : undefined;
}

// Single source of truth for a course's description — used by both the
// course_details page (meta description / OG / Twitter / JSON-LD) and the city
// page's embedded Course list items, so the two never disagree and the fallback
// logic isn't duplicated per page. Tries every real data source first; only calls
// the TEMP FALLBACK above when none of them have content.
export function resolveCourseDescription({ course, locale }) {
  const real = cleanMeta(
    course?.meta_description ||
      course?.meta?.meta_description ||
      course?.meta?.description ||
      course?.details
  );
  return real || buildCourseDescriptionFallback({ course, locale });
}

// Single source of truth for a course's keywords — same shared-by-both-pages
// rationale as resolveCourseDescription above.
export function resolveCourseKeywords({ course, locale }) {
  const real = parseKeywords(
    course?.meta?.keyword || course?.meta_keyword || course?.meta?.meta_keyword
  );
  return real || buildCourseKeywordsFallback({ course, locale });
}

// Recursively strips undefined/null/""/empty-array/empty-object values so JSON-LD
// output never contains placeholders for data that doesn't exist.
export function cleanJsonLd(value) {
  if (Array.isArray(value)) {
    const arr = value.map(cleanJsonLd).filter((item) => item !== undefined);
    return arr.length ? arr : undefined;
  }

  if (value && typeof value === "object") {
    const obj = Object.entries(value).reduce((acc, [key, val]) => {
      const cleaned = cleanJsonLd(val);
      if (cleaned !== undefined && cleaned !== null && cleaned !== "") {
        acc[key] = cleaned;
      }
      return acc;
    }, {});
    return Object.keys(obj).length ? obj : undefined;
  }

  return value;
}

// Prevents a literal "</script>" inside CMS-sourced text from closing the JSON-LD
// script tag early and breaking out into the surrounding HTML.
export function safeJsonLdString(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

// Same @id must resolve to the same entity on every page/locale, so these two nodes
// are built from constants only — never from per-page or per-locale data.
export function buildOrganizationNode(siteUrl) {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}#organization`,
    name: BRAND_NAME,
    alternateName: BRAND_NAME_AR,
    url: siteUrl,
    logo: { "@type": "ImageObject", url: `${siteUrl}${PROVIDER_LOGO_PATH}` },
    sameAs: [
      "https://www.facebook.com/Batdacademy.arabic",
      "https://twitter.com/batadacademy",
      "https://www.instagram.com/batdacademy",
      "https://www.youtube.com/channel/UCtiCmq7cKkzaESQuD9nsOOg",
    ],
  };
}

export function buildWebsiteNode(siteUrl) {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}#website`,
    url: siteUrl,
    name: BRAND_NAME,
    publisher: { "@id": `${siteUrl}#organization` },
    inLanguage: ["en", "ar"],
  };
}

// Generic FAQ -> FAQPage JSON-LD shape. Takes whatever [{question, answer}] pairs the
// caller already resolved (real CMS/API content, or a per-locale templated set like
// city's) and only handles turning them into a valid FAQPage node — never generates
// or invents question/answer text itself.
export function buildFAQPageSchema(qaPairs, id) {
  if (!qaPairs || qaPairs.length === 0) return undefined;
  return {
    "@type": "FAQPage",
    "@id": `${id}#faq`,
    mainEntity: qaPairs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };
}

// Resolves a course photo for JSON-LD specifically: unlike resolveSocialImage, there is
// deliberately NO fallback here — a shared generic photo repeated across every course in
// a list is worse than omitting the field, and (like OG/Twitter) a non-same-origin CMS
// URL isn't trusted for what's effectively another social surface (Google rich results /
// image search crawl it same as og:image).
export function resolveCourseListImage(rawImage, siteUrl) {
  if (isPlaceholderImage(rawImage)) return undefined;
  const resolved = resolveOgImage(rawImage);
  if (!resolved) return undefined;
  try {
    if (new URL(resolved).hostname === new URL(siteUrl).hostname) return resolved;
  } catch {
    /* not a valid absolute URL */
  }
  return undefined;
}

// Single source of truth for a "Course" ListItem entry inside any course listing's
// ItemList (city, category, course_training, ...) — same fields, same offers logic,
// built once so no page re-derives this independently.
export function buildCourseListItemNode({ course, index, locale, siteUrl, organizationId }) {
  const canonicalUrl = `${siteUrl}/${locale}/course_details/${course.id}/${encodeURIComponent(course.slug)}`;
  const priceNum = parseFloat(course.price);
  const hasValidPrice =
    course.price != null && course.price !== "" && !Number.isNaN(priceNum) && priceNum > 0;
  const imageUrl = resolveCourseListImage(course.image, siteUrl);

  return {
    "@type": "ListItem",
    position: index + 1,
    url: canonicalUrl,
    item: {
      "@type": "Course",
      "@id": `${canonicalUrl}#course`,
      url: canonicalUrl,
      name: course.name,
      description: resolveCourseDescription({ course, locale }),
      keywords: resolveCourseKeywords({ course, locale }),
      inLanguage: locale,
      category: course.category?.name,
      provider: { "@id": organizationId },
      image: imageUrl ? { "@type": "ImageObject", url: imageUrl } : undefined,
      offers: hasValidPrice
        ? {
            "@type": "Offer",
            url: canonicalUrl,
            price: String(priceNum),
            priceCurrency: resolveCoursePriceCurrency(course),
            availability: "https://schema.org/InStock",
            category: "Paid",
          }
        : undefined,
    },
  };
}

// Generic "list of courses" ItemList, shared by city/category/course_training. `extra`
// lets a caller merge in fields only it needs (city's spatialCoverage Place reference) —
// nothing page-specific lives in this function itself.
//
// hasCourseInstance is intentionally NOT added here, verified against the live API (not
// assumed): every course's `dates` entries are bare `{ date }` objects with no
// location/city/mode field at all, and sampling 360 real courses across the catalog found
// `approved_dates` empty and `is_approved: false` on all of them — there is no field
// anywhere on a course that ties a specific date to a specific city/category or confirms
// it as a real, bookable session. Adding CourseInstance from `dates` alone in a list like
// this would assert a session the data never actually confirms. course_details/[id]/[slug]
// (a single course, not a list) does add hasCourseInstance separately, from the same
// `dates` field, without this problem — see its own buildCourseGraph().
export function buildCourseItemListSchema({ courses, locale, siteUrl, id, name, description, organizationId, extra }) {
  const seenIds = new Set();
  const validCourses = [];
  for (const course of courses || []) {
    if (!course?.id || !course?.name || !course?.slug) continue;
    if (seenIds.has(course.id)) continue;
    seenIds.add(course.id);
    validCourses.push(course);
  }
  if (validCourses.length === 0) return undefined;

  return {
    "@type": "ItemList",
    "@id": id,
    name,
    description,
    inLanguage: locale,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: validCourses.length,
    ...extra,
    itemListElement: validCourses.map((course, index) =>
      buildCourseListItemNode({ course, index, locale, siteUrl, organizationId })
    ),
  };
}

// Generic BreadcrumbList — entries = [{ name, url }], in display order.
export function buildBreadcrumbSchema(entries, id) {
  if (!entries || entries.length === 0) return undefined;
  return {
    "@type": "BreadcrumbList",
    "@id": `${id}#breadcrumb`,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      item: entry.url,
    })),
  };
}

// Single source of truth for turning any real API date value (ISO, "March 3, 2026",
// whatever `new Date()` can parse) into a valid ISO 8601 string for JSON-LD date
// fields — returns undefined (never a fabricated date) for anything missing/unparseable.
export function toIsoDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

// Generic ItemList of simple named links (cities, blog posts, ...) — each item is just
// {name, url}, unlike buildCourseItemListSchema's items which nest a full Course entity.
// Kept as its own function rather than forcing cities/posts through the course builder,
// since inventing a fake Course-shaped object for a city or an article would be wrong.
export function buildLinkItemListSchema({ items, locale, id, name, description }) {
  const valid = (items || []).filter((item) => item?.name && item?.url);
  if (valid.length === 0) return undefined;
  return {
    "@type": "ItemList",
    "@id": id,
    name,
    description,
    inLanguage: locale,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: valid.length,
    itemListElement: valid.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

// The router param for a percent-encoded slug segment (e.g. an Arabic slug) may arrive
// already decoded, or may still be percent-encoded (e.g. shared links, or requests that
// bypass normal navigation) — decode once, and fall back to the raw value if it isn't
// validly encoded rather than throwing URIError. Callers that build a URL from the
// result should still re-encode it themselves (this only normalizes the input).
export function safeDecodeSlug(slug) {
  if (typeof slug !== "string") return slug;
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

// Single source of truth for encoding a slug SEGMENT (not a full path — never call this
// on a string that already contains "/") for safe embedding in a URL path: canonical,
// hreflang alternates, and every dynamic sitemap (sitemap-courses.xml,
// sitemap-specializations.xml, sitemap-cities.xml, buildCourseListItemNode) all encode
// slugs this same way, so a comma/ampersand/colon in a real slug/title never produces a
// <loc> that differs from the page's own self-declared canonical (the bug this fixed).
// safeDecodeSlug first because the router param this usually wraps may arrive already
// decoded or still percent-encoded depending on how the request reached the route —
// decoding first makes this idempotent either way instead of risking double-encoding.
export function encodeSlugSegment(slug) {
  if (slug == null) return slug;
  return encodeURIComponent(safeDecodeSlug(slug));
}

export function localePath(locale, path = "") {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${p === "/" ? "" : p}`;
}

function normalizePath(path) {
  const norm = path.startsWith("/") ? path : `/${path}`;
  return norm === "/" ? "" : norm;
}

// Accepts either a single static path (unchanged behavior — same path for both
// locales, correct for pages with no per-language slug: /page/FAQ, /contact_us,
// /blog, "/", etc.) or an { en, ar } pair of DIFFERENT paths for pages whose
// slug is itself localized (course_details, course_training, category, post,
// blog/[id]/[slug]) — passing the same single path for those silently produced
// a same-slug-under-both-prefixes hreflang link that never actually pointed at
// the other language's real content.
export function buildAlternates(pathOrPaths = "/") {
  if (typeof pathOrPaths === "string") {
    const p = normalizePath(pathOrPaths);
    return {
      languages: {
        en: `/en${p}`,
        ar: `/ar${p}`,
        "x-default": `/en${p}`,
      },
    };
  }

  const { en, ar } = pathOrPaths;
  const enPath = `/en${normalizePath(en)}`;
  const arPath = `/ar${normalizePath(ar)}`;
  return {
    languages: {
      en: enPath,
      ar: arPath,
      "x-default": enPath,
    },
  };
}
