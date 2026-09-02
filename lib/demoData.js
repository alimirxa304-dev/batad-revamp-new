// Demo/fallback data used when NEXT_PUBLIC_API_KEY (the backend API base URL)
// is not configured or the backend is unreachable. Shapes mirror the real API
// responses consumed by the zustand stores (data.data.courses, data.data.cities, ...).

const t = (lang, en, ar) => (lang === "ar" ? ar : en);

const COURSE_IMAGES = [
  "/asstes/course1.jpg",
  "/asstes/default-1.jpeg",
  "/asstes/default-2.webp",
  "/asstes/details.jpg",
  "/asstes/img.jpg",
  "/asstes/featured.jpg",
];

function demoCourses(lang) {
  const names = [
    [
      "Strategic Management & Leadership",
      "الإدارة الاستراتيجية والقيادة",
      "management-leadership",
      "Management",
      "الإدارة",
      1450,
    ],
    [
      "Digital Marketing Fundamentals",
      "أساسيات التسويق الرقمي",
      "digital-marketing",
      "Marketing",
      "التسويق",
      1200,
    ],
    [
      "Project Management Professional (PMP)",
      "إدارة المشاريع الاحترافية",
      "pmp-preparation",
      "Management",
      "الإدارة",
      1800,
    ],
    [
      "Data Analysis with Excel & Power BI",
      "تحليل البيانات باستخدام Excel و Power BI",
      "data-analysis",
      "Technology",
      "التقنية",
      1350,
    ],
    [
      "Human Resources Management",
      "إدارة الموارد البشرية",
      "hr-management",
      "Management",
      "الإدارة",
      1250,
    ],
    [
      "Public Relations & Corporate Communication",
      "العلاقات العامة والاتصال المؤسسي",
      "public-relations",
      "Media",
      "الإعلام",
      1100,
    ],
  ];
  const instructors = [
    ["1787513947", "Dr. Faysal Shahne", "Management Trainer & Expert", "مدرب وخبير إداري"],
    ["1787387399", "Dr Soonleh Ling", "Senior Trainer & Expert", "مدرب وخبير أول"],
    ["1787396216", "Rob Hoblin, MBA, MA, CIPD", "Senior Trainer and Coach", "مدرب أول"],
    ["1787513812", "Dr Jeffery Bondzie", "Senior Financial Expert, Trainer", "خبير مالي أول ومدرب"],
    ["1787388151", "Dr. Rawad Hammad", "Senior Trainer & Expert", "مدرب وخبير أول"],
    ["1787396161", "Dr Nalinda Somasiri", "Associate Professor, AI & Machine Learning Expert", "أستاذ مشارك وخبير الذكاء الاصطناعي"],
  ];
  const specs = [
    ["Leadership", "القيادة"],
    ["Marketing Strategy", "استراتيجية التسويق"],
    ["Strategic Planning", "التخطيط الاستراتيجي"],
    ["Data Science & AI", "علوم البيانات والذكاء الاصطناعي"],
    ["Recruitment & Talent", "التوظيف واستقطاب المواهب"],
    ["Public Relations", "العلاقات العامة"],
  ];
  return names.map(([en, ar, slug, catEn, catAr, price], i) => ({
    id: i + 1,
    name: t(lang, en, ar),
    title: t(lang, en, ar),
    slug,
    image: COURSE_IMAGES[i % COURSE_IMAGES.length],
    price,
    // Category id/name pairs match demoCategories so filters stay consistent.
    category: {
      id: (i % 3) + 1,
      name: t(
        lang,
        ["Management & Leadership", "Technology & IT", "Media & Marketing"][i % 3],
        ["الإدارة والقيادة", "التقنية وتكنولوجيا المعلومات", "الإعلام والتسويق"][i % 3]
      ),
    },
    specialization: { id: i + 11, name: t(lang, specs[i % specs.length][0], specs[i % specs.length][1]) },
    created_at: "2026-08-01T09:00:00.000000Z",
    language: lang === "ar" ? "ar" : "en",
    duration: t(lang, "1 week", "أسبوع واحد"),
    city: {
      id: (i % 4) + 1,
      name: t(
        lang,
        ["Riyadh", "Kuala Lumpur", "Istanbul", "Doha"][i % 4],
        ["الرياض", "كوالالمبور", "إسطنبول", "الدوحة"][i % 4]
      ),
    },
    description: t(
      lang,
      "A practical, hands-on training course delivered by industry experts. This is demo content shown because the backend API is not connected.",
      "دورة تدريبية عملية يقدمها خبراء متخصصون. هذا محتوى تجريبي يظهر لأن الواجهة الخلفية غير متصلة."
    ),
    // Four sessions per course, spread across the 2026–2027 training calendar.
    dates: [
      { id: 1, date: `2026-${String(9 + (i % 4)).padStart(2, "0")}-${String(7 + i * 2).padStart(2, "0")}`, time: "10:00" },
      { id: 2, date: `2026-${String(10 + (i % 3)).padStart(2, "0")}-${String(12 + i).padStart(2, "0")}`, time: "10:00" },
      { id: 3, date: `2027-${String(1 + (i % 6)).padStart(2, "0")}-${String(10 + i).padStart(2, "0")}`, time: "10:00" },
      { id: 4, date: `2027-${String(4 + (i % 5)).padStart(2, "0")}-${String(5 + i * 3).padStart(2, "0")}`, time: "10:00" },
    ],
    instructor: {
      name: instructors[i % instructors.length][1],
      job: t(lang, instructors[i % instructors.length][2], instructors[i % instructors.length][3]),
      image: `/asstes/team/${instructors[i % instructors.length][0]}.png`,
      rating: "4.9",
      students: "8,600+",
      courses_count: 18 + i,
    },
  }));
}

// Real sub-category (specialisation) set + icons supplied by the client
// (public/asstes/category-icons) — these are sub-categories under a main
// category, not the main categories themselves.
function demoSpecializations(lang, categoryId) {
  const specs = [
    ["Leadership & Professional Development", "القيادة والتطوير المهني", "leadership-development", "leadership-and-professional-development"],
    ["Information Technology & Programming", "تقنية المعلومات والبرمجة", "it-programming", "information-technology-and-programming-courses"],
    ["Public Relations", "العلاقات العامة", "public-relations", "public-relations"],
    ["Accountancy & Bookkeeping", "المحاسبة ومسك الدفاتر", "accountancy-bookkeeping", "accountancy-and-bookkeeping-courses"],
    ["Administrative & Secretariat", "الإدارة والسكرتارية", "administrative-secretariat", "administrative-and-secretariat-courses"],
    ["Administrative Skills", "المهارات الإدارية", "administrative-skills", "administrative-skills-courses"],
    ["Construction & Civil Engineering", "الإنشاءات والهندسة المدنية", "construction-civil-engineering", "construction-and-civil-engineering-training-courses"],
    ["Corporate Governance & Anti-Corruption", "الحوكمة المؤسسية ومكافحة الفساد", "corporate-governance", "corporate-governance-and-anti-corruption-courses"],
    ["Customer Service", "خدمة العملاء", "customer-service", "customer-service-courses"],
    ["Cybersecurity & Digital Security", "الأمن السيبراني والرقمي", "cybersecurity", "cybersecurity-and-digital-security"],
    ["Diplomacy & International Relations", "الدبلوماسية والعلاقات الدولية", "diplomacy-international-relations", "diplomacy-and-international-relations"],
    ["Education Management", "إدارة التعليم", "education-management", "education-management-courses"],
    ["Engineering Management", "إدارة الهندسة", "engineering-management", "engineering-management"],
    ["Environment & Municipality Management", "إدارة البيئة والبلديات", "environment-municipality", "environment-municipality-management"],
    ["Facilities Management", "إدارة المرافق", "facilities-management", "facilities-management-training-courses"],
    ["Financial Reporting & Auditing", "التقارير المالية والتدقيق", "financial-reporting-auditing", "financial-reporting-and-auditing"],
    ["Graphics & Design Skills", "مهارات الجرافيك والتصميم", "graphics-design", "graphics-and-design-skills-courses"],
    ["Health & Safety", "الصحة والسلامة", "health-safety-spec", "health-and-safety-training-courses"],
    ["Hospitality & Tourism", "الضيافة والسياحة", "hospitality-tourism", "hospitality-and-tourism-training-courses"],
    ["Human Resources", "الموارد البشرية", "human-resources-spec", "human-resources-training-courses"],
    ["Investment & Banking", "الاستثمار والخدمات المصرفية", "investment-banking", "investment-and-banking-training-courses"],
    ["Logistics & Supply Chain", "اللوجستيات وسلسلة الإمداد", "logistics-supply-chain", "logistics-and-supply-chain-training-courses"],
    ["Management Skills", "المهارات الإدارية العامة", "management-skills", "management-skills-courses"],
    ["Media & Journalism", "الإعلام والصحافة", "media-journalism", "media-and-journalism"],
    ["Mini Masters in Management", "ماجستير مصغر في الإدارة", "mini-masters-management", "mini-masters-programmes-in-management"],
    ["Mini Professional Diploma in Management", "دبلوم مهني مصغر في الإدارة", "mini-diploma-management", "mini-professional-diploma-in-management"],
    ["Office Management", "إدارة المكاتب", "office-management", "office-management-courses"],
    ["Oil & Gas", "النفط والغاز", "oil-gas", "oil-and-gas-training-courses"],
    ["Procurement & Warehousing", "المشتريات والمستودعات", "procurement-warehousing", "procurement-and-warehouses"],
    ["Product Management", "إدارة المنتجات", "product-management", "product-management-training-courses"],
    ["Programming & Coding", "البرمجة والتطوير", "programming-coding", "programming-and-coding-courses"],
    ["Project Management", "إدارة المشاريع", "project-management-spec", "project-management-courses"],
    ["Protocol & Management", "البروتوكول والإدارة", "protocol-management", "protocol-and-management"],
    ["Public Health & Hospital Management", "الصحة العامة وإدارة المستشفيات", "public-health-hospital", "public-health-and-hospital-management-courses"],
    ["Quality Management & 6 Sigma", "إدارة الجودة وسيجما الستة", "quality-management-6sigma", "quality-management-and-6-sigma-courses"],
    ["Renewable & Clean Energy", "الطاقة المتجددة والنظيفة", "renewable-energy", "renewable-and-clean-energy-training-courses"],
    ["Retail Management", "إدارة التجزئة", "retail-management", "retail-management-courses"],
    ["Risk Management", "إدارة المخاطر", "risk-management-spec", "risk-management-courses"],
    ["Sales Management", "إدارة المبيعات", "sales-management", "sales-management-courses"],
    ["Shipping, Maritime & Ports", "الشحن والموانئ البحرية", "shipping-maritime-ports", "shipping-maritime-and-ports-training-courses"],
    ["Short Masters", "ماجستير مختصر", "short-masters", "short-masters"],
    ["Strategic Planning", "التخطيط الاستراتيجي", "strategic-planning-spec", "strategic-planning-courses"],
    ["Telecommunication", "الاتصالات", "telecommunication", "telecommunication-courses"],
    ["Tendering & Contract Management", "إدارة العطاءات والعقود", "tendering-contracts", "tendering-and-contract-management"],
    ["Engineering Maintenance", "صيانة الهندسة", "engineering-maintenance", "training-courses-in-engineering-maintenance"],
    ["Urban Planning & City Building", "التخطيط العمراني وبناء المدن", "urban-planning", "urban-planning-and-city-building-courses"],
  ];
  // Rotate the list per category so each main category shows a visibly
  // different set of sub-specialisations. Count varies per category (5-10)
  // instead of a flat 6 for every one, so the "X sub-categories" figure
  // shown in the mobile accordion actually differs between categories —
  // the desktop grid still caps its own visible cards to 6 separately
  // (see CoursesBySpecial.jsx's own .slice(0, 6) on top of this).
  const offset = ((categoryId - 1) * 2) % specs.length;
  const count = 5 + (categoryId % 6);
  const rotated = [...specs.slice(offset), ...specs.slice(0, offset)].slice(0, count);
  return rotated.map(([en, ar, slug, iconFile], i) => ({
    id: categoryId * 100 + i + 1,
    name: t(lang, en, ar),
    slug,
    icon: `/asstes/category-icons/${iconFile}.svg`,
    courses_count: 4 + ((i + categoryId) % 9),
  }));
}

function demoCategories(lang) {
  const cats = [
    ["Management & Leadership", "الإدارة والقيادة", "management"],
    ["Technology & IT", "التقنية وتكنولوجيا المعلومات", "technology"],
    ["Media & Marketing", "الإعلام والتسويق", "media-marketing"],
    ["Finance & Accounting", "المالية والمحاسبة", "finance-accounting"],
    ["Human Resources", "الموارد البشرية", "human-resources"],
    ["Project Management", "إدارة المشاريع", "project-management"],
    ["Law & Contracts", "القانون والعقود", "law-contracts"],
    ["Health, Safety & Environment", "الصحة والسلامة والبيئة", "health-safety"],
    ["Procurement & Supply Chain", "المشتريات وسلاسل الإمداد", "procurement-supply"],
    ["Public Relations & Communication", "العلاقات العامة والاتصال", "pr-communication"],
  ];
  return cats.map(([en, ar, slug], i) => ({
    id: i + 1,
    name: t(lang, en, ar),
    slug,
    icon: "/asstes/icons/promotion.svg",
    image: "/asstes/categoryCover.jpg",
    courses_count: 12 + i * 3,
    specializations: demoSpecializations(lang, i + 1),
  }));
}

// City skyline icons downloaded to /asstes/cities (londonpremierhub style).
function demoCities(lang) {
  const cities = [
    ["Riyadh", "الرياض", "riyadh"],
    ["Kuala Lumpur", "كوالالمبور", "kuala-lumpur"],
    ["Istanbul", "إسطنبول", "istanbul"],
    ["Doha", "الدوحة", "doha"],
    ["Manama", "المنامة", "manama"],
    ["Muscat", "مسقط", "muscat"],
    ["Paris", "باريس", "paris"],
    ["Singapore", "سنغافورة", "singapore"],
    ["Vienna", "فيينا", "vienna"],
    ["New York", "نيويورك", "new-york"],
    ["Milan", "ميلانو", "milan"],
    ["Cairo", "القاهرة", "cairo"],
  ];
  return cities.map(([en, ar, slug], i) => ({
    id: i + 1,
    name: t(lang, en, ar),
    slug,
    image: `/asstes/cities/${slug}.png`,
    icon: `/asstes/cities/${slug}.png`,
    courses_count: 8 + i * 2,
    country: { id: i + 1, name: t(lang, "Demo Country", "دولة تجريبية") },
  }));
}

// Real client/partner logos from batdacademy.com (downloaded to /asstes/clients).
function demoClients(lang) {
  const logos = [
    "1516033136", "1516034029", "1516034127", "1516034154", "1516034191",
    "1516034238", "1516034329", "1516034366", "1516034397", "1516034423",
    "1516034477", "1516034520", "1516034570", "1516034597", "1516034635",
    "1516034708", "1516034746", "1516034776", "1516034858", "1516034889",
    "1516034930", "1516034983", "1516035075",
  ];
  return logos.map((file, i) => ({
    id: i + 1,
    name: t(lang, `Client ${i + 1}`, `عميل ${i + 1}`),
    logo: `/asstes/clients/${file}.webp`,
  }));
}

// Real team roster and photos from batdacademy.com (downloaded to /asstes/team).
function demoTeams(lang) {
  const members = [
    ["1787157070", "Robert Oulds", "Corporate & Executive Training Manager", "مدير التدريب المؤسسي والتنفيذي"],
    ["1787157662", "David Banks", "Business Development & Partnerships Manager", "مدير تطوير الأعمال والشراكات"],
    ["1787163469", "Louise Thomson", "Director of Media, Marketing & Communications", "مديرة الإعلام والتسويق والاتصالات"],
    ["1787163688", "David Campbell Bannerman", "Senior Advisor & Consultant", "مستشار أول"],
    ["1787387323", "Batoul Muhra", "Admissions & Registration Manager", "مديرة القبول والتسجيل"],
    ["1787387399", "Dr Soonleh Ling", "Senior Trainer & Expert", "مدرب وخبير أول"],
    ["1787388151", "Dr. Rawad Hammad", "Senior Trainer & Expert", "مدرب وخبير أول"],
    ["1787396161", "Dr Nalinda Somasiri", "Associate Professor, AI & Machine Learning Expert", "أستاذ مشارك وخبير الذكاء الاصطناعي وتعلم الآلة"],
    ["1787396216", "Rob Hoblin, MBA, MA, CIPD", "Senior Trainer and Coach", "مدرب أول"],
    ["1787513812", "Dr Jeffery Bondzie", "Senior Financial Expert, Trainer", "خبير مالي أول ومدرب"],
    ["1787513947", "Dr. Faysal Shahne", "Management Trainer & Expert", "مدرب وخبير إداري"],
    ["1787515981", "Natalie Mulkerrins", "Assistant Manager - London HQ", "مساعدة مدير - المقر الرئيسي لندن"],
  ];
  return members.map(([img, name, jobEn, jobAr], i) => ({
    id: i + 1,
    name,
    job: t(lang, jobEn, jobAr),
    image: `/asstes/team/${img}.png`,
    email: "info@batdacademy.com",
    phone: "+442035827999",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#",
      instagram: "#",
    },
  }));
}

function demoPosts(lang) {
  const posts = [
    [
      "The Future of Corporate Training",
      "مستقبل التدريب المؤسسي",
      "future-of-corporate-training",
      "/asstes/post-image.jpg",
    ],
    [
      "5 Leadership Skills Every Manager Needs",
      "٥ مهارات قيادية يحتاجها كل مدير",
      "leadership-skills",
      "/asstes/featured.jpg",
    ],
    [
      "Why Data Literacy Matters in 2026",
      "لماذا تهم الثقافة البيانية في ٢٠٢٦",
      "data-literacy-2026",
      "/asstes/last.jpg",
    ],
  ];
  return posts.map(([en, ar, slug, image], i) => ({
    id: i + 1,
    name: t(lang, en, ar),
    title: t(lang, en, ar),
    slug,
    image,
    description: t(
      lang,
      "Demo article content. Connect the backend API to load real blog posts.",
      "محتوى تجريبي للمقال. قم بربط الواجهة الخلفية لعرض المقالات الحقيقية."
    ),
    content: t(
      lang,
      "<p>This is demo content shown because the backend API is not connected.</p>",
      "<p>هذا محتوى تجريبي يظهر لأن الواجهة الخلفية غير متصلة.</p>"
    ),
    author_name: t(lang, "BATD Editorial", "فريق تحرير BATD"),
    date: "2026-08-10",
    publish_date: "2026-08-10",
    created_at: "2026-08-10T09:00:00.000000Z",
  }));
}

function demoConsulting(lang) {
  const items = [
    [
      "Business Strategy Consulting",
      "استشارات استراتيجية الأعمال",
      "business-strategy",
    ],
    [
      "Organisational Development",
      "التطوير المؤسسي",
      "organizational-development",
    ],
    ["Digital Transformation", "التحول الرقمي", "digital-transformation"],
  ];
  return items.map(([en, ar, slug], i) => ({
    id: i + 1,
    name: t(lang, en, ar),
    title: t(lang, en, ar),
    slug,
    image: "/asstes/const.jpg",
    description: t(
      lang,
      "Demo consulting service. Connect the backend API to load real services.",
      "خدمة استشارية تجريبية. قم بربط الواجهة الخلفية لعرض الخدمات الحقيقية."
    ),
    services_count: 3 + i,
  }));
}

function demoFaqs(lang) {
  const faqs = [
    [
      "How do I register for a course?",
      "كيف أسجل في دورة تدريبية؟",
      "You can register online through the course page. (Demo answer)",
      "يمكنك التسجيل عبر صفحة الدورة. (إجابة تجريبية)",
    ],
    [
      "Are the certificates accredited?",
      "هل الشهادات معتمدة؟",
      "Yes, all our programs are internationally accredited. (Demo answer)",
      "نعم، جميع برامجنا معتمدة دولياً. (إجابة تجريبية)",
    ],
    [
      "Can I attend courses online?",
      "هل يمكنني حضور الدورات عن بُعد؟",
      "Most courses are available both in-person and online. (Demo answer)",
      "معظم الدورات متاحة حضورياً وعن بُعد. (إجابة تجريبية)",
    ],
    [
      "What payment methods do you accept?",
      "ما هي طرق الدفع المتاحة؟",
      "We accept bank transfer and major credit cards. (Demo answer)",
      "نقبل التحويل البنكي وبطاقات الائتمان الرئيسية. (إجابة تجريبية)",
    ],
  ];
  return faqs.map(([qEn, qAr, aEn, aAr], i) => ({
    id: i + 1,
    question: t(lang, qEn, qAr),
    answer: t(lang, aEn, aAr),
    is_popular: i < 2,
  }));
}

function demoPlans(lang) {
  return Array.from({ length: 3 }, (_, i) => ({
    id: i + 1,
    name: t(lang, `Training Plan ${2026 + i}`, `الخطة التدريبية ${2026 + i}`),
    year: 2026 + i,
    description: t(
      lang,
      "Demo yearly training plan.",
      "خطة تدريبية سنوية تجريبية."
    ),
    image: "/asstes/categoryCover.jpg",
  }));
}

function demoMeta(lang) {
  return {
    meta: {
      title: t(lang, "BATD Academy — Demo Preview", "أكاديمية BATD — معاينة تجريبية"),
      description: t(
        lang,
        "Local demo preview of BATD Academy. Backend API is not connected.",
        "معاينة تجريبية محلية لأكاديمية BATD. الواجهة الخلفية غير متصلة."
      ),
      keyword: "training, courses, demo",
    },
  };
}

// Returns a full API-shaped response ({ success, data }) for the given resource.
export function demoResponse(resource, language = "en", param) {
  const lang = language === "ar" ? "ar" : "en";
  switch (resource) {
    case "courses": {
      // param may carry a query string ("?category_id=1&search=x") — apply the
      // common filters so category/search/calendar pages behave in demo mode.
      let courses = demoCourses(lang);
      if (typeof param === "string" && param.includes("=")) {
        const qs = new URLSearchParams(param.startsWith("?") ? param.slice(1) : param);
        const categoryId = qs.get("category_id");
        const specializationId = qs.get("specialization_id");
        const cityId = qs.get("city_id");
        const search = (qs.get("search") || "").toLowerCase();
        const date = qs.get("date"); // YYYY-MM or YYYY-MM-DD prefix match
        if (categoryId) courses = courses.filter((c) => String(c.category?.id) === String(categoryId));
        if (specializationId) courses = courses.filter((c) => String(c.specialization?.id) === String(specializationId));
        if (cityId) courses = courses.filter((c) => String(c.city?.id) === String(cityId));
        if (search) courses = courses.filter((c) => c.name.toLowerCase().includes(search));
        if (date) courses = courses.filter((c) => c.dates?.some((d) => d.date.startsWith(date)));
      }
      return {
        success: true,
        data: { courses, has_more: false, next_cursor: null },
      };
    }
    case "course": {
      const all = demoCourses(lang);
      const course = all.find((c) => c.slug === param) || all[0];
      const detailed = {
        ...course,
        week_number: 1,
        details: t(
          lang,
          `<p>This intensive programme equips participants with the practical skills and strategic understanding needed to excel in <strong>${course.name}</strong>. Delivered by senior industry experts at the British Academy for Training and Development, the course combines case studies, interactive workshops and hands-on exercises with internationally recognised best practice.</p>
<p>Over the duration of the course, delegates work through realistic scenarios drawn from British and international organisations, benchmark their current practice against global standards, and leave with a personal action plan they can apply immediately in their workplace.</p>
<h3>Why choose this course?</h3>
<ul>
<li>Taught by senior trainers with extensive industry and academic experience</li>
<li>Small groups to guarantee individual attention and discussion</li>
<li>Up-to-date curriculum aligned with the latest market requirements</li>
<li>An internationally recognised certificate issued on completion</li>
<li>Post-course follow-up and career support from our training advisers</li>
</ul>`,
          `<p>يزوّد هذا البرنامج المكثف المشاركين بالمهارات العملية والفهم الاستراتيجي اللازمين للتميز في <strong>${course.name}</strong>. يقدّمه خبراء متخصصون في الأكاديمية البريطانية للتدريب والتطوير، ويجمع بين دراسات الحالة وورش العمل التفاعلية والتمارين التطبيقية وفق أفضل الممارسات المعتمدة دولياً.</p>
<p>خلال مدة الدورة يعمل المشاركون على سيناريوهات واقعية من مؤسسات بريطانية ودولية، ويقارنون ممارساتهم الحالية بالمعايير العالمية، ويغادرون بخطة عمل شخصية يمكن تطبيقها فوراً في بيئة العمل.</p>
<h3>لماذا تختار هذه الدورة؟</h3>
<ul>
<li>يقدمها مدربون أوائل بخبرة صناعية وأكاديمية واسعة</li>
<li>مجموعات صغيرة تضمن الاهتمام الفردي والنقاش</li>
<li>منهج محدث يواكب أحدث متطلبات سوق العمل</li>
<li>شهادة معتمدة دولياً تُمنح عند إتمام الدورة</li>
<li>متابعة ودعم مهني من مستشاري التدريب بعد انتهاء الدورة</li>
</ul>`
        ),
        tabs: [
          {
            id: 1,
            title: t(lang, "Overview", "نظرة عامة"),
            content: t(
              lang,
              `<p>A comprehensive programme covering the core concepts, frameworks and tools of the discipline, with real-world examples drawn from British and international organisations.</p>
<p>The course balances theory with practice: every module pairs a concise briefing with a workshop exercise, so participants apply each idea before moving on. Delegates also receive a full set of course materials, templates and checklists to reuse in their own organisation.</p>
<p>Training is available in London and across our international venues, and can also be delivered in-house for corporate groups.</p>`,
              `<p>برنامج شامل يغطي المفاهيم والأطر والأدوات الأساسية للتخصص، مع أمثلة واقعية من مؤسسات بريطانية ودولية.</p>
<p>توازن الدورة بين النظرية والتطبيق: كل وحدة تجمع بين شرح مركز وتمرين عملي، بحيث يطبق المشاركون كل فكرة قبل الانتقال إلى ما يليها. كما يحصل المشاركون على حقيبة تدريبية كاملة تتضمن النماذج وقوائم المراجعة لإعادة استخدامها في مؤسساتهم.</p>
<p>تُقدَّم الدورة في لندن وفي جميع مراكزنا الدولية، ويمكن تنفيذها داخل المؤسسات للمجموعات.</p>`
            ),
          },
          {
            id: 2,
            title: t(lang, "Objectives", "الأهداف"),
            content: t(
              lang,
              `<p>By the end of this course, participants will be able to:</p>
<ul>
<li>Understand and apply the core principles and modern frameworks of the field</li>
<li>Develop practical, job-ready skills through hands-on workshops</li>
<li>Analyse real case studies and translate lessons into their own context</li>
<li>Benchmark their organisation against international best practice</li>
<li>Build a personal action plan for continuous improvement</li>
<li>Earn an internationally recognised certificate from the British Academy</li>
</ul>`,
              `<p>بنهاية هذه الدورة سيكون المشاركون قادرين على:</p>
<ul>
<li>فهم وتطبيق المبادئ الأساسية والأطر الحديثة للتخصص</li>
<li>تطوير مهارات عملية جاهزة لسوق العمل من خلال ورش تطبيقية</li>
<li>تحليل دراسات حالة واقعية وترجمة الدروس إلى سياق عملهم</li>
<li>مقارنة مؤسساتهم بأفضل الممارسات الدولية</li>
<li>بناء خطة عمل شخصية للتحسين المستمر</li>
<li>الحصول على شهادة معتمدة دولياً من الأكاديمية البريطانية</li>
</ul>`
            ),
          },
          {
            id: 3,
            title: t(lang, "Course Content", "محتوى الدورة"),
            content: t(
              lang,
              `<h4>Day 1 — Foundations</h4>
<ul><li>Key concepts, terminology and the current landscape</li><li>Where your organisation stands: self-assessment workshop</li></ul>
<h4>Day 2 — Tools &amp; Frameworks</h4>
<ul><li>The essential toolkit: models, templates and checklists</li><li>Hands-on exercise: applying the framework to a live case</li></ul>
<h4>Day 3 — Strategy &amp; Planning</h4>
<ul><li>From analysis to strategy: building a practical roadmap</li><li>Group case study: British and international examples</li></ul>
<h4>Day 4 — Implementation</h4>
<ul><li>Managing change, stakeholders and communication</li><li>Measuring results: KPIs and reporting</li></ul>
<h4>Day 5 — Action Planning</h4>
<ul><li>Personal action plan development and peer review</li><li>Final assessment and certificate award</li></ul>`,
              `<h4>اليوم الأول — الأساسيات</h4>
<ul><li>المفاهيم والمصطلحات الأساسية والمشهد الحالي</li><li>ورشة تقييم ذاتي لوضع مؤسستك</li></ul>
<h4>اليوم الثاني — الأدوات والأطر</h4>
<ul><li>حقيبة الأدوات الأساسية: نماذج وقوالب وقوائم مراجعة</li><li>تمرين عملي: تطبيق الإطار على حالة واقعية</li></ul>
<h4>اليوم الثالث — الاستراتيجية والتخطيط</h4>
<ul><li>من التحليل إلى الاستراتيجية: بناء خارطة طريق عملية</li><li>دراسة حالة جماعية: أمثلة بريطانية ودولية</li></ul>
<h4>اليوم الرابع — التنفيذ</h4>
<ul><li>إدارة التغيير وأصحاب المصلحة والتواصل</li><li>قياس النتائج: مؤشرات الأداء والتقارير</li></ul>
<h4>اليوم الخامس — خطة العمل</h4>
<ul><li>إعداد خطة العمل الشخصية ومراجعة الزملاء</li><li>التقييم النهائي ومنح الشهادة</li></ul>`
            ),
          },
          {
            id: 4,
            title: t(lang, "Who Should Attend", "الفئات المستهدفة"),
            content: t(
              lang,
              `<p>This course is designed for:</p>
<ul>
<li>Managers and team leaders responsible for performance and delivery</li>
<li>Specialists and analysts seeking to formalise and update their skills</li>
<li>Professionals preparing for a step up into a leadership role</li>
<li>Government and corporate staff nominated for accredited development programmes</li>
<li>Entrepreneurs and business owners who want a structured, practical grounding</li>
</ul>`,
              `<p>صُممت هذه الدورة من أجل:</p>
<ul>
<li>المدراء وقادة الفرق المسؤولين عن الأداء والإنجاز</li>
<li>المتخصصين والمحللين الراغبين في تحديث مهاراتهم وتوثيقها</li>
<li>المهنيين المستعدين للانتقال إلى دور قيادي</li>
<li>موظفي الجهات الحكومية والشركات المرشحين لبرامج تطوير معتمدة</li>
<li>رواد الأعمال وأصحاب المشاريع الباحثين عن تأسيس عملي منظم</li>
</ul>`
            ),
          },
          {
            id: 5,
            title: t(lang, "Certification", "الشهادة"),
            content: t(
              lang,
              `<p>On successful completion, participants receive an <strong>internationally recognised certificate</strong> from the British Academy for Training and Development, verifying the course title, duration and learning outcomes.</p>
<ul>
<li>Certificate issued in English, with attested copies available on request</li>
<li>Verifiable by employers through the Academy</li>
<li>Counts towards continuing professional development (CPD) hours</li>
</ul>`,
              `<p>عند إتمام الدورة بنجاح يحصل المشاركون على <strong>شهادة معتمدة دولياً</strong> من الأكاديمية البريطانية للتدريب والتطوير، توثق اسم الدورة ومدتها ومخرجات التعلم.</p>
<ul>
<li>تصدر الشهادة باللغة الإنجليزية مع إمكانية توفير نسخ مصدّقة عند الطلب</li>
<li>يمكن لجهات العمل التحقق منها عبر الأكاديمية</li>
<li>تُحتسب ضمن ساعات التطوير المهني المستمر (CPD)</li>
</ul>`
            ),
          },
        ],
        similar_courses: all.filter((c) => c.slug !== course.slug).slice(0, 3),
      };
      return { success: true, data: detailed };
    }
    case "categories":
      return { success: true, data: demoCategories(lang) };
    case "category": {
      const category =
        demoCategories(lang).find((c) => c.slug === param) ||
        demoCategories(lang)[0];
      return {
        success: true,
        data: {
          ...category,
          courses: { courses: demoCourses(lang), has_more: false, next_cursor: null },
        },
      };
    }
    case "specialization": {
      const spec = demoSpecializations(lang, 1)[0];
      return {
        success: true,
        data: {
          ...spec,
          courses: { courses: demoCourses(lang), has_more: false, next_cursor: null },
        },
      };
    }
    case "cities":
      return {
        success: true,
        data: {
          cities: demoCities(lang),
          stats: {},
          specializations: demoSpecializations(lang, 1),
          has_more: false,
          next_cursor: null,
        },
      };
    case "city": {
      const city =
        demoCities(lang).find((c) => c.slug === param) || demoCities(lang)[0];
      return {
        success: true,
        data: {
          ...city,
          courses: { courses: demoCourses(lang), has_more: false, next_cursor: null },
        },
      };
    }
    case "countries":
      return {
        success: true,
        data: {
          countries: [
            { id: 1, name: t(lang, "United Kingdom", "المملكة المتحدة") },
            { id: 2, name: t(lang, "United Arab Emirates", "الإمارات") },
            { id: 3, name: t(lang, "Turkey", "تركيا") },
          ],
        },
      };
    case "clients":
      return { success: true, data: { clients: demoClients(lang) } };
    case "teams":
      return { success: true, data: { teams: demoTeams(lang) } };
    case "posts":
      return {
        success: true,
        data: { posts: demoPosts(lang), has_more: false, next_cursor: null },
      };
    case "post": {
      const post =
        demoPosts(lang).find((p) => p.slug === param) || demoPosts(lang)[0];
      return { success: true, data: post };
    }
    case "consulting":
      return { success: true, data: { items: demoConsulting(lang) } };
    case "consultingDetails":
      return { success: true, data: demoConsulting(lang)[0] };
    case "faqs":
      return {
        success: true,
        data: {
          faqs: demoFaqs(lang),
          popular: demoFaqs(lang).filter((f) => f.is_popular),
        },
      };
    case "plans":
      return { success: true, data: { items: demoPlans(lang) } };
    case "plan":
      return {
        success: true,
        data: {
          ...demoPlans(lang)[0],
          courses: { items: demoCourses(lang) },
        },
      };
    case "meta":
      return { success: true, data: demoMeta(lang) };
    default:
      return { success: true, data: null };
  }
}
