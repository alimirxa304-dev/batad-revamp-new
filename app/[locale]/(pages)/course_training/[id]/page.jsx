import { getCategories } from "@/action/categories";
import { permanentRedirect } from "next/navigation";

export default async function RedirectToSlugPage({ params }) {
  const { locale, id } = await params;

  let targetSlug = "course";

  try {
    const res = await getCategories(locale);
    
    const categories = res?.data || [];

    for (const cat of categories) {
      const spec = cat.specializations?.find((s) => s.id == id);
      if (spec) {
        targetSlug = spec.slug;
        break;
      }
    }
  } catch (error) {
    console.error("Failed to fetch categories for slug redirection:", error);
  }
  permanentRedirect(`/${locale}/course_training/${id}/${targetSlug}`);
}