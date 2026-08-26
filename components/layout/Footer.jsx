import styles from "@/sass/components/layout/footer.module.scss";
import Image from "next/image";
import footerLogo from "@/public/asstes/footerlogo.webp";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

// ─── SVG Icons ────────────────────────────────────────────────
const IconYoutube = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
  </svg>
);

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.2 4.8 1.7 5 5 .1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.2 3.3-1.7 4.8-5 5-1.3.1-1.6.1-4.9.1s-3.6 0-4.8-.1c-3.3-.2-4.8-1.7-5-5C2 16.6 2 16.3 2 12s0-3.6.1-4.8c.2-3.3 1.7-4.8 5-5C8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1 0 8.3 0 8.7 0 12s0 3.7.1 4.9C.3 21.3 2.7 23.7 7.1 23.9 8.3 24 8.7 24 12 24s3.7 0 4.9-.1c4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z" />
  </svg>
);

const IconTwitter = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const IconPhone = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
  </svg>
);

const IconMail = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const SOCIALS = [
  { icon: <IconFacebook />, href: "https://www.facebook.com/Batdacademy.arabic", label: "Facebook" },
  { icon: <IconTwitter />, href: "https://twitter.com/batadacademy", label: "Twitter / X" },
  { icon: <IconInstagram />, href: "https://www.instagram.com/batdacademy", label: "Instagram" },
  { icon: <IconYoutube />, href: "https://www.youtube.com/channel/UCtiCmq7cKkzaESQuD9nsOOg", label: "YouTube" },
];

// ─── Component ────────────────────────────────────────────────
export default async function Footer() {
  const t = await getTranslations('Footer');
  // Dynamic so the copyright year never goes stale again like the hardcoded "2024" this
  // replaced — no yearly code change needed.
  const copyrightYear = new Date().getFullYear();

  const NAV_COLUMNS = [
    {
      title: t('columns.about.title'),
      links: [
        { label: t('columns.about.consultations'), href: "/page/our-services" },
        { label: t('columns.about.blog'), href: "/page/Academy-Vision" },
        { label: t('columns.about.faq'), href: "/page/FAQ" },
        { label: t('columns.about.privacy'), href: "/privacy" },
      ],
    },
    {
      title: t('columns.quickLinks.title'),
      links: [
        { label: t('columns.quickLinks.coursesByCity'), href: "/show_cities" },
          { label: t('columns.quickLinks.yearPlans'), href: "/year_plan" },

        // { label: t('columns.quickLinks.professionalPath'), href: "#" },
        { label: t('columns.quickLinks.jobs'), href: "/jobs" },
        { label: t('columns.quickLinks.categories'), href: "/search_course" },
        { label: t('columns.quickLinks.specialization'), href: "/search_course" },
      ],
    },
    {
      title: t('columns.support.title'),
      links: [
        // { label: t('columns.support.supportCenter'), href: "#" },
        // { label: t('columns.support.account'), href: "#" },
        { label: t('columns.support.contact'), href: "/contact_us" },
        // { label: t('columns.support.feedback'), href: "#" },
      ],
    },
  ];

  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.top}>
        {/* <Image
          src={footerLogo}
          width={150}
          height={107}
          alt="British Academy"
          priority={false}
          style={{ width: "150px", height: "107px" }}
        /> */}
        <p className={styles.tagline}>{t('tagline')}</p>
      </div>

      <div className={styles.main}>
        {NAV_COLUMNS.map((col) => (
          <nav
            key={col.title}
            className={styles.navColumn}
            aria-label={col.title}
          >
            <h2 className={styles.navTitle}>{col.title}</h2>
            <ul className={styles.navList}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.navLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        {/* ── Contact block ── */}
        <div className={styles.contactColumn}>
          <div
            className={styles.socials}
            role="list"
            aria-label="Social media links"
          >
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
                aria-label={s.label}
                role="listitem"
              >
                {s.icon}
              </a>
            ))}
          </div>

          <div className={styles.contactItems}>
            <a href="tel:+442035827999" className={styles.contactItem}>
              <span className={styles.contactIcon}>
                <IconPhone />
              </span>
              +44 20 3582 7999
            </a>
            <a
              href="mailto:info@batdacademy.org.uk"
              className={styles.contactItem}
            >
              <span className={styles.contactIcon}>
                <IconMail />
              </span>
              info@batdacademy.org.uk
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>{t('copyright', { year: copyrightYear })}</p>
      </div>
    </footer>
  );
}
