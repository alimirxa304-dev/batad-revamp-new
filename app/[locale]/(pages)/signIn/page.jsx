import LoginForm from "./LoginForm";
import InfoPanel from "./InfoPanel";
import styles from "@/sass/pages/sign-In/login.module.scss";
import { SITE_URL, buildAlternates } from "@/lib/seoMeta";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        metadataBase: new URL(SITE_URL),
        title: "Sign In",
        description: "Sign in to your British Academy for Training & Development account to continue your learning journey.",
        alternates: { canonical: `/${locale}/signIn`, ...buildAlternates("/signIn") },
    };
}

const LoginPage = () => {
    return (
        <section className={styles.loginPage}>
            <div className={styles.grid}>
                <div className={styles.formSide}>
                    <LoginForm />
                </div>
                <div className={styles.panelSide}>
                    <InfoPanel />
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
