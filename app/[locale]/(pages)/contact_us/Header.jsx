"use client";
import styles from "@/sass/pages/contact/header.module.scss";
import container from "@/sass/components/common/container.module.scss";
import { ChevronRight, House, HeadphonesIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const Header = () => {
    const t = useTranslations('Contact');
    const { locale } = useParams();

    return (
        <div className={styles.header}>
            <div className={container.container}>
                <div className={styles.wrapper}>
                    <div className={styles.breadcrumb}>
                        <Link href={`/${locale}`}><House size={18} /></Link>
                        <ChevronRight size={16} />
                        <span>{t('breadcrumb')}</span>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.badge}>
                            <HeadphonesIcon size={16} />
                            <span>{t('badge')}</span>
                        </div>
                        <h1>{t('title')} <br /> {t('titleLine2')}</h1>
                        <p>{t('subtitle')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
