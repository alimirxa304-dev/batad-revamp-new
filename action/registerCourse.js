"use server";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function PostRegisterCourse(body, language) {
  const response = await fetch(`${API_KEY}/course-register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Accept-Language": language ?? "en",
    },
    body: JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await response.json();
  } else {
    const text = await response.text();
    console.error("Non-JSON response received:", text);
    throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}...`);
  }
}
export async function getCourseById(language,id) {
  const response = await fetch(`${API_KEY}/course-details/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Accept-Language": language ?? "en",
    },
  });

  return await response.json();
}



export async function getRegisterData(language) {
  const response = await fetch(`${API_KEY}/registration-data`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Accept-Language": language ?? "en",
    },
  });

  return await response.json();
}


