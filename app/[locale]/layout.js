import { Poppins, Cairo } from 'next/font/google';
import "./globals.css";
import TopNavBar from "@/components/layout/TopNavBar";
import MainNavBar from "@/components/layout/MainNavBar";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import { SITE_URL, buildAlternates } from '@/lib/seoMeta';
import { Suspense } from 'react';
import PageLoader from '@/components/common/RouteProgressBar';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });
const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '600', '700'] });

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const safeLocale = routing.locales.includes(locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: 'Meta' });
  const brand = t('brand');
  const defaultTitle = t('defaultTitle');
  const template = t('titleTemplate');
  const description = t('description');
  const ogAlt = t('ogAlt');

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: defaultTitle, template },
    description,
    applicationName: brand,
    alternates: {
      canonical: `/${safeLocale}`,
      ...buildAlternates('/'),
    },
    openGraph: {
      type: 'website',
      siteName: brand,
      title: defaultTitle,
      description,
      locale: safeLocale === 'ar' ? 'ar_AR' : 'en_US',
      alternateLocale: safeLocale === 'ar' ? ['en_US'] : ['ar_AR'],
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description,
      images: ['/og-image.png'],
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/favicon.ico',
    },
    robots: { index: true, follow: true },
  };
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a3a66',
};

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale)) {
    notFound();
  }


  const messages = await getMessages();

  const bodyClassName = locale === 'ar' ? cairo.className : poppins.className;

  return (
     <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
   
      <body className={bodyClassName}>
        <NextIntlClientProvider messages={messages}>
                  <Suspense fallback={null}>
            <PageLoader />
          </Suspense>
          <TopNavBar />
          <MainNavBar />
          <main id="main-content" tabIndex={-1}>
            {children}
            <Toaster position="top-center" richColors />
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
