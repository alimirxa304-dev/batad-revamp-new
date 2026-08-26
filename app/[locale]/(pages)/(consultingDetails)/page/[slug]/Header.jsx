"use client";
import container from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/consulting/consulting-details/Header.module.scss";
import { useTranslations } from "next-intl";

const Header = ({ name }) => {
    const t = useTranslations('Consulting');

    return (
        <div className={styles.header}>
            <div className={container.container}>
                <div className={styles.wrapper}>
                    <div className={styles.content}>
                        <h1>{name || t('ourServicesTitle')}</h1>
                        <p>{t('detailsHeaderSubtitle')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
