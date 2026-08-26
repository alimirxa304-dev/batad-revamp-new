'use client'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation ,Autoplay} from "swiper/modules";
import "swiper/css";
import styles from '@/sass/components/common/generic-slider.module.scss'
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function GenericSlider({
    items = [],
    renderSlide,
    slidesPerView,
    spaceBetween,
    showViewAll = false,
    viewAllLink = "/courses",
    breakpoints,
    navId,
    centeredSlides,
    pauseAutoplay, 
    autoplay,
    swiperRef: externalRef,
    hidden
}) {
    const t = useTranslations();
    const prevSel = `[data-prev="${navId}"]`;
    const nextSel = `[data-next="${navId}"]`;
    const internalRef = useRef(null);
const swiperRef = externalRef ?? internalRef;

 
     useEffect(() => {
        if (!swiperRef.current || !autoplay) return;
        if (pauseAutoplay) {
            swiperRef.current.autoplay.stop();
        } else {
            swiperRef.current.autoplay.start();
        }
    }, [pauseAutoplay, autoplay]);

    const {locale} = useParams();
    return (
        <div className={styles.genericSlider}>

        <div className={styles.sliderTrack}>
        {
            !hidden && (
                <>
                <button data-prev={navId} className={styles.sliderPrev} aria-label="Previous slide" type="button">
                <svg width="28" height="28" viewBox="0 0 9 15" fill="none" aria-hidden="true" focusable="false">
                    <path d="M8 1L1 7.5L8 14" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
                </>
            )
        }

            <Swiper
             onSwiper={(swiper) => (swiperRef.current = swiper)}
                modules={[Navigation,Autoplay]}
               navigation={{
                    prevEl: prevSel,
                    nextEl: nextSel,
                }}
                 centeredSlides={centeredSlides}
              autoplay={autoplay}
                spaceBetween={spaceBetween}
                slidesPerView={slidesPerView}
                breakpoints={breakpoints }
            >
                {items.map((item, index) => (
                    <SwiperSlide key={item.id ?? index}>
                       {renderSlide(item, index)}
                    </SwiperSlide>
                ))}

            </Swiper>
{
    !hidden && (
        <>
        <button data-next={navId} className={styles.sliderNext} aria-label="Next slide" type="button">
                <svg width="28" height="28" viewBox="0 0 9 15" fill="none" aria-hidden="true" focusable="false">
                    <path d="M1 1L8 7.5L1 14" stroke="currentColor" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </>
    )
}
        </div>

            {showViewAll && (
                <div className={styles.viewAll}>
                    <Link href={`/${locale}/search_course`}>
                        {t('viewAllCourses')} <ArrowRight color='#1E2749' size={14} />
                    </Link>
                </div>
            )}
        </div>
    );
}