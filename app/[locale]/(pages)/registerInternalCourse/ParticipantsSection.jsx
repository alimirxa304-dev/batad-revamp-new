"use client";
import React from 'react';
import { Users, Plus, X } from 'lucide-react';
import { useFieldArray } from 'react-hook-form';
import styles from '@/sass/pages/request-course/form.module.scss';
import { useTranslations } from 'next-intl';

const ParticipantsSection = ({ control, register, errors }) => {
    const t = useTranslations('RegisterInternal');
    const { fields, append, remove } = useFieldArray({ control, name: "participants" });

    return (
        <div className={styles.participantsSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.titleWithBadge}>
                    <div className={styles.sectionTitle}>
                        <Users color='#C9302C' size={20} /> {t('participants')}
                    </div>
                    <span className={styles.participantBadge}>{fields.length} {t('participantLabel')}</span>
                </div>
                <p className={styles.sectionSubtitle}>{t('participantsHint')}</p>
            </div>

            <div className={styles.participantsList}>
                {fields.map((field, index) => (
                    <div key={field.id} className={styles.participantCard}>
                        <div className={styles.participantCardHeader}>
                            <h4>{t('participantLabel')} {index + 1}</h4>
                            {fields.length > 1 && (
                                <button type="button" onClick={() => remove(index)} className={styles.removeBtn}>
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <div className={styles.participantFields}>
                            <div className={styles.inputGroup}>
                                <label>{t('fullName')}</label>
                                <div className={styles.inputWrapper}>
                                    <input type="text" placeholder={t('fullName')}
                                        {...register(`participants.${index}.fullName`)} />
                                </div>
                            </div>

                            <div className={styles.fieldRow}>
                                <div className={styles.inputGroup}>
                                    <label>{t('email')}</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="email" placeholder="participant@company.com"
                                            {...register(`participants.${index}.email`)} />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>{t('jobTitle')}</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="text" placeholder={t('jobTitle')}
                                            {...register(`participants.${index}.jobTitle`)} />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.fieldRow}>
                                <div className={styles.inputGroup}>
                                    <label>{t('phone')}</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="tel" placeholder="+1 (555) 000-0000"
                                            {...register(`participants.${index}.phone`)} />
                                    </div>
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>{t('mobile')}</label>
                                    <div className={styles.inputWrapper}>
                                        <input type="tel" placeholder="+1 (555) 000-0000"
                                            {...register(`participants.${index}.mobile`)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button type="button" className={styles.addParticipantBtn}
                onClick={() => append({ fullName: '', email: '', jobTitle: '', phone: '', mobile: '' })}>
                <Plus size={18} /> {t('addParticipant')}
            </button>
        </div>
    );
};

export default ParticipantsSection;
