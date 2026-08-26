import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = ['/myProfile', '/editMyProfile'];
const publicOnlyRoutes = ['/signIn', '/signUp'];

// Single indexable production host - exact match only. www, any subdomain,
// and Vercel preview/staging deployments all fall through to noindex below.
const ALLOWED_HOST = 'batdacademy.com';

// Same endpoint action/posts.js's getPosts() calls internally (`${API_KEY}/posts`).
// Not imported directly here: that function is a "use server" Server Action bound
// to the main server runtime's action bundle, not Middleware's separate Edge
// bundle, and giving ITS fetch a revalidate window would cache post data for
// every other caller too (e.g. /blog itself), not just this lookup. This keeps
// the caching scoped to exactly the one thing that needs it.
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// Resolves whether `id` is a real, current post category by checking the same
// `categories` list /blog and /blog/[id]/[slug] already read off the /posts
// response (id, slug, name), never a hardcoded id-to-slug table, so any category
// that exists now or gets added later just works with zero code changes.
// Cached 5 minutes via Next.js's fetch Data Cache: this endpoint is hit on every
// matching request across every visitor, so an uncached call here would mean a
// live upstream round-trip per taxonomy/* hit. The category list itself changes
// rarely, so a short cache window is safe.
async function resolveRealCategory(locale, id) {
  try {
    const res = await fetch(`${API_KEY}/posts`, {
      headers: { 'Content-Type': 'application/json', 'Accept-Language': locale ?? 'en' },
      next: { revalidate: 300 },
    });
    const json = await res.json();
    const categories = json?.data?.categories || [];
    return categories.find((c) => String(c.id) === String(id)) || null;
  } catch {
    return null;
  }
}

// Same "/categories" listing course_training/[id]/page.jsx's RedirectToSlugPage
// already reads to resolve an id -> slug, mirrored here so the old ?specialization=
// redirect (rule "ب" below) can land on the final /course_training/{id}/{slug} URL
// in one hop instead of a second 308 from that page. Cached 5 minutes like
// resolveRealCategory above, same rationale (hit on every matching request, list
// changes rarely).
async function resolveSpecializationById(locale, id) {
  try {
    const res = await fetch(`${API_KEY}/categories`, {
      headers: { 'Content-Type': 'application/json', 'Accept-Language': locale ?? 'en' },
      next: { revalidate: 300 },
    });
    const json = await res.json();
    const categories = json?.data || [];
    for (const cat of categories) {
      const spec = cat.specializations?.find((s) => String(s.id) === String(id));
      if (spec) return spec;
    }
    return null;
  } catch {
    return null;
  }
}

function hasArabicCharacters(text) {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

// Same NEXT_LOCALE-cookie-then-Accept-Language-then-'en' logic already inlined
// for course_training/city below, extracted so the new unprefixed shortcuts
// (our-services, academy-vision, taxonomy/{id}) can reuse it without
// duplicating it a third time.
function detectDefaultLocale(request) {
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie === 'en' || localeCookie === 'ar') return localeCookie;
  const acceptLang = request.headers.get('accept-language') || '';
  const primaryLang = acceptLang.split(',')[0].trim().substring(0, 2);
  return primaryLang === 'ar' ? 'ar' : 'en';
}

function getRequestHostname(request) {
  const hostHeader = request.headers.get('host') || request.nextUrl.hostname;
  return hostHeader.split(':')[0].toLowerCase();
}

async function handleRouting(request) {
  const { pathname, searchParams } = request.nextUrl;

  // ========================================================
  // أولاً: SEO Redirects للروابط القديمة
  // ========================================================

  // أ. روابط بدون locale prefix
  if (!pathname.startsWith('/ar/') && !pathname.startsWith('/en/') && pathname !== '/ar' && pathname !== '/en') {

    // ✅ الفحص بدون trailing slash عشان يشمل /course_training و /course_training/
    if (pathname.startsWith('/course_training') || pathname.startsWith('/city')) {

      const segments = pathname.split('/').filter(Boolean);

      // /course_training أو /course_training/ بدون ID
      if (segments.length === 1) {
        const url = request.nextUrl.clone();

        const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;

        let lang = 'en';

        if (localeCookie === 'en' || localeCookie === 'ar') {
          lang = localeCookie;
        } else {
          const acceptLang = request.headers.get('accept-language') || '';
          const primaryLang = acceptLang.split(',')[0].trim().substring(0, 2);
          lang = primaryLang === 'ar' ? 'ar' : 'en';
        }

        url.pathname = `/${lang}/search_course`;
        url.search = '';
        return NextResponse.redirect(url, 301);
      }

      // /course_training/33/slug
      const decodedPathname = decodeURIComponent(pathname);
      const lang = hasArabicCharacters(decodedPathname) ? 'ar' : 'en';
      const url = request.nextUrl.clone();
      url.pathname = `/${lang}${pathname}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // أ٢. اختصارات لروابط بدون بادئة لغة كانت بتاخد قفزتين منفصلتين (next-intl بيضيف
  // البادئة أولاً، وبعدها القاعدة المخصصة تحوّل تاني في طلب جديد كامل): our-services،
  // Academy-Vision، وtaxonomy/{id} — بنحسب اللغة هنا مباشرة (نفس منطق كشف اللغة
  // المستخدَم فوق لـ course_training/city) ونبني الوجهة النهائية كاملة في تحويل واحد.
  // الحالة already-مبدوءة ببادئة (/en/our-services, /ar/taxonomy/2, ...) غير متأثرة
  // إطلاقًا — لسه بتتعالج بنفس القواعد القديمة (next.config.mjs لـ our-services/
  // Academy-Vision، "د٢." تحت لـ taxonomy/{id}) وبنفس status code كالسابق.
  if (pathname === '/our-services') {
    const lang = detectDefaultLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}/page/our-services`;
    url.search = '';
    return NextResponse.redirect(url, 308);
  }

  if (pathname === '/academy-vision') {
    const lang = detectDefaultLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}/page/Academy-Vision`;
    url.search = '';
    return NextResponse.redirect(url, 308);
  }

  const taxonomyNoPrefixMatch = pathname.match(/^\/taxonomy\/(\d+)$/);
  if (taxonomyNoPrefixMatch) {
    const [, id] = taxonomyNoPrefixMatch;
    const lang = detectDefaultLocale(request);
    const category = await resolveRealCategory(lang, id);
    if (category) {
      const url = request.nextUrl.clone();
      url.pathname = `/${lang}/blog/${category.id}/${category.slug}`;
      url.search = '';
      return NextResponse.redirect(url, 301);
    }
    // مش موجود: من غير تحويل هنا، next-intl هيضيف البادئة (قفزة واحدة)، و"د٢." تحت
    // هتفحص تاني وتسيبها تمر لـ 404 طبيعي — نفس السلوك الحالي بالظبط لهذه الحالة،
    // أصلًا قفزة واحدة من قبل، ملهاش داعي لتغيير.
  }

  // ب. روابط query params قديمة مثل ?specialization=33
  // ✅ نستثني الصفحات الحقيقية اللي بتستخدم نفس أسماء الـ params بشكل شرعي
  const legacyQueryExcludedRoutes = ['/registerCourse', '/registerInternalCourse', '/contact_us'];
  const isExcludedFromLegacyRedirect = legacyQueryExcludedRoutes.some(route =>
    pathname.includes(route)
  );

  if (!isExcludedFromLegacyRedirect) {
    // specialization= gets its own branch: resolves the real slug first so this lands
    // on the final /course_training/{id}/{slug} URL in a single 301, instead of the
    // /course_training/{id} (no slug) other legacy keys below still redirect to, which
    // needs a second 308 from RedirectToSlugPage to add the slug. Other keys unchanged.
    if (searchParams.has('specialization')) {
      const idValue = searchParams.get('specialization');
      if (/^\d+$/.test(idValue)) {
        const lang = pathname.startsWith('/en/') ? 'en' : 'ar';
        const spec = await resolveSpecializationById(lang, idValue);
        const url = request.nextUrl.clone();
        url.pathname = spec
          ? `/${lang}/course_training/${idValue}/${spec.slug}`
          : `/${lang}/course_training/${idValue}`;
        url.search = '';
        return NextResponse.redirect(url, 301);
      }
    }

    const queryKeys = ['category', 'course_id', 'id', 'main_spec'];
    for (let key of queryKeys) {
      if (searchParams.has(key)) {
        const idValue = searchParams.get(key);
        if (/^\d+$/.test(idValue)) {
          const lang = pathname.startsWith('/en/') ? 'en' : 'ar';
          const url = request.nextUrl.clone();
          url.pathname = `/${lang}/course_training/${idValue}`;
          url.search = '';
          return NextResponse.redirect(url, 301);
        }
      }
    }
  }

  // د. روابط taxonomy/blog القديمة: فهرس كل تصنيفات المدونة، مش تصنيف برقم id، فبيتحول
  // مباشرة لفهرس المدونة العام /:lang/blog. لازم تتفحص قبل الفحص الرقمي تحت لأن "blog"
  // مش رقم أصلًا ومش المفروض تدخل resolveRealCategory.
  const taxonomyBlogMatch = pathname.match(/^\/(en|ar)\/taxonomy\/blog$/);
  if (taxonomyBlogMatch) {
    const [, lang] = taxonomyBlogMatch;
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}/blog`;
    url.search = '';
    return NextResponse.redirect(url, 301);
  }

  // د٢. روابط taxonomy/{id} القديمة: فحص ديناميكي حقيقي (مش جدول ثابت) هل id ده
  // بيطابق تصنيف موجود فعليًا الآن، عبر resolveRealCategory أعلاه. لو موجود، التحويل
  // بيستخدم الـ slug الحقيقي من نفس نتيجة الفحص. لو مش موجود، الطلب يمر عاديًا
  // (404 طبيعي من Next.js نفسه، لعدم وجود route لـ taxonomy أصلًا).
  const taxonomyMatch = pathname.match(/^\/(en|ar)\/taxonomy\/(\d+)$/);
  if (taxonomyMatch) {
    const [, lang, id] = taxonomyMatch;
    const category = await resolveRealCategory(lang, id);
    if (category) {
      const url = request.nextUrl.clone();
      url.pathname = `/${lang}/blog/${category.id}/${category.slug}`;
      url.search = '';
      return NextResponse.redirect(url, 301);
    }
  }

  // هـ. رابط /page/faq بحروف صغيرة: Next.js routing حساس لحالة الأحرف، والمجلد
  // الثابت الحقيقي هو /page/FAQ (بحروف كبيرة، مطابق للرابط المفهرس عند جوجل) — لازم
  // مطابقة حساسة لحالة الأحرف هنا (regex بدون /i)، وليس next.config.mjs's redirects()
  // اللي بيطابق بدون حساسية لحالة الأحرف افتراضيًا (جرّبناه فعليًا وعمل self-redirect
  // loop لأنه طابق /page/FAQ الحقيقي نفسه أيضًا).
  const pageFaqLowercaseMatch = pathname.match(/^\/(en|ar)\/page\/faq$/);
  if (pageFaqLowercaseMatch) {
    const [, lang] = pageFaqLowercaseMatch;
    const url = request.nextUrl.clone();
    url.pathname = `/${lang}/page/FAQ`;
    url.search = '';
    return NextResponse.redirect(url, 301);
  }

  // د٣. فحص slug/locale mismatch
const coursePathMatch = pathname.match(/^\/(en|ar)\/(course_training)\/(\d+)\/(.+)$/);
  if (coursePathMatch) {
    const [, lang, routeName, id, slugPart] = coursePathMatch;
    const decodedSlug = decodeURIComponent(slugPart);

    if (lang === 'en' && hasArabicCharacters(decodedSlug)) {
      const url = request.nextUrl.clone();
      url.pathname = `/ar/${routeName}/${id}/${decodedSlug}`;
      return NextResponse.redirect(url, 301);
    }

    if (lang === 'ar' && !hasArabicCharacters(decodedSlug)) {
      const url = request.nextUrl.clone();
      url.pathname = `/en/${routeName}/${id}/${decodedSlug}`;
      return NextResponse.redirect(url, 301);
    }
  }

  // ========================================================
  // ثانياً: Authentication
  // ========================================================

  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  const purePathname = pathnameIsMissingLocale
    ? pathname
    : pathname.replace(/^\/(en|ar)/, '') || '/';

  const token = request.cookies.get('auth_token')?.value;

  const isProtectedRoute = protectedRoutes.some(route => purePathname.startsWith(route));
  const isPublicOnlyRoute = publicOnlyRoutes.some(route => purePathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const locale = pathname.split('/')[1] || routing.defaultLocale;
    const url = new URL(`/${locale}/signIn`, request.url);
    return NextResponse.redirect(url, 301);
  }

  if (isPublicOnlyRoute && token) {
    const locale = pathname.split('/')[1] || routing.defaultLocale;
    const url = new URL(`/${locale}/`, request.url);
    return NextResponse.redirect(url, 301);
  }

  // ========================================================
  // ثالثاً: next-intl
  // ========================================================
  const intlResponse = intlMiddleware(request);

  // next-intl's locale-prefix redirect (e.g. "/" -> "/en") always uses 307,
  // which is bad for SEO on a permanent, always-on locale prefix. Re-issue it as 301.
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    const location = intlResponse.headers.get('location');
    if (location) {
      const permanentRedirect = NextResponse.redirect(new URL(location, request.url), 301);
      intlResponse.headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'location') {
          permanentRedirect.headers.set(key, value);
        }
      });
      return permanentRedirect;
    }
  }

  return intlResponse;
}

export async function middleware(request) {
  const response = await handleRouting(request);

  // Temporary kill switch to allow crawling/testing (e.g. Google Rich Results
  // Test) on non-production hosts like Vercel previews. Flip
  // DOMAIN_PROTECTION_ENABLED back to 'true' in .env once testing is done.
  if (process.env.DOMAIN_PROTECTION_ENABLED !== 'true') {
    return response;
  }

  const hostname = getRequestHostname(request);

  if (hostname !== ALLOWED_HOST) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|og-image.png|images|assets|asstes|sitemap.xml|robots.txt).*)',
  ],
};