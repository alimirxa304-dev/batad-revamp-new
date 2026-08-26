"use client";
import { useEffect, useState } from "react";
import { Inbox, Mail, Calendar, Clock, CheckCheck } from "lucide-react";
import styles from "@/sass/pages/my-profile/my-profile.module.scss";
import useUserProfileStore from "@/store/useUserProfileStore";
import { useTranslations } from "next-intl";

// const initialMessages = [
//     {
//         id: 1,
//         type: "announcement",
//         title: "Welcome to British Academy!",
//         from: "British Academy Admin (admin)",
//         date: "2025-01-10",
//         isRead: true,
//     },
//     {
//         id: 2,
//         type: "announcement",
//         title: "New Module Available - Project Management",
//         from: "British Academy Admin (admin)",
//         date: "2025-01-10",
//         isRead: true,
//     },
//     {
//         id: 3,
//         type: "announcement",
//         title: "Your Digital Marketing Certificate is Ready!",
//         from: "British Academy Admin (admin)",
//         date: "2025-01-10",
//         isRead: false,
//     },
// ];

const Messages = () => {
    const t = useTranslations('MyProfile');
    const { userMessages, handleGetUserMessages, unreadNumberMessage, handleUnreadNumberMessage } = useUserProfileStore();
  
    useEffect(() => {
        handleGetUserMessages();
        handleUnreadNumberMessage();
    }, []);

    const markAsRead = (id) => {
        // You should probably call the store's markAsRead here
    };

    console.log(userMessages , 'user message')
    return (
        <div>
            <div className={styles.msgsHeader}>
                <h2>{t('messages.title')}</h2>
                <div className={styles.msgCount}>
                    <Mail size={14} />
                    <span>{userMessages?.length || 0} {t('messages.count')}</span>
                </div>
            </div>

            {(!userMessages || userMessages.length === 0) ? (
                <div className={styles.noMsgs}>
                    <Inbox size={40} />
                    <span>{t('messages.none')}</span>
                </div>
            ) : (
                <div className={styles.msgList}>
                    {userMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`${styles.msgCard} ${!msg.isRead ? styles.unread : ""}`}
                        >
                            <div className={styles.msgIconArea}>
                                <Inbox size={30} />
                            </div>

                            <div className={styles.msgContent}>
                                <span className={styles.msgBadge}>{msg.type}</span>

                                <h3 className={styles.msgTitle}>{msg.title}</h3>
                                <p className={styles.msgFrom}>{t('messages.from')} {msg.from}</p>

                                <div className={styles.msgMeta}>
                                    <span className={styles.msgMetaItem}>
                                        <Calendar size={12} />
                                        {t('messages.date')} {msg.date}
                                    </span>
                                    <span
                                        className={`${styles.msgMetaItem} ${
                                            msg.isRead ? styles.statusRead : styles.statusUnread
                                        }`}
                                    >
                                        <Clock size={12} />
                                        {t('messages.status')} {msg.isRead ? t('messages.read') : t('messages.unread')}
                                    </span>
                                </div>

                                <div className={styles.msgActions}>
                                    <button className={styles.btnViewMsg}>
                                        <Mail size={14} />
                                        {t('messages.view')}
                                    </button>
                                    <button
                                        className={`${styles.btnMarkRead} ${msg.isRead ? styles.alreadyRead : ""}`}
                                        onClick={() => !msg.isRead && markAsRead(msg.id)}
                                        disabled={msg.isRead}
                                    >
                                        <CheckCheck size={14} />
                                        {t('messages.markRead')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Messages;
