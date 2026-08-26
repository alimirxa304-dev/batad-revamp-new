import { getCourseBySlug, getCourses } from "@/action/courses";
import { create } from "zustand";
import useLanguageStore from "./useLanguageStore";

const useCoursesStore = create((set) => ({
    data: [],
    course: {},
    isLoading: false,
    handleGetCourses: async (queryParams = '', append = false) => {
        set({ isLoading: !append });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getCourses(locale, queryParams);
            console.log(data, 'data from store')
            set((state) => {
                if (append && state.data?.courses) {
                    return {
                        data: {
                            ...data.data,
                            courses: [...state.data.courses, ...data.data.courses]
                        },
                        isLoading: false
                    };
                }
                return { data: data.data, isLoading: false };
            });

        } catch (error) {
            set({ isLoading: false });
        }
    },


    handleGetCourseBySlug: async (slug) => {
        set({ course: null, isLoading: true });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getCourseBySlug(locale, slug);
            console.log(data, 'data post from store details')
            set({ course: data?.data || data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },
    // handleSearchCourses: async (queryParams = '', append = false) => {
    //     set({ isLoading: !append });
    //     try {
    //         const locale = useLanguageStore.getState().locale;
    //         const data = await getCourses(locale, queryParams);
    //         console.log(data, 'data from store')
    //         set((state) => {
    //             if (append && state.data?.courses) {
    //                 return {
    //                     data: {
    //                         ...data.data,
    //                         courses: [...state.data.courses, ...data.data.courses]
    //                     },
    //                     isLoading: false
    //                 };
    //             }
    //             return { data: data.data, isLoading: false };
    //         });

    //     } catch (error) {
    //         set({ isLoading: false });
    //     }
    // },

}));

export default useCoursesStore;