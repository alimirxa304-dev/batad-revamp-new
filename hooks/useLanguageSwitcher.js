import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import useLanguageStore, { LANGUAGES } from '@/store/useLanguageStore';

export { LANGUAGES };

export const useLanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setLocale = useLanguageStore((s) => s.setLocale);
  const alternatePaths = useLanguageStore((s) => s.alternatePaths); 

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  const selectedLang = LANGUAGES.find((l) => l.code === locale) ?? LANGUAGES[1];
  const oppositeLang = LANGUAGES.find((l) => l.code !== locale) ?? LANGUAGES[0];

  const switchTo = (langCode) => {
    setLocale(langCode); 
    
    // --- NEW CODE: Use the localized slug path if it exists, otherwise fallback to the current path ---
    if (alternatePaths && alternatePaths[langCode]) {
      router.replace(alternatePaths[langCode], { locale: langCode });
    } else {
      router.replace(
        { pathname, query: Object.fromEntries(searchParams.entries()) },
        { locale: langCode }
      );
    }
  };

  const toggle = () => switchTo(oppositeLang.code);

  return { selectedLang, oppositeLang, languages: LANGUAGES, switchTo, toggle };
};