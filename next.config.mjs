import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(
  './i18n/request.js'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  sassOptions: {
    prependData: `@import "@/sass/helpers/index";`
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'batdacademy.simplesdev.space',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'batdacademy.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Content now lives directly on the real indexed URLs themselves
      // (app/[locale]/(pages)/page/Academy-Vision, .../page/our-services) —
      // no redirect needed for the canonical, already-indexed path. These two
      // rules instead cover the OLD short paths (/academy-vision, /our-services)
      // from an earlier iteration — kept only as a safety net for any external
      // bookmarks/backlinks, since components/layout/Footer.jsx itself already
      // links directly to /page/Academy-Vision and /page/our-services.
      {
        source: '/:lang(en|ar)/academy-vision',
        destination: '/:lang/page/Academy-Vision',
        permanent: true,
      },
      {
        source: '/:lang(en|ar)/our-services',
        destination: '/:lang/page/our-services',
        permanent: true,
      },
    ];
  },
  output: 'standalone',
};

export default withNextIntl(nextConfig);
