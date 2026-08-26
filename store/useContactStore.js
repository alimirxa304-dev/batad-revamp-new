import { create } from "zustand";
import { getContactInfo } from "@/action/contact";
import useLanguageStore from "./useLanguageStore";

const useContactStore = create((set) => ({
  contactInfo: [],
  isLoading: true,
  handleGetContactInfo: async () => {
    set({ isLoading: true });
    try {
      const locale = useLanguageStore.getState().locale;
      const data = await getContactInfo(locale);
      set({ contactInfo: data?.data?.contact_info || [], isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));

export default useContactStore;
