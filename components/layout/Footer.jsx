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

const IconWhatsapp = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

// Same social destinations as the live batdacademy.com footer.
const SOCIALS = [
  { icon: <IconWhatsapp />, href: "https://api.whatsapp.com/send?phone=442035827999", label: "WhatsApp" },
  { icon: <IconFacebook />, href: "https://www.facebook.com/Batdacademy.arabic", label: "Facebook" },
  { icon: <IconTwitter />, href: "https://twitter.com/batadacademy", label: "Twitter / X" },
  { icon: <IconInstagram />, href: "https://www.instagram.com/batdacademy", label: "Instagram" },
  { icon: <IconYoutube />, href: "https://www.youtube.com/channel/UCtiCmq7cKkzaESQuD9nsOOg", label: "YouTube" },
];

// ─── Component ────────────────────────────────────────────────
// Layout mirrors the live batdacademy.com footer: about column, three link
// columns (Who we are / Cities / Info.), logo, then a sub-bar with the
// copyright and social icons.
export default async function Footer() {
  const t = await getTranslations('Footer');
  const copyrightYear = new Date().getFullYear();

  const NAV_COLUMNS = [
    {
      title: t('columns.who.title'),
      links: [
        { label: t('columns.who.vision'), href: "/page/Academy-Vision" },
        { label: t('columns.who.workArea'), href: "/page/Work-Field" },
        { label: t('columns.who.services'), href: "/page/Academy-Services" },
        { label: t('columns.who.consulting'), href: "/consulting" },
      ],
    },
    {
      title: t('columns.cities.title'),
      links: [
        { label: t('columns.cities.london'), href: "/city/33/Training-Course-in-London" },
        { label: t('columns.cities.barcelona'), href: "/city/45/Training-Course-in-Barcelona" },
        { label: t('columns.cities.dubai'), href: "/city/61/Training-Course-in-Dubai" },
        { label: t('columns.cities.istanbul'), href: "/city/71/Training-Course-in-Istanbul" },
      ],
    },
    {
      title: t('columns.info.title'),
      links: [
        { label: t('columns.info.privacy'), href: "/privacy" },
        { label: t('columns.info.terms'), href: "/page/manual" },
        { label: t('columns.info.customers'), href: "/page/our-services" },
        { label: t('columns.info.corporate'), href: `/page/${encodeURIComponent('خدمة-الشركات')}` },
      ],
    },
  ];

  return (
    <footer className={styles.footer} aria-label="Site footer">
      <div className={styles.main}>
        {/* ── About the Academy ── */}
        <div className={styles.aboutColumn}>
          <h2 className={styles.navTitle}>{t('aboutTitle')}</h2>
          <span className={styles.titleLine} aria-hidden="true" />
          <p className={styles.aboutDesc}>{t('aboutDesc')}</p>
        </div>

        {NAV_COLUMNS.map((col) => (
          <nav
            key={col.title}
            className={styles.navColumn}
            aria-label={col.title}
          >
            <h2 className={styles.navTitle}>{col.title}</h2>
            <span className={styles.titleLine} aria-hidden="true" />
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

        {/* ── Logo ── */}
        <div className={styles.logoColumn}>
          <Link href="/">
            <Image
              src={footerLogo}
              alt="British Academy for Training & Development"
              width={150}
              height={107}
              style={{ width: "auto", maxHeight: "120px", height: "auto" }}
            />
          </Link>
        </div>
      </div>

      {/* ── Bottom bar: copyright + socials, like the live subfooter ── */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>{t('copyright', { year: copyrightYear })}</p>
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
      </div>
    </footer>
  );
}
