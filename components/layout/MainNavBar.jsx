'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { ChevronDown, Menu, X, Search, User } from 'lucide-react';
import styles from '@/sass/components/layout/main-navbar.module.scss';
import { useTranslations } from 'next-intl';
import { useLanguageSwitcher } from '@/hooks/useLanguageSwitcher';
import logo from '@/public/asstes/batdacademy-logo.png';
import useAuthStore from '@/store/useAuthStore';
import useLanguageStore from '@/store/useLanguageStore';

const MainNavBar = () => {
  const t = useTranslations('Navbar');
  const { oppositeLang, toggle } = useLanguageSwitcher();
  const { locale } = useLanguageStore();

  const [trainingOpen, setTrainingOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Menu mirrors the live batdacademy.com navigation.
  const WHO_WE_ARE_ITEMS = [
    { label: t('who.academyVision'), href: '/page/Academy-Vision' },
    { label: t('who.teamStaff'), href: '/page/Team-work' },
    { label: t('who.academyServices'), href: '/page/Academy-Services' },
    { label: t('who.workField'), href: '/page/Work-Field' },
    { label: t('who.boardOfAdvisors'), href: '/page/Board_of_Advisors' },
  ];

  const NAV_ITEMS = [
    { label: t('programs.trainingCourses'), href: '/search_course?type=1' },
    { label: t('programs.diploma'), href: '/search_course?type=3' },
    { label: t('programs.master'), href: '/search_course?type=2' },
    { label: t('cities'), href: '/show_cities' },
    { label: t('consulting'), href: '/consulting' },
    { label: t('teamWork'), href: '/page/Team-work' },
    { label: t('contactUs'), href: '/contact_us' },
    { label: t('externalTraining'), href: '/search_course' },
  ];

  const { member } = useAuthStore();
  useEffect(() => {
    const handleOutside = (e) => {
      const insideDesktop = dropdownRef.current?.contains(e.target);
      const insideMobile = mobileMenuRef.current?.contains(e.target);
      if (!insideDesktop && !insideMobile) {
        setTrainingOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (
    <header className={styles.mainNavBar}>
      <div className={styles.inner}>

        <Link href="/" className={styles.logo}>
          <Image
            src={logo}
            alt="British Academy for Training & Development"
            width={106}
            height={83}
            style={{ objectFit: 'cover', height: 'auto' }}
            priority
          />
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/" className={`${styles.navLink} ${styles.active}`}>
            {t('home')}
          </Link>

          <div className={styles.dropdown} ref={dropdownRef}>
            <button
              className={styles.navLink}
              onClick={() => setTrainingOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={trainingOpen}
            >
              {t('whoWeAre')}
              <ChevronDown
                className={`${styles.chevron} ${trainingOpen ? styles.open : ''}`}
                aria-hidden="true"
              />
            </button>

            {trainingOpen && (
              <ul className={styles.dropdownMenu} role="menu">
                {WHO_WE_ARE_ITEMS.map((item) => (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      className={styles.dropdownItem}
                      role="menuitem"
                      onClick={() => setTrainingOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {NAV_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        {
          member ? (
            <div className={styles.userProfile}>
              <div className={styles.userImage}>
                {
                  member.image ? (
                    <Image
                      src={member?.image}
                      alt={member?.full_name}
                      width={40}
                      height={40}
                    />
                  ) : (
                    <User size={24} color='#1E2749' />
                  )
                }
              </div>
              <Link href={'/myProfile'} className={styles.userName}>
                <span>{member?.full_name}</span>
              </Link>
            </div>
          ) : (
            <div className={styles.actions}>
              <Link href="/signIn" className={styles.btnSignIn}>{t('signIn')}</Link>
              <Link href="/signUp" className={styles.btnSignUp}>{t('signUp')}</Link>
            </div>
          )
        }

        {/* Mobile Search, Lang Toggle & Hamburger */}
        <div className={styles.mobileActions_top}>
          <button className={styles.searchIconMobile} aria-label="Search">
            <Search size={22} />
          </button>

          {/* ✅ Mobile lang toggle — uses shared hook, different UI */}
          <button
            className={styles.langToggleMobile}
            onClick={toggle}
            aria-label={`${oppositeLang.code.toUpperCase()} — Switch to ${oppositeLang.label}`}
          >
            {oppositeLang.code.toUpperCase()}
          </button>

          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu} ref={mobileMenuRef}>
          <Link href="/" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>{t('home')}</Link>

          <div className={styles.mobileDropdown}>
            <button
              className={styles.mobileLink}
              onClick={() => setTrainingOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={trainingOpen}
            >
              {t('whoWeAre')}
              <ChevronDown
                className={`${styles.chevron} ${trainingOpen ? styles.open : ''}`}
                aria-hidden="true"
              />
            </button>

            {trainingOpen && (
              <ul className={styles.mobileDropdownMenu} role="menu">
                {WHO_WE_ARE_ITEMS.map((item) => (
                  <li key={item.href} role="none">
                    <Link
                      href={item.href}
                      className={styles.mobileDropdownItem}
                      role="menuitem"
                      onClick={() => {
                        setTrainingOpen(false);
                        setMobileOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {
            member ? (
              <div className={styles.mobileActions}>
                <div className={styles.userImage}>
                  {
                    member.image ? (
                      <Image
                        src={member?.image}
                        alt={member?.full_name}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <User size={24} color='#1E2749' />
                    )
                  }
                </div>
                <Link href={'/myProfile'} className={styles.userName}>
                  <span>{member?.full_name}</span>
                </Link>
              </div>
            ) : (
              <div className={styles.mobileActions}>
                <Link href="/signIn" className={styles.btnSignIn} onClick={() => setMobileOpen(false)}>{t('signIn')}</Link>
                <Link href="/signUp" className={styles.btnSignUp} onClick={() => setMobileOpen(false)}>{t('signUp')}</Link>
              </div>

            )
          }

        </div>
      )}
    </header>
  );
};

export default MainNavBar;