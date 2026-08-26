import { SITE_URL, buildAlternates } from "@/lib/seoMeta";
import Jobs from "./Jobs";
export async function generateMetadata({ params }) {
    const { locale } = await params;
    return {
        metadataBase: new URL(SITE_URL),
        title: "Careers",
        description: "Explore job opportunities at the British Academy for Training & Development and find a job that suits your interest & skills.",
        alternates: { canonical: `/${locale}/jobs`, ...buildAlternates("/jobs") },
    };
}

const JobsPage = () => {
  return (
  <Jobs />
  );
};

export default JobsPage;