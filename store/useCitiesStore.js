import { getCities,getCountries } from "@/action/cities";
import { create } from "zustand";
import useLanguageStore from "./useLanguageStore";

const useCitiesStore = create((set, get) => ({
    cities: [],
    stats: {},
    countries: [],
    specializations: [],
    hasMore: false,
    nextCursor: null,
    isLoading: true,

    handleGetCities: async (queryParams = '') => {
        set({ isLoading: true });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getCities(locale, queryParams);
            const d = data?.data;
            set({
                cities: d?.cities || [],
                stats: d?.stats || {},
                specializations: d?.specializations || [],
                hasMore: d?.has_more || false,
                nextCursor: d?.next_cursor || null,
                isLoading: false,
            });
        } catch {
            set({ isLoading: false });
        }
    },

       handleGetCountries: async () => {
        set({ isLoading: true });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getCountries(locale);
            const d = data?.data;
            set({
                countries: d?.countries || [],
                isLoading: false,
            });
        } catch {
            set({ isLoading: false });
        }
    },


    handleLoadMore: async (queryParams = '') => {
        const { nextCursor, cities } = get();
        if (!nextCursor) return;
        try {
            const locale = useLanguageStore.getState().locale;
            const separator = queryParams ? `${queryParams}&` : '?';
            const data = await getCities(locale, `${separator}cursor=${nextCursor}`);
            const d = data?.data;
            set({
                cities: [...cities, ...(d?.cities || [])],
                hasMore: d?.has_more || false,
                nextCursor: d?.next_cursor || null,
            });
        } catch {}
    },
}));

export default useCitiesStore;
