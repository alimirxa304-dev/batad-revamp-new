import { ArrowLeft, ArrowRight, House } from "lucide-react"
import styles from "@/sass/pages/course-details/header.module.scss"
import stylesContainer from "@/sass/components/common/container.module.scss"
import { useTranslations } from "next-intl"

const NavigationBar = ({ currentStep = 1 }) => {
    const t = useTranslations('RegisterCourse');
    const progress = (currentStep / 3) * 100;

    return (
        <section className={styles.header}>
            <div className={stylesContainer.container}>
                <div className={styles.wrapper}>
                    <div className={styles.breadcrumb}>
                        <ArrowLeft color='#2F327D' size={20} />
                        <span>{t('backToCourses')}</span>
                    </div>
                    <span>|</span>
                    <House color='#4A5565' size={20} />
                    <ArrowRight color='#4A5565' size={20} />
                    <span>{t('coursesLabel')}</span>
                    <ArrowRight color='#4A5565' size={20} />
                    <span>{t('courseRegistrationLabel')}</span>
                </div>
            </div>
            <div 
                className={styles.progressBar} 
                style={{ width: `${progress}%` }} 
            />
        </section>
    )
}

export default NavigationBar