'use client';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Link } from '@/i18n/routing';
import styles from '@/sass/components/error-page.module.scss';

export default function ErrorPageContent({
  title,
  description,
  retryLabel,
  homeLabel,
  onRetry,
  homeHref = '/',
}) {
  return (
    <div className={styles.page} role="alert" aria-live="polite">
      <div className={styles.card}>
        <div className={styles.iconWrap} aria-hidden="true">
          <AlertTriangle size={40} strokeWidth={1.75} />
        </div>
        <span className={styles.code}>500</span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          {onRetry ? (
            <button type="button" className={styles.primaryBtn} onClick={onRetry}>
              <RefreshCw size={18} aria-hidden="true" />
              {retryLabel}
            </button>
          ) : null}
          <Link href={homeHref} className={styles.secondaryBtn}>
            <Home size={18} aria-hidden="true" />
            {homeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
