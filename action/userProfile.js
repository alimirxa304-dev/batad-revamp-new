'use server'

import { cookies } from "next/headers";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const getUserProfile = async (language) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized" };
        }
        const response = await fetch(`${API_KEY}/auth/me`, {
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": language ?? "en",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, message: errorData.message || "Failed to fetch profile" };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[getUserProfile] Error:", error);
        return { success: false, message: "Something went wrong" };
    }
};

export const getUserCourses = async (language) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized" };
        }
        const response = await fetch(`${API_KEY}/member/courses`, {
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": language ?? "en",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, message: errorData.message || "Failed to fetch courses" };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[getUserCourses] Error:", error);
        return { success: false, message: "Something went wrong" };
    }
};


// export const getUserCertificates = async (language) => {
//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get("auth_token")?.value;

//         if (!token) {
//             return { success: false, message: "Unauthorized" };
//         }
//         const response = await fetch(`${API_KEY}/member/certificates`, {
//             headers: {
//                 "Content-Type": "application/json",
//                 "Accept-Language": language ?? "en",
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         if (!response.ok) {
//             return { success: false, message: "Failed to fetch profile" };
//         }
//         const data = await response.json();
//         return data;
//     } catch (error) {
//         console.error(error, "error");
//         return { success: false, message: "Something went wrong" };
//     }
// };



export const getUserMessages = async (language) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized" };
        }
        const response = await fetch(`${API_KEY}/member/messages`, {
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": language ?? "en",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, message: errorData.message || "Failed to fetch messages" };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[getUserMessages] Error:", error);
        return { success: false, message: "Something went wrong" };
    }
};


export const markMessageAsRead = async (num, language) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized" };
        }
        const response = await fetch(`${API_KEY}/member/messages/${num}/read`, {
            method:'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": language ?? "en",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, message: errorData.message || "Failed to mark message as read" };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[markMessageAsRead] Error:", error);
        return { success: false, message: "Something went wrong" };
    }
};

export const markAllMessagesAsRead = async (language) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized" };
        }
        const response = await fetch(`${API_KEY}/member/messages/read-all`, {
            method:'PATCH',
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": language ?? "en",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, message: errorData.message || "Failed to mark all messages as read" };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[markAllMessagesAsRead] Error:", error);
        return { success: false, message: "Something went wrong" };
    }
};
export const getUnreadNumberMessage = async (language) => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            return { success: false, message: "Unauthorized" };
        }
        const response = await fetch(`${API_KEY}/member/messages/unread-count`, {
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": language ?? "en",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return { success: false, message: errorData.message || "Failed to fetch unread count" };
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("[getUnreadNumberMessage] Error:", error);
        return { success: false, message: "Something went wrong" };
    }
};


