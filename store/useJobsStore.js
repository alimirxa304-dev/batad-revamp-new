import { applyToJob, getJobBySlug, getJobs } from "@/action/jobs";
import { create } from "zustand";
import useLanguageStore from "./useLanguageStore";

const useJobsStore = create((set, get) => ({
    jobs: [],
    job:{},
    hasMore: false,
    nextCursor: null,
    isLoading: true,
    isJobLoading: true,
    isApplying: false,
    applyError: null,

    handleGetJobs: async (queryParams = '') => {
        set({ isLoading: true });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getJobs(locale, queryParams);
            const d = data?.data;
            set({
                jobs: d?.items || [],
                hasMore: d?.has_more || false,
                nextCursor: d?.next_cursor || null,
                isLoading: false,
            });
        } catch(error) {
            set({ isLoading: false });
        }
    },

    handleLoadMore: async (queryParams = '') => {
        const { nextCursor, jobs } = get();
        if (!nextCursor) return;
        try {
            const locale = useLanguageStore.getState().locale;
            const separator = queryParams ? `${queryParams}&` : '?';
            const data = await getJobs(locale, `${separator}cursor=${nextCursor}`);
            const d = data?.data;
            set({
                jobs: [...jobs, ...(d?.jobs || [])],
                hasMore: d?.has_more || false,
                nextCursor: d?.next_cursor || null,
            });
        } catch {}
    },

    handleGetJobBySlug: async (slug) => {
        set({ isJobLoading: true });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getJobBySlug(locale, slug);
            const d = data?.data;
            set({
                job: d || {},
                isJobLoading: false,
            });
        } catch(error) {
            set({ isJobLoading: false });
            console.error('Failed to fetch job by slug' , error);
        }
    },

    handleApplyToJob: async (formData) => {
        set({ isApplying: true, applyError: null });
        try {
            const locale = useLanguageStore.getState().locale;
            const result = await applyToJob(locale, formData);
            if (!result?.success) {
                set({ applyError: result?.error || "Failed to submit application", isApplying: false });
                return result;
            }
            set({ isApplying: false });
            return result;
        } catch (error) {
            set({ applyError: "Failed to submit application", isApplying: false });
            return { success: false, error: "Failed to submit application" };
        }
    },
}));

export default useJobsStore;
