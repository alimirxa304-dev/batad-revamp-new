"use server";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function getContactInfo(language) {
  const response = await fetch(`${API_KEY}/contact-info`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": language ?? "en",
    },
  });
  const data = await response.json();
  return data;
}

export async function submitContact(language, formData) {
  const response = await fetch(`${API_KEY}/contact-us`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": language ?? "en",
    },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  return data;
}
