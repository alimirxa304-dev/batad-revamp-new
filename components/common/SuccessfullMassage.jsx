"use client";
import styles from "@/sass/components/common/successfull-massage.module.scss";
import useLanguageStore from "@/store/useLanguageStore";
import { Check, House } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const SuccessfullMassage = ({ message, onClose }) => {
    const { locale } = useLanguageStore();
    const t = useTranslations('Consulting.form');

    return (
        <div className={styles.successfull}>
            <div className={styles.head}>
                <Check size={24} />
            </div>
            <h3>{t('successTitle')}</h3>
            <p>{t('successMsg')}</p>
            <div className={styles.buttons}>
                <Link href={`/${locale}/`} className={styles.backToHome} onClick={onClose}>
                    <House size={14} />
                    {t('backToHome')}
                </Link>
                <button className={styles.closeButton} onClick={onClose}>
                    {t('close')}
                </button>
            </div>
        </div>
    );
};

export default SuccessfullMassage;
