"use server";

import { cookies } from "next/headers";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// sign up action
export async function signUpAction(formData, language = "en") {
  try {

   const serverData = new URLSearchParams();
    serverData.append("full_name", formData.full_name);
    serverData.append("email", formData.email);
    serverData.append("phone", formData.phone);
    serverData.append("country_id", formData.country_id);
    serverData.append("password", formData.password);
    serverData.append("password_confirmation", formData.password_confirmation);

    const response = await fetch(`${API_KEY}/auth/sign-up`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Language": language,
      },
      body: serverData,
    });

    
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON Response received:", text);
      return { 
        success: false, 
        error: "Server returned an invalid response format (HTML instead of JSON). This usually happens due to a backend redirect or crash." 
      };
    }

    if (!response.ok) {
      console.error("API Error Response:", data);
      return { success: false, error: data.message || "Failed to sign up" };
    }

    const cookieStore = await cookies();
    const token = data.token || data.data?.token;

    if (token) {
     cookieStore.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    });
    }

    return { success: true, member: data.data.member || data };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// sign in action 
export async function signInAction(formData,language) {
     const serverData = new URLSearchParams();
    serverData.append("email", formData.email);
    serverData.append("password", formData.password);
    // serverData.append("remember_me", formData.remember_me)
  try {
    const response = await fetch(`${API_KEY}/auth/sign-in`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Language": language ?? "en",
      },
      body:serverData,
    });

   const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON Response received:", text);
      return { 
        success: false, 
        error: "Server returned an invalid response format (HTML instead of JSON). This usually happens due to a backend redirect or crash." 
      };
    }

    if (!response.ok) {
      console.error("API Error Response:", data);
      return { success: false, error: data.message || "Failed to sign up" };
    }

    const token = data.token || data.data?.token;
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
}

// forget password action

export async function forgetPasswordAction(formData,language){
     const serverData = new URLSearchParams();
    serverData.append("email", formData.email);
  try {
    const response = await fetch(`${API_KEY}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Language": language ?? "en",
      },
      body:serverData,
    });

   const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON Response received:", text);
      return { 
        success: false, 
        error: "Server returned an invalid response format (HTML instead of JSON). This usually happens due to a backend redirect or crash." 
      };
    }

    if (!response.ok) {
      console.error("API Error Response:", data);
      return { success: false, error: data.message || "Failed to sign up" };
    }
    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
}

// reset password action

export async function resetPasswordAction(formData,language){
     const serverData = new URLSearchParams();
    serverData.append("email", formData.email);
    serverData.append("password", formData.password);
    serverData.append("password_confirmation", formData.password_confirmation);
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    const response = await fetch(`${API_KEY}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Language": language ?? "en",
        "Authorization": `Bearer ${token}`,
      },
      body:serverData,
    });

   const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON Response received:", text);
      return { 
        success: false, 
        error: "Server returned an invalid response format (HTML instead of JSON). This usually happens due to a backend redirect or crash." 
      };
    }

    if (!response.ok) {
      console.error("API Error Response:", data);
      return { success: false, error: data.message || "Failed to sign up" };
    }
    return { success: true, data: data.data || data };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred" };
  }
}


// sign out action
export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return { success: true };
}

// get session action
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  
  if (!token) return null;

  try {
    const response = await fetch(`${API_KEY}/profile`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) return null;
    
    const data = await response.json();
    return data.data || data;
  } catch {
    return null;
  }
}
