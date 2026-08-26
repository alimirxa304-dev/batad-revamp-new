'use client'
import container from "@/sass/components/common/container.module.scss";
import styles from "@/sass/pages/my-profile/my-profile.module.scss";
import useAuthStore from "@/store/useAuthStore";
import useUserProfileStore from "@/store/useUserProfileStore";
import { useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";

const ProfilePage = () => {

    const { handleGetUserProfile, userProfile } = useUserProfileStore();
    const { member } = useAuthStore();


    useEffect(() => {
        handleGetUserProfile();

    }, []);

    

    return (
        <section className={styles.profilePage}>
            <div className={container.container}>
                <ProfileHeader user={userProfile?.member} />
                <ProfileTabs  user={userProfile?.member} />
            </div>
        </section>
    );
};

export default ProfilePage;
