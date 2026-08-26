"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Stepper from '@/components/common/Stepper';
import CourseSummaryCard from './CourseSummaryCard';
import StepsForm from './StepsForm';
import CourseDetailsForm from './CourseDetailsForm';
import PaymentForm from './PaymentForm';
import SuccessPage from './SuccessPage';
import NavigationBar from '@/components/common/NavigationBar';
import MobileCourseHeader from './MobileCourseHeader';
import styles from '@/sass/pages/register-course/register-course.module.scss';
import stylesContainer from '@/sass/components/common/container.module.scss';
import useRegisterCourseStore from '@/store/useRegisterCourseStore';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

const RegisterCourse = () => {
    const t = useTranslations('RegisterCourse');
    const searchParams = useSearchParams();
    const course_id = searchParams.get('course_id');
    const preselectedDate = searchParams.get('date');
    const preselectedCityId = searchParams.get('city_id');
    const preselectedDurationId = searchParams.get('duration_id');
    const preselectedLanguage = searchParams.get('language');
    const [currentStep, setCurrentStep] = useState(1);
    const [regType, setRegType] = useState('individual');
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            course_date: preselectedDate || '',
            city_id: preselectedCityId ? Number(preselectedCityId) : '',
            duration_id: preselectedDurationId || '',
            language: preselectedLanguage?.toLowerCase() || 'english',
        }
    });
    const { handlePostRegisterCourse, isLoading, handleGetRegisterData, registerData ,handleGetCourseByIdData , course} = useRegisterCourseStore();
    console.log(course,'coures from register page')
    useEffect(() => {
        handleGetRegisterData();
        handleGetCourseByIdData(course_id)
    }, []);



const onSubmit = async (data) => {
  try {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const payload = {
        is_company: regType === 'company' ? 1 : 0,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        country_id: data.country || 282,
        course_id,
        lang: 1,
        course_date: data.course_date instanceof Date
          ? data.course_date.toISOString().split('T')[0]
          : data.course_date,
        duration_id: data.duration_id || 2,
        city_id: data.city_id || 65
      };

      if (regType === 'company') {
        payload.company_name = data.fullName;
        payload.participants = data.participants?.map(p => ({
          full_name: p.fullName,
          email: p.email,
          job_title: p.jobTitle,
          phone: p.phone,
          mobile: p.mobile
        }));
      }

      const res = await handlePostRegisterCourse(payload);
      if (res?.success) {
        toast.success(res?.message || t('successMsg'));
        setTimeout(() => setCurrentStep(4), 2000);
      } else {
        toast.error(res?.message || t('failMsg'));
      }
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || error?.message || t('errorMsg'));
  }
};

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(1, prev - 1));
    };

    return (
        <div className={styles.registerPage}>
            <NavigationBar currentStep={currentStep > 3 ? 3 : currentStep} />
            <div className={styles.mainContent}>
                <div className={stylesContainer.container}>
                    {currentStep <= 3 && <MobileCourseHeader course={course} />}
                    <div className={`${styles.content} ${currentStep === 4 ? styles.successLayout : ''}`}>
                        <div className={styles.formContent}>
                            {currentStep <= 3 && <Stepper currentStep={currentStep} />}

                            {currentStep === 1 ? (
                                <StepsForm
                                    handleSubmit={handleSubmit}
                                    onSubmit={onSubmit}
                                    errors={errors}
                                    register={register}
                                    control={control}
                                    setRegType={setRegType}
                                    regType={regType}
                                    countries={registerData?.countries}
                                    isLoading={isLoading}
                                />
                            ) : currentStep === 2 ? (
                                <CourseDetailsForm
                                    handleSubmit={handleSubmit}
                                    onSubmit={onSubmit}
                                    register={register}
                                    control={control}
                                    watch={watch}
                                    setValue={setValue}
                                    errors={errors}
                                    handleBack={handleBack}
                                    isLoading={isLoading}
                                    cities={registerData?.cities}
                                    durations={registerData?.durations}
                                    dates={course?.dates}
                                />
                            )
                                // ) : currentStep === 3 ? (
                                //     <PaymentForm
                                //         handleSubmit={handleSubmit}
                                //         onSubmit={onSubmit}
                                //         register={register}
                                //         errors={errors}
                                //         handleBack={handleBack}
                                //     />
                                // ) 

                                : (
                                    <SuccessPage />
                                )}
                        </div>
                        {currentStep <= 3 && <CourseSummaryCard course={course} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCourse;



