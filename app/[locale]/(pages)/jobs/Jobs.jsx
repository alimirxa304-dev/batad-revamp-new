'use client'

import Header from "./Header";
import Filter from "./Filter";
import JobCard from "./JobCard";
import styles from "@/sass/pages/jobs/jobs.module.scss";
import stylesContainer from "@/sass/components/common/container.module.scss";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useJobsStore from "@/store/useJobsStore";
import Skeleton from "@/components/ui/Skeleton";
import NoData from "@/components/common/NoData";
import { useTranslations } from "next-intl";

const Jobs = () => {
  const { handleGetJobs, jobs, isLoading } = useJobsStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations()

  useEffect(() => {
    const paramsString = searchParams.toString();
    handleGetJobs(paramsString ? `?${paramsString}` : "");
  }, [searchParams]);

  const updateFilter = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    const entries = Array.isArray(updates) ? updates : [updates];

    entries.forEach(({ key, value }) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("cursor");

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className={styles.jobs}>
      <Header updateFilter={updateFilter} />
      <div className={styles.mainContent}>
        <Filter updateFilter={updateFilter} />
        <div className={stylesContainer.container}>
          <div className={styles.jobsCards}>
            {
              isLoading
                ? [1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} type="card" height="280px" />
                ))
                : jobs?.length > 0 ? (
                  jobs?.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))
                ) : (
                  <div className={styles.noCourses}>
                    <NoData message='No Data found'/>
                  </div>
                )
            }
          </div>
        </div>


      </div>
    </div>
  )
}


export default Jobs