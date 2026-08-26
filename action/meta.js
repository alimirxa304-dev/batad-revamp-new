"use server";

import { cleanMeta } from "@/lib/seoMeta";
import { demoResponse } from "@/lib/demoData";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

function sanitizeMeta(payload) {
  if (!payload || typeof payload !== "object") return payload;
  const meta = payload.meta;
  if (!meta || typeof meta !== "object") return payload;
  return {
    ...payload,
    meta: {
      ...meta,
      title: cleanMeta(meta.title, { maxLength: 65 }),
      description: cleanMeta(meta.description, { maxLength: 160 }),
    },
  };
}

export async function getMeta(language, slug) {
  try {
    const response = await fetch(`${API_KEY}/pages/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept-Language": language ?? "en",
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.success ? sanitizeMeta(data.data) : null;
  } catch (error) {
    return sanitizeMeta(demoResponse("meta", language).data);
  }
}
