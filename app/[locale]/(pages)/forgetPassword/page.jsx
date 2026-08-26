import ForgetPasswordForm from "./ForgetPasswordForm";
import InfoPanel from "./InfoPanel";
import styles from "@/sass/pages/sign-In/login.module.scss";
import { SITE_URL, buildAlternates } from "@/lib/seoMeta";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        metadataBase: new URL(SITE_URL),
        title: "Forgot Password",
        description: "Reset your British Academy for Training & Development account password.",
        alternates: { canonical: `/${locale}/forgetPassword`, ...buildAlternates("/forgetPassword") },
    };
}

const ForgetPasswordPage = () => {
    return (
        <section className={styles.loginPage}>
            <div className={styles.grid}>
                <div className={styles.formSide}>
                    <ForgetPasswordForm />
                </div>
                <div className={styles.panelSide}>
                    <InfoPanel />
                </div>
            </div>
        </section>
    );
};

export default ForgetPasswordPage;
