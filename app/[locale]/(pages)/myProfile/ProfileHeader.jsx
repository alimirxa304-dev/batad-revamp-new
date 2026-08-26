import { useEffect, useMemo } from "react";
import { MapPin, Pencil } from "lucide-react";
import styles from "@/sass/pages/my-profile/my-profile.module.scss";
import useCitiesStore from "@/store/useCitiesStore";
import Image from "next/image";
import { useTranslations } from "next-intl";

const ProfileHeader = ({ user }) => {
    const t = useTranslations('MyProfile');
    const { cities, handleGetCities } = useCitiesStore();

    useEffect(() => {
        if (cities.length === 0) {
            handleGetCities();
        }
    }, [cities.length, handleGetCities]);

    const countryName = useMemo(() => {
        if (!user?.country_id) return user?.country || t('notSpecified');
        const found = cities.find(c => c.id === user.country_id);
        return found ? found.name : (user?.country || t('notSpecified'));
    }, [cities, user?.country_id, user?.country]);

    return (
        <div className={styles.headerCard}>
            <div className={styles.banner} />

            <div className={styles.profileInfoRow}>
                <div className={styles.avatarWrapper}>
                    <div className={styles.avatar}>
                        {user?.image ? (
                            <Image src={user?.image} alt={user?.full_name} width={400} height={400} unoptimized />
                        ) : (
                            user?.initials
                        )}
                    </div>
                    {user?.isOnline && <span className={styles.onlineIndicator} />}
                </div>

                <div className={styles.userInfo}>
                    <h2>{user?.full_name}</h2>
                    <p className={styles.jobText}>
                        {user?.jobTitle} at {user?.company_name}
                    </p>
                    <span className={styles.locationText}>
                        <MapPin size={12} />
                        {countryName}
                    </span>
                </div>

                <button className={styles.editBtn}>
                    <Pencil size={14} />
                    {t('editProfile')}
                </button>
            </div>

            <div className={styles.statsDivider} />

            <div className={styles.statsRow}>
                {user?.stats?.map((stat) => (
                    <div key={stat.label} className={styles.statItem}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfileHeader;
