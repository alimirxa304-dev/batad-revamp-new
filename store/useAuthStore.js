import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    signInAction,
    signUpAction,
    signOutAction,
    forgetPasswordAction,
    resetPasswordAction,
} from "@/action/auth";

const useAuthStore = create(
    persist(
        (set) => ({
            member: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            handleLogin: async (formData, locale) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await signInAction(formData, locale);
                    if (!result?.success) {
                        set({ error: result?.message || "Failed to sign in", isLoading: false });
                        return result;
                    }
                    set({
                        member: result?.data?.member ?? null,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return result;
                } catch (error) {
                    console.error("[useAuthStore] handleLogin", error);
                    set({ error: "Failed to sign in", isLoading: false });
                }
            },

            handleSignup: async (formData, locale) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await signUpAction(formData, locale);
                    if (!result?.success) {
                        set({ error: result?.message || "Failed to sign up", isLoading: false });
                        return result;
                    }
                    set({
                        member: result?.data?.member ?? null,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    return result;
                } catch (error) {
                    console.error("[useAuthStore] handleSignup", error);
                    set({ error: "Failed to sign up", isLoading: false });
                }
            },

            handleForgetPassword: async (formData, locale) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await forgetPasswordAction(formData, locale);
                    if (!result?.success) {
                        set({ error: result?.message || "Failed to send reset email", isLoading: false });
                        return result;
                    }
                    set({ isLoading: false });
                    return result;
                } catch (error) {
                    console.error("[useAuthStore] handleForgetPassword", error);
                    set({ error: "Failed to send reset email", isLoading: false });
                }
            },

            handleResetPassword: async (formData, locale) => {
                set({ isLoading: true, error: null });
                try {
                    const result = await resetPasswordAction(formData, locale);
                    if (!result?.success) {
                        set({ error: result?.message || "Failed to reset password", isLoading: false });
                        return result;
                    }
                    set({ isLoading: false });
                    return result;
                } catch (error) {
                    console.error("[useAuthStore] handleResetPassword", error);
                    set({ error: "Failed to reset password", isLoading: false });
                }
            },

            handleLogout: async () => {
                set({ isLoading: true, error: null });
                try {
                    await signOutAction();
                    set({ member: null, isAuthenticated: false, isLoading: false });
                } catch (error) {
                    console.error("[useAuthStore] handleLogout", error);
                    set({ error: "Failed to sign out", isLoading: false });
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                member: state.member,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

export default useAuthStore;