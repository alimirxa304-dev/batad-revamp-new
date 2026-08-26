"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ApplicationModal from "@/components/common/ApplicationModal";
import {
  ArrowRight,
  Award,
  Bookmark,
  Clock,
  DollarSign,
  MapPin,
} from "lucide-react";
import ApplyJobForm from "./ApplyJobForm";
import JobDetailsForm from "./JobDetailsForm";
import { useTranslations } from "next-intl";
import modalStyles from "@/sass/pages/jobs/job-details-modal.module.scss";
import styles from "@/sass/pages/jobs/jobs.module.scss";

const JobCard = ({ job }) => {
  const t = useTranslations('Jobs');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);

  const handleApplyNow = () => {
    setIsDetailsOpen(false);
    setIsApplyOpen(true);
  };

  return (
    <motion.div
      className={styles.jobCard}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{
        y: -10,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}

    >
      <div className={styles.cardHeader}>
        <span className={styles.jobType}>{job?.type}</span>
        <Bookmark color="#99A1AF" size={20} />
      </div>
      <div className={styles.jobTitle}>
        {/* <span>{job.logoLetter}</span> */}
        <p>
          <h2>{job.name}</h2>
          <span className={styles.companyName}>{job?.company?.name}</span>
        </p>
      </div>
      <div className={styles.jobInfo}>
        {job?.country && (
          job?.city && (
            <span>
              <MapPin />
              {job?.country} - {job?.city}
            </span>
          )
        )}


        <span className={styles.salary}>
          <DollarSign color="#1E2749" />
          {job?.salary_min} - {job?.salary_max}
        </span>
        {/* <span>
          <Clock />
          {job.postedAgo}
        </span> */}
      </div>
      {
        job?.experience_years && (
          <div className={styles.jobSkills}>
            <Award size={16} color="#99A1AF" />
            <span>{job?.experience_years}</span>
          </div>
        )
      }
      <button
        type="button"
        className={styles.viewBtn}
        onClick={() => setIsDetailsOpen(true)}
      >
        {t('viewDetails')} <ArrowRight size={16} />
      </button>

      <ApplicationModal
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        contentClassName={modalStyles.jobDetailsModal}
      >
        <JobDetailsForm slug={job?.slug} onApplyNow={handleApplyNow} />
      </ApplicationModal>

      <ApplicationModal open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <ApplyJobForm
          jobId={job.id}
          jobName={job.name}
          companyName={job?.company?.name}
          onClose={() => setIsApplyOpen(false)}
        />
      </ApplicationModal>

    </motion.div>

  );
};

export default JobCard;
