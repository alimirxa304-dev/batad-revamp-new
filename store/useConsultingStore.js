import { getConsulting,  getConsultantWithService, getConsultingDetailsBySlug, bookingConsultation } from "@/action/consulting";
import { create } from "zustand";
import useLanguageStore from "./useLanguageStore";

const useConsultingStore = create((set) => ({
    data: null,
    consulting: null,
    isLoading: false,
      isBookingLoading: false,
    handleGetConsulting: async (queryParams = '', append = false) => {
        set({ isLoading: !append });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getConsulting(locale, queryParams);
            set((state) => {
                const responseData = data.data || data;
                if (append && state.data?.items) {
                    return {
                        data: {
                            ...responseData,
                            items: [...state.data.items, ...(responseData.items || [])]
                        },
                        isLoading: false
                    };
                }
                return { data: responseData, isLoading: false };
            });

        } catch (error) {
            set({ isLoading: false });
        }
    },

handleGetConsultantWithService: async (slug, queryParams = '') => {
    set({ isLoading: true, consulting: null });
    try {
        const locale = useLanguageStore.getState().locale;
        const data = await getConsultantWithService(locale, slug, queryParams);
        set({ consulting: data?.data || data, isLoading: false });
    } catch (error) {
        set({ isLoading: false });
    }
},
    handleGetConsultingDetailsBySlug: async (slug,queryParams = '') => {
        set({ isLoading: true, consultingDetails: null });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getConsultingDetailsBySlug(locale, slug,queryParams);
            set({ consultingDetails: data?.data || data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },
   handleBookingConsultation: async (formData) => {
        set({ isBookingLoading: true }); 
        try {
            const locale = useLanguageStore.getState().locale;
            const response = await bookingConsultation(locale, formData);
            set({ isBookingLoading: false });
            return response;
        } catch (error) {
            set({ isBookingLoading: false });
            throw error;
        }
    },

}));

export default useConsultingStore;