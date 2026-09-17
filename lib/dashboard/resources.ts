// Dashboard CRUD bo'limlarining tavsifi: API manzili, forma maydonlari, jadval ustunlari.
// Ro'yxat, yaratish va tahrirlash sahifalari hamda server action'lar shu konfiguratsiya asosida ishlaydi.
// Yangi maydon qo'shish: backend serializer'ga + shu yerdagi `sections` / `columns` ga.

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "url"
  | "slug"
  | "select"
  | "switch"
  | "date"
  | "time"
  | "datetime"
  | "image"
  | "icon"
  | "theme"
  | "relation"
  | "stringList"
  | "repeater";

export type Option = { value: string; label: string };

export type SubField = {
  name: string;
  label: string;
  type: "text" | "time";
  placeholder?: string;
  /** To'liq Tailwind klassi (masalan "sm:w-40 sm:flex-none") */
  width?: string;
};

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: Option[];
  /** relation: qaysi resursdan tanlanadi */
  relation?: "courses";
  /** repeater: qatordagi maydonlar */
  subFields?: SubField[];
  /** textarea qatorlari */
  rows?: number;
  /** Formada to'liq kenglik */
  full?: boolean;
  /** stringList/repeater: "qo'shish" tugmasi matni */
  addLabel?: string;
};

export type Section = { title: string; description?: string; fields: Field[] };

export type ColumnType = "title" | "text" | "number" | "date" | "datetime" | "boolean" | "badge" | "image";

export type Column = {
  name: string;
  label: string;
  type: ColumnType;
  /** title: ikkinchi qator uchun maydon */
  subtitle?: string;
  /** badge: qiymat -> yorliq va rang */
  badges?: Record<string, { label: string; tone: Tone }>;
  /** Mobil ekranda yashirish */
  hideOnMobile?: boolean;
  align?: "right";
};

export type Tone = "neutral" | "blue" | "green" | "amber" | "red" | "purple";

export type Resource = {
  key: string;
  endpoint: string;
  title: string;
  singular: string;
  description: string;
  /** Rasm maydoni bor — multipart yuboriladi */
  multipart?: boolean;
  searchPlaceholder: string;
  /** Holat bo'yicha tezkor filtr (tablar) */
  filter?: { param: string; options: Option[] };
  defaultOrdering?: string;
  titleField: string;
  sections: Section[];
  columns: Column[];
  /** Saytdagi sahifa manzili (bo'lsa "Saytda ko'rish" tugmasi chiqadi) */
  publicPath?: (item: Record<string, unknown>) => string | null;
  defaults?: Record<string, unknown>;
};

export const THEME_OPTIONS: Option[] = [
  { value: "blue", label: "Ko'k" },
  { value: "cyan", label: "Moviy" },
  { value: "purple", label: "Binafsha" },
  { value: "yellow", label: "Sariq" },
  { value: "red", label: "Qizil" },
  { value: "emerald", label: "Yashil" },
  { value: "orange", label: "To'q sariq" },
];

export const ICON_OPTIONS: Option[] = [
  { value: "smartphone", label: "Mobil" },
  { value: "terminal", label: "Dasturlash" },
  { value: "layers", label: "Qatlamlar" },
  { value: "cpu", label: "Elektronika" },
  { value: "box", label: "3D" },
  { value: "briefcase", label: "Loyiha" },
  { value: "rocket", label: "Startap" },
  { value: "zap", label: "Energiya" },
  { value: "users", label: "Jamoa" },
  { value: "trophy", label: "G'alaba" },
  { value: "printer", label: "Printer" },
  { value: "monitor", label: "Kompyuter" },
  { value: "hammer", label: "Asboblar" },
];

const PUBLISHED_BADGES: Column["badges"] = {
  true: { label: "Chop etilgan", tone: "green" },
  false: { label: "Yashirin", tone: "neutral" },
};

const PUBLISHED_FILTER: Resource["filter"] = {
  param: "is_published",
  options: [
    { value: "", label: "Hammasi" },
    { value: "true", label: "Chop etilgan" },
    { value: "false", label: "Yashirin" },
  ],
};

const EVENT_STATUS_OPTIONS: Option[] = [
  { value: "upcoming", label: "Tez orada" },
  { value: "open", label: "Ro'yxat ochiq" },
  { value: "closed", label: "Ro'yxat yopilgan" },
];

const displayFields = (iconDefault?: string): Field[] => [
  ...(iconDefault ? [{ name: "icon", label: "Ikonka", type: "icon" as const }] : []),
  { name: "theme", label: "Rang", type: "theme" },
  { name: "order", label: "Tartib raqami", type: "number", help: "Kichik raqam oldinroq ko'rsatiladi" },
  { name: "isPublished", label: "Saytda ko'rsatilsin", type: "switch" },
];

export const RESOURCES: Record<string, Resource> = {
  courses: {
    key: "courses",
    endpoint: "/courses/",
    title: "Kurslar",
    singular: "Kurs",
    description: "O'quv yo'nalishlari, dasturi va narxlari",
    searchPlaceholder: "Kurs nomi yoki slug bo'yicha qidirish",
    filter: PUBLISHED_FILTER,
    titleField: "title",
    publicPath: (item) => `/courses/${item.slug}`,
    defaults: { icon: "terminal", theme: "blue", order: 0, isPublished: true, price: "Bepul" },
    sections: [
      {
        title: "Asosiy ma'lumotlar",
        fields: [
          { name: "title", label: "Kurs nomi", type: "text", required: true, placeholder: "Flutter Development" },
          { name: "slug", label: "Slug (URL)", type: "slug", help: "Bo'sh qoldirilsa nomdan avtomatik yaratiladi" },
          { name: "shortDesc", label: "Qisqa tavsif", type: "textarea", rows: 2, required: true, full: true, help: "Kartalarda ko'rinadi, 300 belgigacha" },
          { name: "description", label: "To'liq tavsif", type: "textarea", rows: 6, required: true, full: true },
        ],
      },
      {
        title: "Kurs tafsilotlari",
        fields: [
          { name: "duration", label: "Davomiyligi", type: "text", required: true, placeholder: "4 oy" },
          { name: "level", label: "Daraja", type: "text", required: true, placeholder: "Boshlang'ich → O'rta" },
          { name: "format", label: "Format", type: "text", required: true, placeholder: "Kuniga 3 soat, 5 kun" },
          { name: "price", label: "Narxi", type: "text", required: true, placeholder: "Bepul" },
          { name: "seats", label: "O'rinlar soni", type: "number", required: true },
        ],
      },
      {
        title: "O'quv dasturi",
        description: "Haftalar bo'yicha mavzular — kurs sahifasida shu tartibda chiqadi",
        fields: [
          {
            name: "curriculum", label: "Dastur", type: "repeater", full: true, addLabel: "Mavzu qo'shish",
            subFields: [
              { name: "week", label: "Hafta", type: "text", placeholder: "1-2 hafta", width: "sm:w-40 sm:flex-none" },
              { name: "topic", label: "Mavzu", type: "text", placeholder: "Dart asoslari" },
            ],
          },
          { name: "skills", label: "O'rganiladigan texnologiyalar", type: "stringList", full: true, addLabel: "Texnologiya qo'shish", placeholder: "Dart" },
          { name: "outcomes", label: "Kurs natijalari", type: "stringList", full: true, addLabel: "Natija qo'shish", placeholder: "Tayyor ilova yaratish" },
        ],
      },
      { title: "Ko'rinish", fields: displayFields("terminal") },
    ],
    columns: [
      { name: "title", label: "Kurs", type: "title", subtitle: "shortDesc" },
      { name: "duration", label: "Davomiyligi", type: "text", hideOnMobile: true },
      { name: "seats", label: "O'rinlar", type: "number", hideOnMobile: true, align: "right" },
      { name: "applicationsCount", label: "Arizalar", type: "number", align: "right" },
      { name: "isPublished", label: "Holati", type: "badge", badges: PUBLISHED_BADGES },
    ],
  },

  events: {
    key: "events",
    endpoint: "/events/",
    title: "Tadbirlar",
    singular: "Tadbir",
    description: "Xakatonlar, ideatonlar, seminarlar",
    searchPlaceholder: "Tadbir nomi, toifa yoki manzil",
    filter: {
      param: "status",
      options: [{ value: "", label: "Hammasi" }, ...EVENT_STATUS_OPTIONS],
    },
    titleField: "title",
    publicPath: (item) => `/events/${item.slug}`,
    defaults: { status: "upcoming", theme: "blue", order: 0, isPublished: true, organizer: "Andijon Yoshlar Texnoparki" },
    sections: [
      {
        title: "Asosiy ma'lumotlar",
        fields: [
          { name: "title", label: "Tadbir nomi", type: "text", required: true },
          { name: "slug", label: "Slug (URL)", type: "slug", help: "Bo'sh qoldirilsa nomdan avtomatik yaratiladi" },
          { name: "category", label: "Toifa", type: "text", required: true, placeholder: "Hackathon" },
          { name: "status", label: "Ro'yxatdan o'tish holati", type: "select", required: true, options: EVENT_STATUS_OPTIONS },
          { name: "shortDesc", label: "Qisqa tavsif", type: "textarea", rows: 2, required: true, full: true },
          { name: "description", label: "To'liq tavsif", type: "textarea", rows: 6, required: true, full: true },
        ],
      },
      {
        title: "Vaqt va joy",
        fields: [
          { name: "date", label: "Sana", type: "date", required: true },
          { name: "location", label: "Manzil", type: "text", required: true },
          { name: "startTime", label: "Boshlanish vaqti", type: "time", required: true },
          { name: "endTime", label: "Tugash vaqti", type: "time" },
          { name: "organizer", label: "Tashkilotchi", type: "text", required: true },
          { name: "seats", label: "O'rinlar soni", type: "number", required: true },
        ],
      },
      {
        title: "Dastur va shartlar",
        fields: [
          {
            name: "schedule", label: "Tadbir dasturi", type: "repeater", full: true, addLabel: "Band qo'shish",
            subFields: [
              { name: "time", label: "Vaqt", type: "time", width: "sm:w-32 sm:flex-none" },
              { name: "activity", label: "Faoliyat", type: "text", placeholder: "Ochilish marosimi" },
            ],
          },
          { name: "prizes", label: "Sovrinlar", type: "stringList", full: true, addLabel: "Sovrin qo'shish" },
          { name: "requirements", label: "Ishtirok shartlari", type: "stringList", full: true, addLabel: "Shart qo'shish" },
        ],
      },
      { title: "Ko'rinish", fields: displayFields() },
    ],
    columns: [
      { name: "title", label: "Tadbir", type: "title", subtitle: "category" },
      { name: "date", label: "Sana", type: "date" },
      {
        name: "status", label: "Ro'yxat", type: "badge", hideOnMobile: true,
        badges: {
          upcoming: { label: "Tez orada", tone: "amber" },
          open: { label: "Ochiq", tone: "green" },
          closed: { label: "Yopilgan", tone: "neutral" },
        },
      },
      { name: "applicationsCount", label: "Arizalar", type: "number", align: "right" },
      { name: "isPublished", label: "Saytda", type: "badge", badges: PUBLISHED_BADGES, hideOnMobile: true },
    ],
  },

  news: {
    key: "news",
    endpoint: "/news/",
    title: "Yangiliklar",
    singular: "Yangilik",
    description: "E'lonlar va maqolalar",
    multipart: true,
    searchPlaceholder: "Sarlavha yoki toifa",
    filter: PUBLISHED_FILTER,
    titleField: "title",
    publicPath: (item) => `/news/${item.slug}`,
    defaults: { isPublished: true, category: "Yangilik" },
    sections: [
      {
        title: "Maqola",
        fields: [
          { name: "title", label: "Sarlavha", type: "text", required: true, full: true },
          { name: "category", label: "Toifa", type: "text", required: true, placeholder: "E'lon" },
          { name: "slug", label: "Slug (URL)", type: "slug", help: "Bo'sh qoldirilsa sarlavhadan yaratiladi" },
          { name: "excerpt", label: "Qisqa matn", type: "textarea", rows: 2, required: true, full: true, help: "Ro'yxatda va SEO tavsifida ko'rinadi" },
          { name: "content", label: "To'liq matn", type: "textarea", rows: 14, required: true, full: true, help: "Paragraflarni bo'sh qator bilan ajrating" },
        ],
      },
      {
        title: "Muqova va chop etish",
        fields: [
          { name: "cover", label: "Muqova rasmi", type: "image", full: true },
          { name: "publishedAt", label: "Chop etish vaqti", type: "datetime", help: "Kelajak vaqt tanlansa, o'sha vaqtda saytda paydo bo'ladi" },
          { name: "isPublished", label: "Saytda ko'rsatilsin", type: "switch" },
        ],
      },
    ],
    columns: [
      { name: "cover", label: "", type: "image", hideOnMobile: true },
      { name: "title", label: "Sarlavha", type: "title", subtitle: "category" },
      { name: "publishedAt", label: "Chop etilgan", type: "datetime", hideOnMobile: true },
      { name: "isPublished", label: "Holati", type: "badge", badges: PUBLISHED_BADGES },
    ],
  },

  statistics: {
    key: "statistics",
    endpoint: "/statistics/",
    title: "Statistika",
    singular: "Ko'rsatkich",
    description: "Bosh sahifadagi raqamlar (5+ Yil tajriba...)",
    searchPlaceholder: "Matn bo'yicha qidirish",
    titleField: "label",
    defaults: { suffix: "+", order: 0, isPublished: true },
    sections: [
      {
        title: "Ko'rsatkich",
        fields: [
          { name: "value", label: "Qiymat", type: "number", required: true },
          { name: "suffix", label: "Belgi", type: "text", placeholder: "+", help: "Raqamdan keyin: +, %, K" },
          { name: "label", label: "Matn", type: "text", required: true, full: true, placeholder: "Yil tajriba" },
          { name: "order", label: "Tartib raqami", type: "number" },
          { name: "isPublished", label: "Saytda ko'rsatilsin", type: "switch" },
        ],
      },
    ],
    columns: [
      { name: "label", label: "Matn", type: "title" },
      { name: "value", label: "Qiymat", type: "number", align: "right" },
      { name: "order", label: "Tartib", type: "number", align: "right", hideOnMobile: true },
      { name: "isPublished", label: "Holati", type: "badge", badges: PUBLISHED_BADGES },
    ],
  },

  features: {
    key: "features",
    endpoint: "/features/",
    title: "Afzalliklar",
    singular: "Afzallik",
    description: "\"Nega aynan biz?\" bo'limi kartalari",
    searchPlaceholder: "Sarlavha bo'yicha qidirish",
    titleField: "title",
    defaults: { icon: "zap", theme: "blue", order: 0, isPublished: true },
    sections: [
      {
        title: "Karta",
        fields: [
          { name: "title", label: "Sarlavha", type: "text", required: true, full: true },
          { name: "description", label: "Tavsif", type: "textarea", rows: 3, required: true, full: true },
        ],
      },
      { title: "Ko'rinish", description: "Birinchi 2 ta karta chap ustunda, 3-si o'rtada (baland), qolganlari o'ngda", fields: displayFields("zap") },
    ],
    columns: [
      { name: "title", label: "Sarlavha", type: "title", subtitle: "description" },
      { name: "order", label: "Tartib", type: "number", align: "right", hideOnMobile: true },
      { name: "isPublished", label: "Holati", type: "badge", badges: PUBLISHED_BADGES },
    ],
  },

  equipment: {
    key: "equipment",
    endpoint: "/equipment/",
    title: "Laboratoriya",
    singular: "Jihoz",
    description: "Laboratoriya bo'limidagi jihozlar",
    multipart: true,
    searchPlaceholder: "Jihoz nomi bo'yicha qidirish",
    titleField: "title",
    defaults: { icon: "cpu", theme: "blue", order: 0, isPublished: true },
    sections: [
      {
        title: "Jihoz",
        fields: [
          { name: "title", label: "Nomi", type: "text", required: true, full: true },
          { name: "description", label: "Tavsif", type: "textarea", rows: 3, required: true, full: true },
          { name: "image", label: "Rasm", type: "image", full: true, help: "Kartaning fonida ko'rinadi" },
        ],
      },
      { title: "Ko'rinish", fields: displayFields("cpu") },
    ],
    columns: [
      { name: "image", label: "", type: "image", hideOnMobile: true },
      { name: "title", label: "Nomi", type: "title", subtitle: "description" },
      { name: "order", label: "Tartib", type: "number", align: "right", hideOnMobile: true },
      { name: "isPublished", label: "Holati", type: "badge", badges: PUBLISHED_BADGES },
    ],
  },

  partners: {
    key: "partners",
    endpoint: "/partners/",
    title: "Hamkorlar",
    singular: "Hamkor",
    description: "Hamkorlar karuseli",
    multipart: true,
    searchPlaceholder: "Hamkor nomi",
    titleField: "name",
    defaults: { order: 0, isPublished: true },
    sections: [
      {
        title: "Hamkor",
        fields: [
          { name: "name", label: "Nomi", type: "text", required: true },
          { name: "url", label: "Sayt havolasi", type: "url", placeholder: "https://" },
          { name: "logo", label: "Logotip", type: "image", full: true, help: "Shaffof fonli PNG yoki SVG tavsiya etiladi. Bo'lmasa nomi ko'rsatiladi" },
          { name: "order", label: "Tartib raqami", type: "number" },
          { name: "isPublished", label: "Saytda ko'rsatilsin", type: "switch" },
        ],
      },
    ],
    columns: [
      { name: "logo", label: "", type: "image", hideOnMobile: true },
      { name: "name", label: "Nomi", type: "title", subtitle: "url" },
      { name: "order", label: "Tartib", type: "number", align: "right", hideOnMobile: true },
      { name: "isPublished", label: "Holati", type: "badge", badges: PUBLISHED_BADGES },
    ],
  },

  "video-stories": {
    key: "video-stories",
    endpoint: "/video-stories/",
    title: "O'quvchilar natijalari",
    singular: "Natija",
    description: "Video story kartalari",
    multipart: true,
    searchPlaceholder: "O'quvchi ismi yoki natija",
    titleField: "studentName",
    defaults: { theme: "blue", order: 0, isPublished: true },
    sections: [
      {
        title: "O'quvchi",
        fields: [
          { name: "studentName", label: "O'quvchi ismi", type: "text", required: true },
          { name: "course", label: "Kurs", type: "relation", relation: "courses", help: "Ro'yxatda bo'lmasa, pastdagi maydonga yozing" },
          { name: "courseName", label: "Kurs nomi (matn)", type: "text", help: "Kurs tanlanmagan bo'lsa ko'rsatiladi" },
          { name: "result", label: "Natija", type: "text", required: true, full: true, placeholder: "Birinchi ilovasini App Store'ga joyladi" },
        ],
      },
      {
        title: "Video",
        fields: [
          { name: "videoUrl", label: "Video havolasi", type: "url", placeholder: "https://youtube.com/...", full: true },
          { name: "thumbnail", label: "Muqova rasmi", type: "image", full: true, help: "Vertikal (9:16) rasm tavsiya etiladi" },
        ],
      },
      { title: "Ko'rinish", fields: displayFields() },
    ],
    columns: [
      { name: "thumbnail", label: "", type: "image", hideOnMobile: true },
      { name: "studentName", label: "O'quvchi", type: "title", subtitle: "result" },
      { name: "courseTitle", label: "Kurs", type: "text", hideOnMobile: true },
      { name: "isPublished", label: "Holati", type: "badge", badges: PUBLISHED_BADGES },
    ],
  },
};

export const SITE_SETTINGS_SECTIONS: Section[] = [
  {
    title: "Aloqa ma'lumotlari",
    description: "Sayt footeri va aloqa sahifasida ko'rinadi",
    fields: [
      { name: "phone", label: "Telefon", type: "text", required: true, placeholder: "+998 94 893 00 17" },
      { name: "email", label: "Elektron pochta", type: "text", required: true },
      { name: "address", label: "Manzil", type: "text", required: true, full: true },
      { name: "workingHours", label: "Ish vaqti", type: "text", placeholder: "Du–Sha, 09:00–18:00" },
      { name: "mapUrl", label: "Xarita havolasi", type: "url", placeholder: "https://maps.google.com/..." },
    ],
  },
  {
    title: "Ijtimoiy tarmoqlar",
    description: "Bo'sh qoldirilgan tarmoq saytda ko'rsatilmaydi",
    fields: [
      { name: "instagramUrl", label: "Instagram", type: "url", placeholder: "https://instagram.com/..." },
      { name: "telegramUrl", label: "Telegram", type: "url", placeholder: "https://t.me/..." },
      { name: "facebookUrl", label: "Facebook", type: "url", placeholder: "https://facebook.com/..." },
      { name: "youtubeUrl", label: "YouTube", type: "url", placeholder: "https://youtube.com/..." },
    ],
  },
];

export function getResource(key: string): Resource | undefined {
  return Object.prototype.hasOwnProperty.call(RESOURCES, key) ? RESOURCES[key] : undefined;
}

export const APPLICATION_STATUS: Record<string, { label: string; tone: Tone }> = {
  new: { label: "Yangi", tone: "blue" },
  in_progress: { label: "Ko'rib chiqilmoqda", tone: "amber" },
  done: { label: "Yakunlangan", tone: "green" },
  rejected: { label: "Rad etilgan", tone: "red" },
};

export const APPLICATION_TYPE: Record<string, { label: string; tone: Tone }> = {
  contact: { label: "Xabar", tone: "neutral" },
  course: { label: "Kursga yozilish", tone: "purple" },
  event: { label: "Tadbir", tone: "blue" },
};
