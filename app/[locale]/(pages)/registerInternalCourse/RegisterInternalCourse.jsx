"use client";
import DateInput from '@/components/common/DateInput';
import DropdownMenuCustom from '@/components/common/DropdownMenu';
import containerStyles from '@/sass/components/common/container.module.scss';
import headerStyles from '@/sass/pages/course-details/header.module.scss';
import formStyles from '@/sass/pages/request-course/form.module.scss';
import pageStyles from '@/sass/pages/request-course/request-course.module.scss';
import { ArrowLeft, ArrowRight, ChevronDown, House, Users } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import RegistrationTypeToggle from '../registerCourse/RegistrationTypeToggle';
import InternalCourseSidebar from './InternalCourseSidebar';
import ParticipantsSection from './ParticipantsSection';
import NavgationBar from './NavgationBar';
import useRegisterCourseStore from '@/store/useRegisterCourseStore';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

const RegisterInternalCourse = () => {
    const t = useTranslations('RegisterInternal');
    const searchParams = useSearchParams();
    const [regType, setRegType] = useState('individual');
    const { handlePostRegisterCourse, isLoading, handleGetRegisterData, registerData } = useRegisterCourseStore();


    console.log(registerData, "registerData?.categories");
    console.log(registerData?.categories?.specializations, "registerData?.categories?.specializations");
    const lang = [
        { label: t('langEnglish'), value: 1 },
        { label: t('langArabic'), value: 0 },
    ];

    const FALLBACK_DURATIONS = [
        { label: '1 Day', value: 1 },
        { label: '2 Days', value: 2 },
        { label: '3 Days', value: 3 },
        { label: '5 Days', value: 5 },
        { label: '1 Week', value: 7 },
        { label: '2 Weeks', value: 14 },
    ];

    const durationOptions = registerData?.durations?.length
        ? registerData.durations.map((item) => ({ label: item.name, value: item.id }))
        : FALLBACK_DURATIONS;


    const { register, handleSubmit, control, formState: { errors }, watch, setValue, reset } = useForm({
        defaultValues: {
            registrationType: 'individual',
            fullName: '',
            email: '',
            phone: '',
            participants: [{ fullName: '', email: '', jobTitle: '', phone: '', mobile: '' }]
        }
    });

    // Handle pre-filling from search params
    useEffect(() => {
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const mobile = searchParams.get('mobile');
        const courseId = searchParams.get('course_id');
        const courseName = searchParams.get('course_name');

        if (name) setValue('fullName', name);
        if (email) setValue('email', email);
        if (mobile) setValue('phone', mobile);

        if (courseId) {
            const numericId = Number(courseId);
            setValue('course_id', Number.isNaN(numericId) ? courseId : numericId);
        }
        if (courseName) {
            setValue('specific_course', courseName);
        }
    }, [searchParams, setValue]);

    const onInvalid = (validationErrors) => {
        const firstKey = Object.keys(validationErrors)[0];
        const firstMsg = validationErrors[firstKey]?.message || `Please fill the "${firstKey}" field`;
        toast.error(firstMsg);
    };

    const onSubmit = async (data) => {
        try {

            const payload = {
                is_company: regType === 'company' ? 1 : 0,
                full_name: data.fullName,
                email: data.email,
                phone: data.phone,
                country_id: data.country,
                course_id: data.course_id,
                lang: data.lang,
                course_date: data.date instanceof Date
                    ? data.date.toISOString().split('T')[0]
                    : data.date,
                city_id: data.city_id,
                specific_course: data.specific_course,
            };

            if (data.duration_id) {
                payload.duration_id = data.duration_id;
            }

            if (regType === 'company') {
                payload.company_name = data.companyName;
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
                reset();
            } else {
                const errorMessages = res?.errors
                    ? Object.values(res.errors).flat()
                    : [];
                if (errorMessages.length) {
                    errorMessages.forEach((msg) => toast.error(msg));
                } else {
                    toast.error(res?.message || t('failMsg'));
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || t('errorMsg'));
        }
    };

    useEffect(() => {
        handleGetRegisterData()
    }, [])


    const selectedCategoryId = watch('category_id');
const selectedSpecialisationId = watch('specialisation_id');
    const selectedCategory = useMemo(() => {
        return registerData?.categories?.find((cat) => cat.id === selectedCategoryId);
    }, [registerData, selectedCategoryId]);
    const specialisationOptions = useMemo(() => {
        return selectedCategory?.specializations?.map((item) => ({
            label: item.name,
            value: item.id,
        })) || [];
    }, [selectedCategory]);

    const selectedSpecialisation = useMemo(() => {
        return selectedCategory?.specializations?.find((spec) => spec.id === selectedSpecialisationId);
    }, [selectedCategory, selectedSpecialisationId]);

    console.log(selectedSpecialisation , 'spec')

    const courseOptions = useMemo(() => {
        return selectedSpecialisation?.courses?.map((item) => ({
            label: item.name,
            value: item.id,
        })) || [];
    }, [selectedSpecialisation]);

    console.log(courseOptions ,'opetions')
    return (

        <div>
            <NavgationBar />
            <div className={pageStyles.mainContent}>
                <div className={containerStyles.container}>
                    <div className={pageStyles.content}>
                        <div className={formStyles.formContent}>
                            <div className={formStyles.formCard}>
                                <div className={formStyles.formHeader}>
                                    <h2>Request a course</h2>
                                    <p className={formStyles.subtitle}>Tell us about yourself to get started</p>
                                </div>

                                <div className={formStyles.registrationTypeSection}>
                                    <div className={formStyles.sectionTitle}>
                                        <Users color='#C9302C' size={20} /> {t('registrationType')} *
                                    </div>
                                    <RegistrationTypeToggle
                                        value={regType}
                                        onChange={(val) => {
                                            setRegType(val);
                                            setValue('registrationType', val);
                                        }}
                                    />
                                </div>

                                <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
                                    {/* <div className={formStyles.sectionTitle}>
                                        <Users color='#C9302C' size={20} /> {t('contactInfo')} *
                                    </div> */}
                                    <div className={pageStyles.formGrid} style={{ marginBottom: '20px' }}>
                                        <div className={formStyles.inputGroup} style={{ marginBottom: '24px' }}>
                                            <label>Full Name <span>*</span></label>
                                            <div className={formStyles.inputWrapper}>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    {...register("fullName", { required: "Full name is required" })}
                                                />
                                            </div>
                                            {errors.fullName && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.fullName.message}</span>}
                                        </div>

                                        {regType === 'company' && (
                                            <div className={formStyles.inputGroup} style={{ marginBottom: '24px' }}>
                                                <label>Company Name <span>*</span></label>
                                                <div className={formStyles.inputWrapper}>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter your company name"
                                                        {...register("companyName", { required: "Company name is required" })}
                                                    />
                                                </div>
                                                {errors.companyName && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.companyName.message}</span>}
                                            </div>
                                        )}

                                        <div className={formStyles.special}>
                                            <div className={formStyles.inputGroup}>
                                                <label>Email Address <span>*</span></label>
                                                <div className={formStyles.inputWrapper}>
                                                    <input
                                                        type="email"
                                                        placeholder="email@example.com"
                                                        {...register("email", {
                                                            required: "Email is required",
                                                            pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" }
                                                        })}
                                                    />
                                                </div>
                                                {errors.email && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.email.message}</span>}
                                            </div>
                                            <div className={formStyles.inputGroup}>
                                                <label>Phone Number <span>*</span></label>
                                                <div className={formStyles.inputWrapper}>
                                                    <input
                                                        type="tel"
                                                        placeholder="Enter your phone number"
                                                        {...register("phone", { required: "Phone number is required" })}
                                                    />
                                                </div>
                                                {errors.phone && <span style={{ color: '#EF4444', fontSize: '12px' }}>{errors.phone.message}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className={formStyles.sectionTitle} style={{ marginTop: '20px' }}>
                                        <Users color='#C9302C' size={20} /> Course Details *
                                    </div> */}
                                    <div className={pageStyles.formGrid}>
                                        <div className={formStyles.inputGroup} style={{ marginBottom: '24px' }}>
                                            <label>Category <span>*</span></label>
                                            <div className={formStyles.inputWrapper}>

                                                <Controller
                                                    name="category_id"
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <DropdownMenuCustom
                                                            label="Select your category"
                                                            options={registerData?.categories?.map((item) => ({

                                                                label: item.name,
                                                                value: item.id,

                                                            }))}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            icon={<ChevronDown size={14} />}
                                                        />
                                                    )}
                                                />

                                            </div>
                                            {errors.category && <span style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>This field is required</span>}
                                        </div>


                                        <div className={formStyles.special}>
                                            <div className={formStyles.inputGroup}>
                                                <label>Specialisation <span>*</span></label>
                                                <div className={formStyles.inputWrapper}>
                                                   

                                                    <Controller
                                                        name="specialisation_id"
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <DropdownMenuCustom
                                                                label="Please Selected from the list"
                                                                options={specialisationOptions}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                icon={<ChevronDown size={14} />}
                                                            />
                                                        )}

                                                    />

      
                                                </div>
                                                                                                  {!selectedCategoryId && (
        <span style={{ color: '#94A3B8', fontSize: '12px' }}>
            Please select a category first
        </span>
    )}
                                            </div>
                                            <div className={formStyles.inputGroup}>
                                                <label>Course <span>*</span></label>
                                                <div className={formStyles.inputWrapper}>



                                                    <Controller
                                                        name="course_id"
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <DropdownMenuCustom
                                                                label="Please Selected from the list"
                                                                options={courseOptions}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                icon={<ChevronDown size={14} />}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                                                                  {!selectedCategoryId && (
        <span style={{ color: '#94A3B8', fontSize: '12px' }}>
            Please select a category and specialization first
        </span>
    )}
                                            </div>
                                        </div>

                                        <div className={formStyles.special}>
                                            <div className={formStyles.inputGroup}>
                                                <label>Country <span>*</span></label>
                                                <div className={formStyles.inputWrapper}>
                                                    <Controller
                                                        name="country"
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <DropdownMenuCustom
                                                                label="Please Selected from the list"
                                                                options={registerData?.countries?.map((item) => ({
                                                                    label: item.name,
                                                                    value: item.id,
                                                                }))}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                icon={<ChevronDown size={14} />}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className={formStyles.inputGroup}>
                                                <label>City <span>*</span></label>
                                                <div className={formStyles.inputWrapper}>

                                                    <Controller
                                                        name="city_id"
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <DropdownMenuCustom
                                                                label="Please Selected from the list"
                                                                options={registerData?.cities?.map((item) => (
                                                                    {
                                                                        label: item.name,
                                                                        value: item.id,
                                                                    }
                                                                ))}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                icon={<ChevronDown size={14} />}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={formStyles.inputGroup} style={{ marginBottom: '24px' }}>
                                            <label>Language <span>*</span></label>
                                            <div className={formStyles.inputWrapper}>
                                                <Controller
                                                    name="lang"
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <DropdownMenuCustom
                                                            label="Please Selected from the list"
                                                            options={lang}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            icon={<ChevronDown size={14} />}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className={formStyles.inputGroup} style={{ marginBottom: '24px' }}>
                                            <label>{t('attendees')} <span>*</span></label>
                                            <div className={formStyles.inputWrapper}>

                                                <Controller
                                                    name="attendees"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <DropdownMenuCustom
                                                            label="Please Selected from the list"
                                                            options={['1-5', '6-10', '10+']}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            icon={<ChevronDown size={14} />}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className={formStyles.special}>
                                            <div className={formStyles.inputGroup}>
                                                <label>Duration <span>*</span></label>
                                                <div className={formStyles.inputWrapper}>

                                                    <Controller
                                                        name="duration_id"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <DropdownMenuCustom
                                                                label="Please Selected from the list"
                                                                options={durationOptions}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                icon={<ChevronDown size={14} />}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className={formStyles.inputGroup} style={{ marginBottom: '24px' }}>
                                                <label>Date <span>*</span></label>
                                                <div className={formStyles.inputWrapper}>
                                                    <Controller
                                                        name="date"
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <DateInput
                                                                selected={field.value}
                                                                onChange={field.onChange}
                                                                placeholder="DD / MM / YYYY"
                                                                className={pageStyles.datePickerInput}
                                                            />
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={formStyles.inputGroup} style={{ marginBottom: '24px' }}>
                                            <label>{t('specificCourse')} <span>*</span></label>
                                            <div className={formStyles.inputWrapper}>
                                                <textarea
                                                    placeholder="Tell us about your specific course requirements..."
                                                    {...register("specific_course", { required: true })}
                                                    style={{ width: '100%', minHeight: '120px', padding: '12px 16px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '14px', resize: 'vertical', outline: 'none' }}
                                                />
                                            </div>
                                        </div>

                                        {
                                            regType === 'company' && (
                                                <ParticipantsSection control={control} register={register} errors={errors} />

                                            )
                                        }


                                        <div className={formStyles.footerActions}>
                                            <button type="submit" className={formStyles.btnContinue}>
                                                {
                                                    isLoading ? t('loading') : t('submit')
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className={pageStyles.sidebar}>
                            <InternalCourseSidebar />
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default RegisterInternalCourse;
