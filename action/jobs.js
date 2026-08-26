"use server";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function getJobs(language, queryParams = '') {
  const response = await fetch(`${API_KEY}/jobs${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": language ?? "en",
    },
  });

  let data = await response.json();
  console.log(data , 'data from server')
  return data;
}

export async function getJobBySlug(language, slug) {
  const response = await fetch(`${API_KEY}/jobs/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": language ?? "en",
    },
  });

  let data = await response.json();
  return data;
}



export async function applyToJob(language, formData) {
  try {
    const response = await fetch(`${API_KEY}/jobs/apply`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Accept-Language": language ?? "en",
      },
      body: formData,
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
        error: "Server returned an invalid response format (HTML instead of JSON). This usually happens due to a backend redirect or crash.",
      };
    }

    if (!response.ok) {
      console.error("API Error Response:", data);
      return { success: false, error: data.message || "Failed to submit application", errors: data.errors };
    }

    return { success: true, data: data.data || data };
  } catch (error) {
    console.error("Fetch Error:", error);
    return { success: false, error: error?.message || "An unexpected error occurred" };
  }
}
