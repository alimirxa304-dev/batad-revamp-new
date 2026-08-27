"use server";

import { demoResponse } from "@/lib/demoData";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function getCourses(language, queryParams = "") {
  try {
    const response = await fetch(`${API_KEY}/courses${queryParams}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": language ?? "en",
      },
    });

    let data = await response.json();
    return data;
  } catch {
    return demoResponse("courses", language, queryParams);
  }
}

// Lightweight action for autocomplete — returns only id/name/slug, deduped by name
export async function getCourseSuggestions(language, query) {
  let courses;
  try {
    const response = await fetch(
      `${API_KEY}/courses?search=${encodeURIComponent(query)}&per_page=10`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": language ?? "en",
        },
      }
    );
    const data = await response.json();
    courses = data?.data?.courses || [];
  } catch {
    const demo = demoResponse("courses", language)?.data?.courses || [];
    const q = (query || "").toLowerCase();
    courses = demo.filter((c) => c.name.toLowerCase().includes(q));
  }

  const seen = new Set();
  const results = [];
  for (const c of courses) {
    if (seen.has(c.name)) continue;
    seen.add(c.name);
    results.push({ id: c.id, name: c.name, slug: c.slug });
    if (results.length === 8) break;
  }
  return results;
}


export async function getCourseBySlug(language, slug) {
  try {
    const response = await fetch(`${API_KEY}/courses/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": language ?? "en",
      },
    });

    let data = await response.json();
    return data;
  } catch {
    return demoResponse("course", language, slug);
  }
}
