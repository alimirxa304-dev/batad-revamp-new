"use client";
import { useState } from "react";
import { User, BookOpen, Award, Mail } from "lucide-react";
import PersonalInfo from "./PersonalInfo";
import MyCourses from "./MyCourses";
import Certificates from "./Certificates";
import Messages from "./Messages";
import styles from "@/sass/pages/my-profile/my-profile.module.scss";
import { useTranslations } from "next-intl";

const ProfileTabs = ({user}) => {
    const [activeTab, setActiveTab] = useState("personal");
    const t = useTranslations('MyProfile');
    console.log(user , 'user from tab')

    const tabs = [
        { id: "personal",      label: t('tabs.personalInfo'), icon: User     },
        { id: "courses",       label: t('tabs.myCourses'),    icon: BookOpen },
        { id: "certificates",  label: t('tabs.certificates'), icon: Award    },
        { id: "messages",      label: t('tabs.messages'),     icon: Mail     },
    ];
    

    return (
        <div>
            <nav className={styles.tabsNav}>
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        className={`${styles.tabBtn} ${activeTab === id ? styles.activeTab : ""}`}
                        onClick={() => setActiveTab(id)}
                    >
                        <Icon size={16} />
                        <span className={styles.tabLabel}>{label}</span>
                    </button>
                ))}
            </nav>

            <div className={styles.contentCard}>
                {activeTab === "personal"     && <PersonalInfo user={user} />}
                {activeTab === "courses"      && <MyCourses />}
                {activeTab === "certificates" && <Certificates />}
                {activeTab === "messages"     && <Messages />}
            </div>
        </div>
    );
};

export default ProfileTabs;
