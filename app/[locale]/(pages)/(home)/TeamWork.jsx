"use client"
import { useEffect } from "react"
import useTeamWorkStore from "@/store/useTeamWorkStore"
import { Mail, Phone } from "lucide-react"
import Title from "@/components/common/Title"
import GenericSlider from "@/components/common/GenericSlider"
import styleContainer from '@/sass/components/common/container.module.scss'
import styles from '@/sass/pages/home/team-work.module.scss'
import Skeleton from "@/components/ui/Skeleton"
import Image from "next/image"
import { useTranslations } from "next-intl"
const Card = ({ team }) => {
    console.log(team , 'team from home')
    return (
        <div className={styles.card}>
            <div className={styles.image}>
                <Image src={team.image} alt={team.name} width={300} height={300} />
            </div>

            <div className={styles.cardInfo}>
                <h3 className={styles.name}>{team.name}</h3>
                <p className={styles.position}>{team?.job}</p>
            </div>

            <div className={styles.hoverContent}>
                <div className={styles.hoverContentTop}>
                    <h3 className={styles.name}>{team.name}</h3>
                    <p className={styles.position}>{team?.job}</p>
                </div>
                <div className={styles.social}>
                    <a href={team.social?.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f" aria-hidden="true">
                        <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.70808 0.559082H5.03108C4.2898 0.559082 3.57888 0.853554 3.05472 1.37772C2.53055 1.90188 2.23608 2.6128 2.23608 3.35408V5.03108H0.559082V7.26708H2.23608V11.7391H4.47208V7.26708H6.14908L6.70808 5.03108H4.47208V3.35408C4.47208 3.20583 4.53098 3.06364 4.63581 2.95881C4.74064 2.85398 4.88283 2.79508 5.03108 2.79508H6.70808V0.559082Z" stroke="#1E2749" strokeWidth="1.118" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    </i>
                    </a>
                  
                    <a href={team?.social?.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter" aria-hidden="true">
                        <svg width="13" height="11" viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.7391 0.563462C11.7391 0.563462 11.3478 1.73736 10.6211 2.46406C11.5155 8.05406 5.36648 12.1348 0.559082 8.94846C1.78888 9.00436 3.01868 8.61306 3.91308 7.83046C1.11808 6.99196 -0.279418 3.69386 1.11808 1.12246C2.34788 2.57586 4.24848 3.41436 6.14908 3.35846C5.64598 1.01066 8.38508 -0.330938 10.0621 1.23426C10.677 1.23426 11.7391 0.563462 11.7391 0.563462Z" stroke="#1E2749" strokeWidth="1.118" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </i></a>
                    <a href={team?.social?.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="fab fa-linkedin-in" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_214_7963)">
                                <path d="M8.94384 4.47217C9.83338 4.47217 10.6865 4.82553 11.3155 5.45453C11.9445 6.08353 12.2978 6.93663 12.2978 7.82617V11.7392H10.0618V7.82617C10.0618 7.52966 9.94405 7.24529 9.73439 7.03562C9.52472 6.82596 9.24036 6.70817 8.94384 6.70817C8.64733 6.70817 8.36296 6.82596 8.1533 7.03562C7.94363 7.24529 7.82584 7.52966 7.82584 7.82617V11.7392H5.58984V7.82617C5.58984 6.93663 5.94321 6.08353 6.57221 5.45453C7.2012 4.82553 8.05431 4.47217 8.94384 4.47217Z" stroke="#1E2749" strokeWidth="1.118" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.35368 5.03076H1.11768V11.7388H3.35368V5.03076Z" stroke="#1E2749" strokeWidth="1.118" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.23568 3.35416C2.85313 3.35416 3.35368 2.85362 3.35368 2.23616C3.35368 1.61871 2.85313 1.11816 2.23568 1.11816C1.61822 1.11816 1.11768 1.61871 1.11768 2.23616C1.11768 2.85362 1.61822 3.35416 2.23568 3.35416Z" stroke="#1E2749" strokeWidth="1.118" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_214_7963">
                                    <rect width="13.416" height="13.416" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>


                    </i></a>
                    <a href={team?.social?.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_214_7968)">
                                <path d="M9.50316 1.11816H3.91316C2.36953 1.11816 1.11816 2.36953 1.11816 3.91316V9.50316C1.11816 11.0468 2.36953 12.2982 3.91316 12.2982H9.50316C11.0468 12.2982 12.2982 11.0468 12.2982 9.50316V3.91316C12.2982 2.36953 11.0468 1.11816 9.50316 1.11816Z" stroke="#1E2749" strokeWidth="1.118" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M8.94391 6.35626C9.0129 6.82149 8.93343 7.29662 8.71682 7.71408C8.50021 8.13154 8.15748 8.47007 7.73738 8.68152C7.31728 8.89297 6.8412 8.96656 6.37686 8.89185C5.91252 8.81713 5.48357 8.5979 5.15101 8.26533C4.81844 7.93277 4.59921 7.50382 4.52449 7.03948C4.44978 6.57514 4.52337 6.09906 4.73482 5.67896C4.94627 5.25886 5.2848 4.91613 5.70226 4.69952C6.11972 4.48291 6.59485 4.40344 7.06008 4.47243C7.53463 4.5428 7.97396 4.76393 8.31319 5.10315C8.65241 5.44238 8.87354 5.88171 8.94391 6.35626Z" stroke="#1E2749" strokeWidth="1.118" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9.78223 3.63379H9.78788" stroke="#1E2749" strokeWidth="1.118" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_214_7968">
                                    <rect width="13.416" height="13.416" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>


                    </i></a>

                </div>
                <hr />
                <div className={styles.contact}>
                    <p className={styles.contactInfo}>
                        <span className={styles.icon}>
                            <Phone size={11} color=" #364153" />

                        </span>
                      {team?.ssd}
                    </p>
                    <p className={styles.contactInfo}>
                        <span className={styles.icon}>
                            <Mail size={11} color=" #364153" />

                        </span>
                       {team?.email}
                    </p>

                </div>
            </div>
        </div>
    )
}
const TeamWork = () => {
         const t = useTranslations('team')

    const {teamWork,handleGetTeamWork,isLoading} = useTeamWorkStore();
    useEffect(() => {
        handleGetTeamWork();
    }, []);
    return (
        <section className={styles.teamWork}>
            <div className={styleContainer.container}>
                <Title title={t('title')} span={t('span')} subtitle={t('subtitle')} />
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
                            navId="teamwork"
                            items={teamWork}
                            renderSlide={(team) => <Card key={team.id} team={team} />}
                            spaceBetween={20}
                            breakpoints={{
                                0: {
                                    slidesPerView: 1.2,
                                    centeredSlides: true,
                                    centeredSlidesBounds: true,
                                },
                                576: {
                                    slidesPerView: 1.8,
                                    centeredSlides: false,
                                },
                                768: {
                                    slidesPerView: 2.5,
                                    centeredSlides: false,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                                1280: {
                                    slidesPerView: 4,
                                },
                            }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            showViewAll={false}
                            hidden={true}
                        />
                    )
                }
            </div>
        </section>
    )
}

export default TeamWork