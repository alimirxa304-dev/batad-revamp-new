"use client";
import { ChevronRight, House } from "lucide-react";
import container from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/print-category/header.module.scss";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";

const Header = ({ name, summary }) => {
    const t = useTranslations('PrintCategory');
    const { locale } = useParams();

    return (
        <div className={styles.header}>
            <div className={container.container}>
                <div className={styles.wrapper}>
                    <div className={styles.breadcrumb}>
                        <Link href={`/${locale}`}><House /></Link>
                        <ChevronRight />
                        <span>{name}</span>
                    </div>
                    <div className={styles.content}>
                        <h1>{t('headerTitle')} {name}</h1>
                        <p dangerouslySetInnerHTML={{ __html: summary }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
