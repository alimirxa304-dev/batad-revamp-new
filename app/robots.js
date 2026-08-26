import { headers } from "next/headers";
import { SITE_URL } from "@/lib/seoMeta";

// Single indexable production host - exact match only. www, any subdomain,
// and Vercel preview/staging deployments all get a blanket Disallow: / below.
const ALLOWED_HOST = "batdacademy.com";

function defaultRules() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/show_course_content_pdf/',
        '/*?page=',
        '/print',
        '/post/print/',
        '/*registerInternalCourse',
        '/*registerCourse',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

export default async function robots() {
  // Temporary kill switch to allow crawling/testing (e.g. Google Rich Results
  // Test) on non-production hosts like Vercel previews. Flip
  // DOMAIN_PROTECTION_ENABLED back to 'true' in .env once testing is done.
  if (process.env.DOMAIN_PROTECTION_ENABLED !== 'true') {
    return defaultRules();
  }

  const headersList = await headers();
  const hostname = (headersList.get('host') || '').split(':')[0].toLowerCase();

  // if (hostname !== ALLOWED_HOST) {
  //   return {
  //     rules: {
  //       userAgent: '*',
  //       disallow: '/',
  //     },
  //   };
  // }

  return defaultRules();
}