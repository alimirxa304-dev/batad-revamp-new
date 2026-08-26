import { create } from 'zustand';
export const LANGUAGES = [
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'en', label: 'English',  dir: 'ltr' },
];
/**
 * Global language store (Zustand).
 */
const useLanguageStore = create((set) => ({
  /** Active locale code – defaults to 'en' until the hook syncs it. */
  locale: 'en',
  /** Call this to update the stored locale (done inside useLanguageSwitcher). */
  setLocale: (code) => set({ locale: code }),
  /** Store for alternate slugs based on language */
  alternatePaths: null, 
  setAlternatePaths: (paths) => set({ alternatePaths: paths }),
}));
export default useLanguageStore;