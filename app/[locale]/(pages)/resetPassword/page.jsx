import ResetPasswordForm from "./ResetPasswordForm";
import InfoPanel from "./InfoPanel";
import styles from "@/sass/pages/sign-In/login.module.scss";
import { SITE_URL, buildAlternates } from "@/lib/seoMeta";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        metadataBase: new URL(SITE_URL),
        title: "Reset Password",
        description: "Set a new password for your British Academy for Training & Development account.",
        alternates: { canonical: `/${locale}/resetPassword`, ...buildAlternates("/resetPassword") },
    };
}

const ResetPasswordPage = () => {
    return (
        <section className={styles.loginPage}>
            <div className={styles.grid}>
                <div className={styles.formSide}>
                    <ResetPasswordForm />
                </div>
                <div className={styles.panelSide}>
                    <InfoPanel />
                </div>
            </div>
        </section>
    );
};

export default ResetPasswordPage;
