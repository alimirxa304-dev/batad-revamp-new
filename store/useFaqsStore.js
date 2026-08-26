import { create } from "zustand";
import { getFaqs } from "@/action/faqs";
import useLanguageStore from "./useLanguageStore";

const useFaqsStore = create((set) => ({
  faqs: [],
  popular: [],
  isLoading: true,
  handleGetFaqs: async (queryParams = '') => {
    set({ isLoading: true });
    try {
      const locale = useLanguageStore.getState().locale;
      const data = await getFaqs(locale, queryParams);
      const faqData = data?.data;

      if (Array.isArray(faqData)) {
        const popular = faqData.filter((f) => f.is_popular);
        set({ faqs: faqData, popular, isLoading: false });
      } else {
        set({
          faqs: faqData?.faqs || faqData?.all || [],
          popular: faqData?.popular || [],
          isLoading: false,
        });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));

export default useFaqsStore;
