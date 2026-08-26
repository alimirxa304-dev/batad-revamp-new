'use client';
import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const prevRoute = useRef(`${pathname}${searchParams.toString()}`);
  const hideTimer = useRef(null);

  useEffect(() => {
    const currentRoute = `${pathname}${searchParams.toString()}`;

    if (prevRoute.current !== currentRoute) {
      // New route — show loader
      prevRoute.current = currentRoute;
      setVisible(true);

      // After the page settles, hide the loader
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => {
        setVisible(false);
      }, 600);
    }

    return () => clearTimeout(hideTimer.current);
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255, 255, 255, 0.75)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          {/* Spinner */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: '4px solid #f0e0e1',
                borderTop: '4px solid #B12E33',
              }}
            />
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#B12E33',
                letterSpacing: '0.03em',
                margin: 0,
              }}
            >
              Loading...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
