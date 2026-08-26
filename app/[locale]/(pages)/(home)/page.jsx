import { getMeta } from "@/action/meta";
import MotionWrapper from "@/components/common/MotionWrapper";
import { cleanMeta, parseKeywords, buildAlternates } from "@/lib/seoMeta";
import styles from "@/sass/pages/home/home.module.scss";
import ChatAi from "./ChatAi";
import CourseByCity from "./CourseByCity";
import CoursesBySpecial from "./CoursesBySpecial";
import Customers from "./Customers";
import Hero from "./Hero";
import LastestPublication from "./LastestPublication";
import RequestCoures from "./RequestCoures";
import TeamWork from "./TeamWork";
import UpcomingCourses from "./UpcomingCourses";
import WhatIs from "./WhatIs";

export async function generateMetadata({ params }) {
    const { locale } = await params;

    let title;
    let description;
    let keywords;

    try {
        const res = await getMeta(locale, "home");
        const meta = res?.meta;
        if (meta) {
            title = cleanMeta(meta.title, { maxLength: 60 });
            description = cleanMeta(meta.description, { maxLength: 160 });
            keywords = parseKeywords(meta.keyword);
        }
    } catch (error) {
        console.error("Home metadata error:", error);
    }

    return {
        ...(title ? { title: { absolute: title } } : {}),
        ...(description ? { description } : {}),
        keywords,
        alternates: { canonical: `/${locale}`, ...buildAlternates("/") },
        openGraph: {
            type: "website",
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
            images: [{ url: "/og-image.png", width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            ...(title ? { title } : {}),
            ...(description ? { description } : {}),
            images: ["/og-image.png"],
        },
    };
}


const Home = () => {
  return (
    <div className={styles.home}>
      <Hero />
      <ChatAi />
      <div className={styles.mainContent}>
        <MotionWrapper>
          <UpcomingCourses />
        </MotionWrapper>
        <MotionWrapper>
          <CoursesBySpecial />
        </MotionWrapper>
        <MotionWrapper>
          <RequestCoures />
        </MotionWrapper>
        <MotionWrapper>
          <WhatIs />
        </MotionWrapper>
        <MotionWrapper>
          <CourseByCity />
        </MotionWrapper>
        <MotionWrapper>
          <LastestPublication />
        </MotionWrapper>
        <MotionWrapper>
          <TeamWork />
        </MotionWrapper>
        <MotionWrapper>
          <Customers />
        </MotionWrapper>
      </div>
    </div>
  );
};

export default Home;
