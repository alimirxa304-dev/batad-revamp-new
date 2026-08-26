import { Lock, CheckCircle2, CircleCheckBig } from "lucide-react";
import styles from "@/sass/pages/sign-In/login.module.scss";

const features = [
    {
        title: "Expert Instructors",
        description: "Learn from industry professionals with years of experience",
    },
    {
        title: "Flexible Learning",
        description: "Study at your own pace with 24/7 access to course materials",
    },
    {
        title: "Certified Programs",
        description: "Earn recognized certifications to boost your career",
    },
];

const stats = [
    { value: "10K+", label: "Students" },
    { value: "500+", label: "Courses" },
    { value: "95%", label: "Satisfaction" },
];

const InfoPanel = () => {
    return (
        <div className={styles.infoPanel}>
            <div className={styles.infoPanelInner}>
                <div className={styles.lockIcon}>
                    <Lock size={24} color="#ffffff" />
                </div>

                <h2 className={styles.panelTitle}>Continue Your Learning</h2>

                <p className={styles.panelDesc}>
                    Access your courses, track your progress, and achieve your professional development goals.
                </p>

                <ul className={styles.featureList}>
                    {features.map((f) => (
                        <li key={f.title} className={styles.featureItem}>
                            <CircleCheckBig size={20} className={styles.checkIcon} />
                            <div className={styles.featureText}>
                                <strong>{f.title}</strong>
                                <span>{f.description}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className={styles.panelDivider} />

                <div className={styles.stats}>
                    {stats.map((s) => (
                        <div key={s.label} className={styles.statItem}>
                            <strong>{s.value}</strong>
                            <span>{s.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default InfoPanel;
