import { Award, Calendar, Download, ImageIcon } from "lucide-react";
import styles from "@/sass/pages/my-profile/my-profile.module.scss";
import Image from "next/image";
import { useTranslations } from "next-intl";

const certificates = [
    {
        id: 1,
        title: "Digital Marketing Masterclass",
        issuedDate: "2024-12-20",
        certId: "BA-DM-2024-001234",
        image: null,
    },
];

const Certificates = () => {
    const t = useTranslations('MyProfile');
    return (
        <div>
            <div className={styles.certHeader}>
                <h2>{t('certificates.title')}</h2>
                <div className={styles.certCount}>
                    <Award size={14} />
                    <span>{certificates.length} {t('certificates.earned')}</span>
                </div>
            </div>

            {certificates.length === 0 ? (
                <div className={styles.noCerts}>
                    <Award size={40} />
                    <p>{t('certificates.none')}</p>
                </div>
            ) : (
                <div className={styles.certGrid}>
                    {certificates.map((cert) => (
                        <div key={cert.id} className={styles.certCard}>
                            <div className={styles.certImageArea}>
                                {cert.image ? (
                                    <Image src={cert.image} alt={cert.title} width={400} height={400}/>
                                ) : (
                                    <div className={styles.certImagePlaceholder}>
                                        <ImageIcon size={40} color="#ffffff" />
                                    </div>
                                )}
                                <div className={styles.certBadge}>
                                    <Award size={18} />
                                </div>
                            </div>

                            <div className={styles.certContent}>
                                <h3 className={styles.certTitle}>{cert.title}</h3>

                                <div className={styles.certMeta}>
                                    <span className={styles.certMetaItem}>
                                        <Calendar size={12} />
                                        {t('certificates.issued')} {cert.issuedDate}
                                    </span>
                                </div>

                                <p className={styles.certId}>{cert.certId}</p>

                                <button className={styles.downloadBtn}>
                                    <Download size={14} />
                                    {t('certificates.download')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Certificates;
