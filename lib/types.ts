// Django REST API javob tiplari (Texnopark-Back: apps/*/serializers.py)

export type Theme = "blue" | "cyan" | "purple" | "yellow" | "red" | "emerald" | "orange";

export type IconName =
  | "smartphone" | "terminal" | "layers" | "cpu" | "box"
  | "briefcase" | "rocket" | "zap" | "users" | "trophy"
  | "printer" | "monitor" | "hammer";

export type CourseSummary = {
  id: string;
  title: string;
  shortDesc: string;
  icon: IconName;
  theme: Theme;
  duration: string;
  level: string;
  price: string;
  seats: number;
};

export type Course = CourseSummary & {
  description: string;
  format: string;
  skills: string[];
  curriculum: { week: string; topic: string }[];
  outcomes: string[];
};

export type EventStatus = "upcoming" | "open" | "closed";

export type EventSummary = {
  id: string;
  title: string;
  category: string;
  date: string;
  dateIso: string;
  time: string;
  location: string;
  shortDesc: string;
  theme: Theme;
  seats: number;
  status: EventStatus;
};

export type Event = EventSummary & {
  description: string;
  prizes: string[];
  schedule: { time: string; activity: string }[];
  requirements: string[];
  organizer: string;
};

export type SiteSettings = {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  mapUrl: string;
  instagramUrl: string;
  telegramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  heroImage: string | null;
  heroVideoUrl: string;
};

export type Statistic = {
  id: number;
  value: number;
  suffix: string;
  label: string;
};

export type Feature = {
  id: number;
  title: string;
  description: string;
  icon: IconName;
  theme: Theme;
};

export type Equipment = Feature & {
  image: string | null;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  photo: string | null;
  bio: string;
  telegramUrl: string;
  linkedinUrl: string;
};

export type Partner = {
  id: number;
  name: string;
  logo: string | null;
  url: string;
};

export type VideoStory = {
  id: number;
  studentName: string;
  course: string;
  courseSlug: string | null;
  result: string;
  videoUrl: string;
  thumbnail: string | null;
  theme: Theme;
};

export type PostSummary = {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  cover: string | null;
  date: string;
  publishedAt: string;
};

export type Post = PostSummary & {
  content: string;
};

export type ApplicationType = "contact" | "course" | "event";

export type ApplicationInput = {
  type: ApplicationType;
  name: string;
  phone: string;
  message?: string;
  course?: string | null;
  event?: string | null;
};

/** Backend validatsiya xatolari: maydon nomi -> xabarlar */
export type FieldErrors = Partial<Record<keyof ApplicationInput | "nonFieldErrors", string[]>>;
