import { SITE_URL } from "@/lib/seoMeta";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/en/signIn",
          "/ar/signIn",
          "/en/signUp",
          "/ar/signUp",
          "/en/forgetPassword",
          "/ar/forgetPassword",
          "/en/resetPassword",
          "/ar/resetPassword",
          "/en/myProfile",
          "/ar/myProfile",
          "/en/editMyProfile",
          "/ar/editMyProfile",
          "/en/registerCourse",
          "/ar/registerCourse",
          "/en/registerInternalCourse",
          "/ar/registerInternalCourse",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
