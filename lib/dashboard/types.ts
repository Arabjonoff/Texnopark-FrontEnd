// Dashboard API (Texnopark-Back: apps/dashboard) javob tiplari

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type DashUser = {
  id: number;
  username: string;
  fullName: string;
  email: string;
  isSuperuser: boolean;
  lastLogin: string | null;
};

export type ApplicationStatus = "new" | "in_progress" | "done" | "rejected";
export type ApplicationKind = "contact" | "course" | "event";

export type AdminApplication = {
  id: number;
  type: ApplicationKind;
  name: string;
  phone: string;
  message: string;
  course: number | null;
  courseTitle: string | null;
  event: number | null;
  eventTitle: string | null;
  status: ApplicationStatus;
  adminNote: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminEventSummary = {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  startTime: string;
  location: string;
  seats: number;
  status: "upcoming" | "open" | "closed";
  applicationsCount: number;
};

export type DashboardStats = {
  applications: {
    total: number;
    new: number;
    last30Days: number;
    previous30Days: number;
    byType: Partial<Record<ApplicationKind, number>>;
    byStatus: Partial<Record<ApplicationStatus, number>>;
    daily: { date: string; count: number }[];
  };
  courses: { total: number; published: number };
  events: { total: number; upcoming: number; open: number };
  news: { total: number; published: number };
  recentApplications: AdminApplication[];
  upcomingEvents: AdminEventSummary[];
};

/** Umumiy CRUD yozuvi: maydonlar resurs konfiguratsiyasi (resources.ts) bilan tavsiflanadi */
export type ResourceItem = { id: number } & Record<string, unknown>;

export type FormErrors = Record<string, string[]>;

export type FormState =
  | { status: "idle" }
  | { status: "error"; errors: FormErrors; message?: string };
