'use client'
import { useEffect, useRef, useState } from "react";
import Title from "@/components/common/Title";
import UpcomingCouresCard from "@/components/ui/UpcomingCouresCard";
import GenericSlider from "@/components/common/GenericSlider";
import stylesContainer from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/home/upcoming-coures.module.scss";
import useCoursesStore from "@/store/useCoursesStore";
import Skeleton from "@/components/ui/Skeleton";
import { useTranslations, useLocale } from "next-intl";

const UpcomingCourses = () => {
    const t = useTranslations('UpcomingCourses');
    const locale = useLocale();
    const swiperRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {handleGetCourses,data,isLoading} = useCoursesStore();

// const t = useTranslations('upcoming-course');
    useEffect(() => {
        handleGetCourses();
    }, []);
    return (
        <div>
            <div className={stylesContainer.container}>
                <Title title={t('title')} span={t('titleSpan')} subtitle={t('subtitle')} />
             {
                isLoading ? (
                  <div className={styles.loadingRow}>
                      <Skeleton type="card" className={styles.skeletonCard} />
                      <Skeleton type="card" className={styles.skeletonCard} />
                      <Skeleton type="card" className={styles.skeletonCard} />
                      <Skeleton type="card" className={styles.skeletonCard} />
                    </div>
                ) : (
                    <div className={styles.sliderScope}>
                    <GenericSlider
                        navId="courses"
                        swiperRef={swiperRef}
                        pauseAutoplay={isModalOpen}
                        items={data?.courses}
                        renderSlide={(course, index) => (
                            <div className={styles.slide}>
                                <div className={styles.slideCard}>

                                        <UpcomingCouresCard course={course}
                                            slideIndex={index}
                                            swiperRef={swiperRef}
                                            locale={locale}
                                            onModalOpen={() => setIsModalOpen(true)}
                                            onModalClose={() => setIsModalOpen(false)} isLoading={isLoading}/>

                                </div>
                            </div>
                        )}
                        breakpoints={{
                            0:{
                                slidesPerView:1.12,
                                centeredSlides:false,
                            },
                            768: {
                                slidesPerView: 2.2,
                                centeredSlides:false,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                            1200: {
                                slidesPerView: 4,
                            }
                        }}
                        autoplay={false}
                        pauseOnMouseEnter={true}
                        spaceBetween={20}
                        showViewAll={true}
                        viewAllLink="/courses"
                    />
                    </div>
                )
             }

            </div>
        </div>
    );
};

export default UpcomingCourses;