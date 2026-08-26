'use client'
import { useEffect } from "react";
import GenericSlider from "@/components/common/GenericSlider";
import Title from "@/components/common/Title";
import styleContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/home/course-by-city.module.scss";
import useCitiesStore from "@/store/useCitiesStore";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslations } from "next-intl";

const CouresByCities = ({ city }) => {
    const { locale } = useParams();
    return (
        <Link
            className={styles.couresByCities}
            href={`/${locale}/city/${city.id}/${encodeURIComponent(city.slug)}`}
            title={city.name}
        >
            <div className={styles.couresByCities__image}>
                <Image src={city.image} alt={city.name} width={130} height={130} />
            </div>
            <div className={styles.couresByCities__content}>
                <h3 className={styles.couresByCities__content__title}>{city.name}</h3>
            </div>
        </Link>
    )
}

const CourseByCity = () => {
    const t = useTranslations('CourseByCity')
    const { handleGetCities, cities , isLoading } = useCitiesStore();
    useEffect(() => {
        handleGetCities();
    }, []);
    return (
        <section>
            <div className={styleContainer.container}>
                <Title title={t('title')} span={t('titleSpan')} subtitle={t('subtitle')} />

                {
                    isLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                            <Skeleton type="card" className={styles.skeletonCard} />
                            <Skeleton type="card" className={styles.skeletonCard} />
                            <Skeleton type="card" className={styles.skeletonCard} />
                            <Skeleton type="card" className={styles.skeletonCard} />
                        </div>
                    ) : (
                    <GenericSlider
  navId="citys"
  items={cities}
  renderSlide={(city) => <CouresByCities key={city.id} city={city} />}

  spaceBetween={20}
  breakpoints={{
    0:{
        slidesPerView:1.5,
        centeredSlides:true,
        centeredSlidesBounds:true
    },
    768: {
        slidesPerView:2.5,
        centeredSlides:false,
    },
    1024: {
      slidesPerView: 3,
    },
    1280: {
      slidesPerView: 4,
    },
  }}
/>
                    )
                }

            </div>
        </section>
    );
};

export default CourseByCity;