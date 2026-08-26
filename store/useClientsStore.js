import { create } from "zustand";
import { getClients } from "@/action/clients";
import useLanguageStore from "./useLanguageStore";

const useClientsStore = create((set) => ({
    clients: [],
    isLoading: true,
    handleGetClients: async () => {
        set({ isLoading: true });
        const locale = useLanguageStore.getState().locale;
        const data = await getClients(locale);
        set({ clients: data.data.clients, isLoading: false });
    },
}));

export default useClientsStore;