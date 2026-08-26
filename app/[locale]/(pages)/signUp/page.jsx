import RegisterForm from "./RegisterForm";
import InfoPanel from "./InfoPanel";
import styles from "@/sass/pages/sign-up/register.module.scss";
import { SITE_URL, buildAlternates } from "@/lib/seoMeta";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        metadataBase: new URL(SITE_URL),
        title: "Sign Up",
        description: "Create your British Academy for Training & Development account and start your professional journey today.",
        alternates: { canonical: `/${locale}/signUp`, ...buildAlternates("/signUp") },
    };
}

const RegisterPage = () => {
    return (
        <section className={styles.registerPage}>
            <div className={styles.grid}>
                <div className={styles.formSide}>
                    <RegisterForm />
                </div>
                <div className={styles.panelSide}>
                    <InfoPanel />
                </div>
            </div>
        </section>
    );
};

export default RegisterPage;
