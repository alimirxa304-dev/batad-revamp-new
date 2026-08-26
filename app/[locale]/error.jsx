'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import ErrorPageContent from '@/components/errors/ErrorPageContent';

export default function Error({ error, reset }) {
  const t = useTranslations('Error');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPageContent
      title={t('title')}
      description={t('description')}
      retryLabel={t('retry')}
      homeLabel={t('home')}
      onRetry={reset}
      homeHref="/"
    />
  );
}
