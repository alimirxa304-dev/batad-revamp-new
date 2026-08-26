import { create } from "zustand";
import { getCourseById, getRegisterData, PostRegisterCourse } from "@/action/registerCourse";
import useLanguageStore from "./useLanguageStore";

const useRegisterCourseStore = create((set) => ({
    registerCourse: [],
    isLoading: false,
    registerData: [],
    cousre:{},
    handleGetRegisterData: async () => {
        set({ isLoading: true });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getRegisterData(locale);
            console.log(data, 'Registration Data');
            set({ registerData: data.data, isLoading: false });
            return data;
        } catch (error) {
            console.error('Get Register Data Error:', error);
            set({ isLoading: false });
            return { status: false, message: error.message };
        }
    },
     handleGetCourseByIdData: async (id) => {
        set({ isLoading: true });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getCourseById(locale,id);
            console.log(data, 'Registration Data');
            set({ course: data.data, isLoading: false });
            return data;
        } catch (error) {
            console.error('Get Register Data Error:', error);
            set({ isLoading: false });
            return { status: false, message: error.message };
        }
    },
    handlePostRegisterCourse: async (body) => {
        set({ isLoading: true });
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await PostRegisterCourse(body, locale);
            console.log(data, 'Registration Response');
            set({ registerCourse: data.data, isLoading: false });
            return data;
        } catch (error) {
            console.error('Registration Error:', error);
            set({ isLoading: false });
            return { status: false, message: error.message };
        }
    },


 
}));

export default useRegisterCourseStore;