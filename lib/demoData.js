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
  return names.map(([en, ar, slug, catEn, catAr, price], i) => ({
    id: i + 1,
    name: t(lang, en, ar),
    title: t(lang, en, ar),
    slug,
    image: COURSE_IMAGES[i % COURSE_IMAGES.length],
    price,
    category: { id: i % 3 + 1, name: t(lang, catEn, catAr) },
    created_at: "2026-08-01T09:00:00.000000Z",
    language: lang === "ar" ? "ar" : "en",
    duration: t(lang, "1 week", "أسبوع واحد"),
    city: { id: (i % 4) + 1, name: t(lang, "London", "لندن") },
    description: t(
      lang,
      "A practical, hands-on training course delivered by industry experts. This is demo content shown because the backend API is not connected.",
      "دورة تدريبية عملية يقدمها خبراء متخصصون. هذا محتوى تجريبي يظهر لأن الواجهة الخلفية غير متصلة."
    ),
    dates: [
      { id: 1, date: "2026-09-14", time: "10:00" },
      { id: 2, date: "2026-10-12", time: "10:00" },
      { id: 3, date: "2026-11-09", time: "10:00" },
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

function demoSpecializations(lang, categoryId) {
  const specs = [
    ["Leadership", "القيادة", "leadership"],
    ["Quality Management", "إدارة الجودة", "quality-management"],
    ["Marketing Strategy", "استراتيجية التسويق", "marketing-strategy"],
    ["Software Development", "تطوير البرمجيات", "software-development"],
    ["UX Design", "تصميم تجربة المستخدم", "ux-design"],
    ["Journalism", "الصحافة", "journalism"],
    ["Strategic Planning", "التخطيط الاستراتيجي", "strategic-planning"],
    ["Risk Management", "إدارة المخاطر", "risk-management"],
    ["Financial Analysis", "التحليل المالي", "financial-analysis"],
    ["Internal Auditing", "التدقيق الداخلي", "internal-auditing"],
    ["Cybersecurity", "الأمن السيبراني", "cybersecurity"],
    ["Data Science & AI", "علوم البيانات والذكاء الاصطناعي", "data-science-ai"],
    ["Digital Marketing", "التسويق الرقمي", "digital-marketing-spec"],
    ["Public Relations", "العلاقات العامة", "public-relations-spec"],
    ["Recruitment & Talent", "التوظيف واستقطاب المواهب", "recruitment-talent"],
    ["Compensation & Benefits", "الأجور والمزايا", "compensation-benefits"],
    ["Contract Management", "إدارة العقود", "contract-management"],
    ["Supply Chain & Logistics", "سلاسل الإمداد والخدمات اللوجستية", "supply-chain"],
  ];
  const icons = [
    "/asstes/icons/promotion.svg",
    "/asstes/icons/computer.svg",
    "/asstes/icons/ux-interface.svg",
    "/asstes/icons/game-development.svg",
  ];
  // Rotate the list per category so each demo category shows a visibly
  // different set of sub-specializations.
  const offset = ((categoryId - 1) * 2) % specs.length;
  const rotated = [...specs.slice(offset), ...specs.slice(0, offset)];
  return rotated.map(([en, ar, slug], i) => ({
    id: categoryId * 10 + i + 1,
    name: t(lang, en, ar),
    slug,
    icon: icons[i % icons.length],
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
    case "courses":
      return {
        success: true,
        data: { courses: demoCourses(lang), has_more: false, next_cursor: null },
      };
    case "course": {
      const all = demoCourses(lang);
      const course = all.find((c) => c.slug === param) || all[0];
      const detailed = {
        ...course,
        week_number: 1,
        details: t(
          lang,
          `<p>This intensive programme equips participants with the practical skills and strategic understanding needed to excel in ${course.name}. Delivered by senior industry experts, the course combines case studies, workshops and hands-on exercises with internationally recognised best practice.</p>`,
          `<p>يزوّد هذا البرنامج المكثف المشاركين بالمهارات العملية والفهم الاستراتيجي اللازمين للتميز في ${course.name}. يقدّمه خبراء متخصصون ويجمع بين دراسات الحالة وورش العمل والتمارين التطبيقية وفق أفضل الممارسات المعتمدة دولياً.</p>`
        ),
        tabs: [
          {
            id: 1,
            title: t(lang, "Overview", "نظرة عامة"),
            content: t(
              lang,
              "<p>A comprehensive introduction covering the core concepts, frameworks and tools of the discipline, with real-world examples drawn from British and international organisations.</p>",
              "<p>مقدمة شاملة تغطي المفاهيم والأطر والأدوات الأساسية للتخصص، مع أمثلة واقعية من مؤسسات بريطانية ودولية.</p>"
            ),
          },
          {
            id: 2,
            title: t(lang, "Objectives", "الأهداف"),
            content: t(
              lang,
              "<ul><li>Develop practical, job-ready skills</li><li>Apply international best practice in daily work</li><li>Analyse real case studies and scenarios</li><li>Earn an internationally recognised certificate</li></ul>",
              "<ul><li>تطوير مهارات عملية جاهزة لسوق العمل</li><li>تطبيق أفضل الممارسات الدولية في العمل اليومي</li><li>تحليل دراسات حالة وسيناريوهات واقعية</li><li>الحصول على شهادة معتمدة دولياً</li></ul>"
            ),
          },
          {
            id: 3,
            title: t(lang, "Who Should Attend", "الفئات المستهدفة"),
            content: t(
              lang,
              "<p>Managers, team leaders, specialists and professionals seeking to strengthen their capabilities, as well as organisations nominating staff for accredited development programmes.</p>",
              "<p>المدراء وقادة الفرق والمتخصصون والمهنيون الراغبون في تعزيز قدراتهم، إضافة إلى المؤسسات التي ترشح موظفيها لبرامج تطوير معتمدة.</p>"
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
