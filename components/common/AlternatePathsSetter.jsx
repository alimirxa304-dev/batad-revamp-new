'use client';
import { useEffect } from 'react';
import useLanguageStore from '@/store/useLanguageStore';

export default function AlternatePathsSetter({ enPath, arPath }) {
  const setAlternatePaths = useLanguageStore((state) => state.setAlternatePaths);

  useEffect(() => {
    // Set the alternate paths when the page mounts
    setAlternatePaths({
      en: enPath, // e.g., '/courses/slug_en'
      ar: arPath  // e.g., '/courses/slug_ar'
    });

    // Cleanup when the user leaves this dynamic page
    return () => {
      setAlternatePaths(null);
    };
  }, [enPath, arPath, setAlternatePaths]);

  return null; // This component doesn't render anything
}