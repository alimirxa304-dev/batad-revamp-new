"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  ArrowRight,
  Award,
  Bookmark,
  Briefcase,
  DollarSign,
  Heart,
  MapPin,
  Palmtree,
  X,
} from "lucide-react";
import styles from "@/sass/pages/jobs/job-details-modal.module.scss";
import { useTranslations } from "next-intl";
import useJobsStore from "@/store/useJobsStore";
import { useEffect } from "react";
import Image from "next/image";
import Skeleton from "@/components/ui/Skeleton";

const BENEFIT_ICONS = {
  salary: DollarSign,
  health: Heart,
  remote: Palmtree,
  growth: Briefcase,
};

const JobDetailsForm = ({ slug, onApplyNow }) => {
  const t = useTranslations('Jobs');

  const {handleGetJobBySlug,job,isJobLoading} = useJobsStore();

  useEffect(() => {
    handleGetJobBySlug(slug)
  } , [slug])

  if (isJobLoading) {
    return (
      <>
        <header className={styles.header}>
          <div className={styles.headerMain}>
            <span className={styles.logo} aria-hidden>
              <Skeleton type="avatar" width={50} height={50} />
            </span>
            <div className={styles.headerText}>
              <Dialog.Title className={styles.title}>
                <Skeleton type="title" width="220px" />
              </Dialog.Title>
              <Dialog.Description className={styles?.company}>
                <Skeleton type="text" width="140px" />
              </Dialog.Description>
            </div>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              className={styles.closeBtn}
              aria-label="Close job details"
            >
              <X size={18} />
            </button>
          </Dialog.Close>
        </header>

        <div className={styles.quickInfo}>
          <Skeleton type="text" width="120px" />
          <Skeleton type="text" width="120px" />
          <Skeleton type="text" width="120px" />
        </div>

        <div className={styles.body}>
          <section>
            <Skeleton type="title" width="160px" />
            <Skeleton type="text" count={3} />
          </section>
          <section>
            <Skeleton type="title" width="160px" />
            <Skeleton type="text" count={2} />
          </section>
        </div>
      </>
    );
  }
  const benefits = job?.benefits?.map((benefit) => {
    const Icon = BENEFIT_ICONS[benefit.iconKey] ?? Briefcase;
    return { ...benefit, Icon };
  });


  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerMain}>
          <span className={styles.logo} aria-hidden>
            <Image src={job?.company?.image} alt="Company Logo" width={50} height={50} />
          </span>
          <div className={styles.headerText}>
            <Dialog.Title className={styles.title}>{job?.name}</Dialog.Title>
            <Dialog.Description className={styles?.company}>
              {job?.company?.name}
            </Dialog.Description>
            <div className={styles.tags}>
                <span className={styles.tag}>
                  {job?.type}
                </span>
                  <span className={styles.tag}>
                  {job?.team_min} - {job?.team_max}   {t('teamNumber')}
                </span>

            </div>
          </div>
        </div>
        <Dialog.Close asChild>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close job details"
          >
            <X size={18} />
          </button>
        </Dialog.Close>
      </header>

      <div className={styles.quickInfo}>
        <div className={styles.quickInfoItem}>
          <MapPin size={16} />
          <span>{job?.country} - {job?.city}</span>
        </div>
        <div className={styles.quickInfoItem}>
          <DollarSign size={16} />
          <span>{job?.salary_min} - {job?.salary_max}</span>
        </div>
        <div className={styles.quickInfoItem}>
          <Award size={16} />
          <span>{job?.experience_years}</span>
        </div>
      </div>

      <div className={styles.body}>
        <section>
          <h3 className={styles.sectionTitle}>{t('jobDescription')}</h3>
          <p className={styles.description}>{job?.description}</p>
        </section>

    {
      job?.requirements?.length > 0 && 
      <section>
        <h3 className={styles.sectionTitle}>{t('requirements')}</h3>
        <ul className={styles.requirements}>
          {job?.requirements?.map((item,index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    }
         {/* <section>
          <h3 className={styles.sectionTitle}>{t('responsibilities')}</h3>
          <div dangerousetInnerHTML={{ __html: job?.responsibilities }} /> */}
          {/* <ul className={styles.requirements}>
            {job?.responsibilities?.map((item,index) => (
              <li key={index}>{item}</li>
            ))}
          </ul> */}
        {/* </section> */}

      {
        job?.benefits?.length > 0 && 
        <section>
          <h3 className={styles.sectionTitle}>{t('benefits')}</h3>
          <div className={styles.benefitsGrid}>
            {benefits?.map((label,index) => (
              <div key={index} className={styles.benefitItem}>
                <Icon size={18} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>
      }
      </div>

      <footer className={styles.footer}>
        <button type="button" className={styles.bookmarkBtn}>
          <Bookmark size={18} />
          {t('bookmark')}
        </button>
        <button type="button" className={styles.applyBtn} onClick={onApplyNow}>
          {t('applyNow')}
          <ArrowRight size={18} />
        </button>
      </footer>
    </>
  );
};

export default JobDetailsForm;
