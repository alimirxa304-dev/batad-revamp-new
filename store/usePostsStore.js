import { create } from "zustand";
import { getPostBySlug, getPosts } from "@/action/posts";
import useLanguageStore from "./useLanguageStore";

const usePostsStore = create((set) => ({
    posts: [],
    isLoading: true,
    handleGetPosts: async (queryParams='', append=false) => {
        set({ isLoading: !append }); 
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getPosts(locale,queryParams);
            console.log(data,'data category from store')
            set((state) => {
                if (append && state.posts?.posts) {
                    return {
                        posts: {
                            ...data.data,
                            posts: [...state.posts.posts, ...data.data.posts]
                        },
                        isLoading: false
                    };
                }
                return { posts: data.data, isLoading: false };
            });
        } catch (error) {
            set({ isLoading: false });
        }
    },


    handleGetPostBySlug: async (slug) => {
        try {
            const locale = useLanguageStore.getState().locale;
            const data = await getPostBySlug(locale, slug);
            console.log(data?.data,'data post from store post')
            set({ post: data?.data, isLoading: false });
        } catch (error) {
            set({ isLoading: false });
        }
    },
}));

export default usePostsStore;