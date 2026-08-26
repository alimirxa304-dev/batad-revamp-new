import { create } from "zustand";
import { getCategories } from "@/action/categories";
import useLanguageStore from "./useLanguageStore";

const useCategoriesStore = create((set) => ({
    categories: [],
    isLoading: false,
    handleGetCategories: async () => {
        set({ isLoading: true });
        const locale = useLanguageStore.getState().locale;
        const data = await getCategories(locale);
        set({ categories: data.data, isLoading: false });
    },
}));

export default useCategoriesStore;