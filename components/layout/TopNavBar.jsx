'use client';
import { useEffect, useRef, useState } from 'react';
import { Headphones, Phone, ChevronDown, Globe } from 'lucide-react';
import styles from '@/sass/components/layout/top-navbar.module.scss';
import { useTranslations } from 'next-intl';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
const TopNavBar = () => {
  const t = useTranslations('TopBar');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
   const { selectedLang, languages, switchTo } = useLanguageSwitcher();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLangSelect = (lang) => {
    setIsOpen(false);
   switchTo(lang.code);
  };

  return (
    <nav className={styles.topNavBar}>

      <div className={styles.left}>
        <div className={styles.container}>
          <div className={styles.phone}>
            <span>
              <Phone className={styles.icon} aria-hidden="true" />
            </span>
            <p>
              <span>{t('callUs')}:</span> 442035827999
            </p>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.container}>
          <span>
            <Headphones className={styles.icon} aria-hidden="true" />
          </span>

          <div className={styles.dropdown} ref={dropdownRef}>
            <button
              className={styles.dropdownTrigger}
              onClick={() => setIsOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <Globe className={styles.icon} aria-hidden="true" />
              <span>{selectedLang.label}</span>
              <ChevronDown
                className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <ul className={styles.dropdownMenu} role="listbox">
                {languages.map((lang) => (
                  <li
                    key={lang.code}
                    role="option"
                    aria-selected={selectedLang.code === lang.code}
                    className={`${styles.dropdownItem} ${
                      selectedLang.code === lang.code ? styles.active : ''
                    }`}
                    onClick={() => handleLangSelect(lang)}
                  >
                    {lang.label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

    </nav>
  );
};

export default TopNavBar;
