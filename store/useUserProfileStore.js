import { create } from "zustand";
import useLanguageStore from "./useLanguageStore";
import { getUnreadNumberMessage, getUserCourses, getUserMessages, getUserProfile } from "@/action/userProfile";

const useUserProfileStore = create((set) => ({
    userProfile: null,
    userCourses: [],
    userMessages: [],
    unreadNumberMessage: 0,
    isLoading: false,
    error: null,
    handleGetUserProfile: async () => {
        set({ isLoading: true, error: null });
        try {
            const locale = useLanguageStore.getState().locale;

            const data = await getUserProfile(locale);

            if (!data?.success) {
                set({ error: data?.message || "Failed to load profile", isLoading: false });
                return;
            }

            set({
                userProfile: data?.data ?? null,
                isLoading: false,
            });
        } catch (error) {
            console.error("[useUserProfileStore]", error);
            set({ error: "Failed to load profile", isLoading: false });
        }
    },
    clearUserProfile: () => set({ userProfile: null, error: null }),

    handleGetUserCourses: async () => {
        set({ isLoading: true, error: null });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getUserCourses(locale);
            if (!data?.success) {
                set({ error: data?.message || "Failed to load enrolled courses", isLoading: false });
                return;
            }
            set({
                userCourses: data?.data ?? [],
                isLoading: false,
            });
        } catch (error) {
            console.error("[useUserProfileStore] getEnrolledCourses", error);
            set({ error: "Failed to load enrolled courses", isLoading: false });
        }
    },
    // handleGetCertificates: async () => {
    //     set({ isLoading: true, error: null });
    //     try {
    //         const locale = useLanguageStore.getState().locale;
    //         const data = await getUserCourses(locale);
    //         if (!data?.success) {
    //             set({ error: data?.message || "Failed to load enrolled courses", isLoading: false });
    //             return;
    //         }
    //         set({
    //             userCourses: data?.data ?? [],
    //             isLoading: false,
    //         });
    //     } catch (error) {
    //         console.error("[useUserProfileStore] getEnrolledCourses", error);
    //         set({ error: "Failed to load enrolled courses", isLoading: false });
    //     }
    // },

    handleGetUserMessages: async () => {
        set({ isLoading: true, error: null });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getUserMessages(locale);
            if (!data?.success) {
                set({ error: data?.message || "Failed to load enrolled courses", isLoading: false });
                return;
            }
            set({
                userMessages: data?.messages ?? [],
                isLoading: false,
            });
        } catch (error) {
            console.error("[useUserProfileStore] getEnrolledCourses", error);
            set({ error: "Failed to load enrolled courses", isLoading: false });
        }
    },
    handleUnreadNumberMessage: async () => {
        set({ isLoading: true, error: null });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getUnreadNumberMessage(locale);
            if (!data?.success) {
                set({ error: data?.message || "Failed to load enrolled courses", isLoading: false });
                return;
            }
            set({
                unreadNumberMessage: data?.data ?? 0,
                isLoading: false,
            });
        } catch (error) {
            console.error("[useUserProfileStore] getEnrolledCourses", error);
            set({ error: "Failed to load enrolled courses", isLoading: false });
        }
    },

    handleMarkMessageAsRead: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await markMessageAsRead(id, locale);
            if (!data?.success) {
                set({ error: data?.message || "Failed to mark message as read", isLoading: false });
                return;
            }
            set({
                unreadNumberMessage: data?.data ?? 0,
                isLoading: false,
            });
        } catch (error) {
            console.error("[useUserProfileStore] markMessageAsRead", error);
            set({ error: "Failed to mark message as read", isLoading: false });
        }
    },
    handleMarkAllMessagesAsRead: async () => {
        set({ isLoading: true, error: null });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await markAllMessagesAsRead(locale);
            if (!data?.success) {
                set({ error: data?.message || "Failed to mark all messages as read", isLoading: false });
                return;
            }
            set({
                unreadNumberMessage: data?.data ?? 0,
                isLoading: false,
            });
        } catch (error) {
            console.error("[useUserProfileStore] markAllMessagesAsRead", error);
            set({ error: "Failed to mark all messages as read", isLoading: false });
        }
    },

}));

export default useUserProfileStore;