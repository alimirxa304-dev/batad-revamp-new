import { create } from "zustand";
import { getPlanById, getPlanBySlug, getPlans } from "@/action/plans";
import useLanguageStore from "./useLanguageStore";

const usePlansStore = create((set) => ({
    data: null,
    items: [],
    isLoading: true,
    handleGetPlans: async (queryParams = '', append = false) => {
        set({ isLoading: !append });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await  getPlans(locale, queryParams);
            console.log(data, 'data from store plans')
            set((state) => {
                if (append && state.data?.items) {
                    return {
                        data: {
                            ...data.data,
                            items: [...state.data.items, ...data.data.items]
                        },
                        isLoading: false
                    };
                }
                return { data: data, isLoading: false };
            });

        } catch (error) {
            set({ isLoading: false });
        }
    },


    handleGetPlanById: async (id, queryParams = "", append = false) => {
        set({ isLoading: !append });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getPlanById(locale, id, queryParams);
            const newPlan = data?.data || data;
            set((state) => {
                if (append && state.plan?.courses?.items) {
                    return {
                        plan: {
                            ...newPlan,
                            courses: {
                                ...newPlan?.courses,
                                items: [...state.plan.courses.items, ...(newPlan?.courses?.items || [])]
                            }
                        },
                        isLoading: false
                    };
                }
                return { plan: newPlan, isLoading: false };
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    

}));


export default usePlansStore;
