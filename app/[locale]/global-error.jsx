'use client';

import { useEffect } from 'react';
import { Poppins, Cairo } from 'next/font/google';
import ErrorPageContent from '@/components/errors/ErrorPageContent';
import { routing } from '@/i18n/routing';
import './globals.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] });
const cairo = Cairo({ subsets: ['arabic'], weight: ['400', '600', '700'] });

const copy = {
  en: {
    title: 'Something went wrong',
    description:
      "We're sorry — an unexpected error occurred on our site. Please try again or return to the homepage.",
    retry: 'Try again',
    home: 'Back to home',
  },
  ar: {
    title: 'حدث خطأ غير متوقع',
    description: 'نعتذر — حدث خطأ في الموقع. يرجى المحاولة مرة أخرى أو العودة إلى الصفحة الرئيسية.',
    retry: 'إعادة المحاولة',
    home: 'العودة للرئيسية',
  },
};

function getLocaleFromPath() {
  if (typeof window === 'undefined') return routing.defaultLocale;
  const segment = window.location.pathname.split('/')[1];
  return routing.locales.includes(segment) ? segment : routing.defaultLocale;
}

export default function GlobalError({ error, reset }) {
  const locale = getLocaleFromPath();
  const t = copy[locale] ?? copy.en;
  const bodyClassName = locale === 'ar' ? cairo.className : poppins.className;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={bodyClassName}>
        <ErrorPageContent
          title={t.title}
          description={t.description}
          retryLabel={t.retry}
          homeLabel={t.home}
          onRetry={reset}
          homeHref="/"
        />
      </body>
    </html>
  );
}
