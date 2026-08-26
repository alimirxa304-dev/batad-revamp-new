"use server";

import { demoResponse } from "@/lib/demoData";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function getFaqs(language, queryParams = '') {
  try {
    const response = await fetch(`${API_KEY}/faqs${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": language ?? "en",
      },
    });
    const data = await response.json();
    return data;
  } catch {
    return demoResponse("faqs", language);
  }
}
