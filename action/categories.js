"use server";

import { demoResponse } from "@/lib/demoData";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function getCategories(language) {
  try {
    const response = await fetch(`${API_KEY}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": language ?? "en",
      },
    });

    let data = await response.json();
    return data;
  } catch {
    return demoResponse("categories", language);
  }
}

export async function getCategoryBySlug(language, slug) {
  try {
    const response = await fetch(`${API_KEY}/categories/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": language ?? "en",
      },
    });

    let data = await response.json();
    return data;
  } catch {
    return demoResponse("category", language, slug);
  }
}

export async function getSpecializationBySlug(language, slug) {
  try {
    const response = await fetch(`${API_KEY}/specializations/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": language ?? "en",
      },
    });

    let data = await response.json();
    return data;
  } catch {
    return demoResponse("specialization", language, slug);
  }
}
