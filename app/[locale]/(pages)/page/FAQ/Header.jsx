"use client";
import styles from "@/sass/pages/fqa/header.module.scss";
import { ChevronRight, House } from "lucide-react";
import container from "@/sass/components/common/container.module.scss";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

const Header = () => {
    const t = useTranslations('FAQ');
    const { locale } = useParams();

    return (
        <div className={styles.header}>
            <div className={container.container}>
                <div className={styles.wrapper}>
                    <div className={styles.breadcrumb}>
                        <Link href={`/${locale}`}><House aria-hidden="true" /></Link>
                        <ChevronRight aria-hidden="true" />
                        <span>{t('breadcrumb')}</span>
                    </div>
                    <div className={styles.content}>
                        <h1>{t('title')}</h1>
                        <p>{t('subtitle')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
