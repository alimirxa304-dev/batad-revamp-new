'use client'
import { useEffect } from "react";
import Image from "next/image";
import useClientsStore from "@/store/useClientsStore";
import GenericSlider from "@/components/common/GenericSlider";
import Title from "@/components/common/Title";
import styleContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/home/customers.module.scss";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslations } from "next-intl";

const Customer = ({ client }) => {
    return (
        <div className={styles.customer}>
            <div className={styles.customer__image}>
                <Image alt={client.name} src={client.logo} width={130} height={130} />
            </div>
        </div>
    )
}

const Customers = () => {
    // const t = useTranslations('Customers');
    const { clients, handleGetClients, isLoading } = useClientsStore();
    const t = useTranslations('customers')
    useEffect(() => {
        handleGetClients();
    }, []);
    return (
        <section>
            <div className={styleContainer.container}>
                <Title title={t('title')} span={t('span')} />
                {
                    isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <Skeleton type="card" className={styles.skeletonCard} />
                            <Skeleton type="card" className={styles.skeletonCard} />
                            <Skeleton type="card" className={styles.skeletonCard} />
                            <Skeleton type="card" className={styles.skeletonCard} />
                        </div>
                    ) :
                        (
                            <GenericSlider
                                navId="clients"
                                items={clients}
                                renderSlide={(client) => <Customer client={client} />}
                                spaceBetween={20}
                                showViewAll={false}
                                autoplay={{
                                    delay: 2000,
                                    disableOnInteraction: false,
                                }}
                                // hidden={true}
                                breakpoints={{
                                    0:{
                                        slidesPerView:1.5,
                                        centeredSlides:true,
                                        centeredSlidesBounds:true
                                    },
                                    768: {
                                        slidesPerView: 2.5,
                                        centeredSlides:false,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                    },
                                    1280: {
                                        slidesPerView: 4,
                                    },
                                    1536: {
                                        slidesPerView: 5,
                                    },
                                    1792: {
                                        slidesPerView: 6,
                                    },
                                }}
                            />
                        )
                }

            </div>
        </section>
    );
};

export default Customers;