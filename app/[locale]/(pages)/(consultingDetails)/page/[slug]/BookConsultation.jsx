'use client';
import { useState } from "react";
import { Calendar, Clock } from "lucide-react";
import ApplicationModal from "@/components/common/ApplicationModal";
import styles from "@/sass/pages/consulting/consulting-details/book-consultation.module.scss";
import ApplicationForm from "@/components/common/ApplicationForm";
import { useTranslations } from "next-intl";

const BookConsultation = ({ bookPackage, consultingServiceId }) => {
    const t = useTranslations('Consulting');
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className={styles.bookConsultation}>
            <div className={styles.top}>
                <h3>{bookPackage?.title}</h3>
                {(bookPackage?.price_min || bookPackage?.price_max) && (
                    <p>
                        {t('priceFrom')} <strong>£{bookPackage.price_min?.toLocaleString()}</strong>
                        {' '}{t('priceTo')}{' '}
                        <span>£{bookPackage.price_max?.toLocaleString()}</span>
                    </p>
                )}
            </div>

            <div className={styles.content}>
                <div className={styles.contentItem}>
                    <div className={styles.item}>
                        <Clock size={20} color="#1E2749" />
                        <div className={styles.info}>
                            <h2>{t('duration')}</h2>
                            <p>{bookPackage?.duration || '1-3 weeks'}</p>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <Calendar size={20} color="#1E2749" />
                        <div className={styles.info}>
                            <h2>{t('availability')}</h2>
                            <p>{bookPackage?.availability}</p>
                        </div>
                    </div>

                    <div className={styles.item}>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#1E2749', lineHeight: 1 }}>£</span>
                        <div className={styles.info}>
                            <h2>{t('payment')}</h2>
                            <p>{bookPackage?.payment}</p>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button onClick={() => setIsModalOpen(true)}>
                            {bookPackage?.cta?.label || t('bookConsultation')}
                        </button>

                        <div className={styles.need}>
                            <div className={styles.head}>
                                <h3>{bookPackage?.help?.title || t('needHelp')}</h3>
                                <p>{bookPackage?.help?.description || t('freeCall')}</p>
                            </div>
                            <span>{bookPackage?.help?.email || 'consult@gmail.com'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ApplicationModal
                open={isModalOpen}
                onOpenChange={(value) => setIsModalOpen(value)}
                triggerLabel={null}
            >
                <ApplicationForm
                    onClose={() => setIsModalOpen(false)}
                    consultingServiceId={consultingServiceId}
                />
            </ApplicationModal>
        </div>
    );
};

export default BookConsultation;
