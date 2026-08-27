import CalendarPage from "./CalendarPage";

export async function generateMetadata({ params }) {
    const { locale } = await params;
    const isAr = locale === "ar";
    return {
        title: isAr ? "الخطة التدريبية 2026-2027" : "2026-2027 Training Calendar",
        description: isAr
            ? "تصفح الخطة التدريبية الكاملة للأكاديمية البريطانية للتدريب والتطوير حسب التصنيف والتخصص والمدينة والتاريخ."
            : "Browse the full British Academy for Training and Development calendar by category, specialisation, city and date.",
    };
}

export default function Page() {
    return <CalendarPage />;
}
