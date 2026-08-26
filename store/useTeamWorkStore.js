import { getTeamWork } from "@/action/teamWork";
import { create } from "zustand";
import useLanguageStore from "./useLanguageStore";

const useTeamWorkStore = create((set) => ({
    teamWork: [],
    isLoading: true,
    handleGetTeamWork: async () => {
        set({ isLoading: true });
        const locale = useLanguageStore.getState().locale;
        const data = await getTeamWork(locale);
        set({ teamWork: data?.data?.teams, isLoading: false });
    },
}));

export default useTeamWorkStore;