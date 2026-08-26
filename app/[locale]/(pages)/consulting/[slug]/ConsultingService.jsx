'use client';
import styles from "@/sass/pages/consulting/consulting-category/consulting-category.module.scss";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ConsultingCategoryCard from "./ConsultingCategoryCard";
import Header from "./Header";
import { useTranslations } from "next-intl";

const ConsultingService = ({ serviceData }) => {
    const t = useTranslations('Consulting');
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className={styles.consultingCategory}>
            <Header consultantName={serviceData?.name} updateFilter={updateFilter} />

            <div className={styles.mainContent}>
                <div className={styles.title}>
                    <h1>{t('ourServicesTitle')}</h1>
                    <p>{t('ourServicesSubtitle')}</p>
                </div>

                <div className={styles.contentCards}>
                    {!serviceData?.services || serviceData.services.length === 0 ? (
                        <p>{t('noServicesFound')}</p>
                    ) : (
                        serviceData.services.map((service, index) => (
                            <ConsultingCategoryCard key={index} service={service} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsultingService;
