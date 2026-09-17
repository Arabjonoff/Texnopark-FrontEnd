import "server-only";

import type {
  ApplicationInput,
  Course,
  CourseSummary,
  Equipment,
  Event,
  EventSummary,
  Feature,
  FieldErrors,
  Partner,
  Post,
  PostSummary,
  SiteSettings,
  Statistic,
  VideoStory,
} from "@/lib/types";

const API_URL = (process.env.API_URL ?? "http://127.0.0.1:8000/api").replace(/\/$/, "");

// Kontent admin panelda o'zgargandan keyin sahifalar shuncha soniyada yangilanadi (ISR)
export const REVALIDATE_SECONDS = 60;

class ApiError extends Error {
  constructor(public status: number, path: string) {
    super(`API ${status}: ${path}`);
  }
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new ApiError(res.status, path);
  return res.json();
}

/** 404 bo'lsa `undefined` qaytaradi (sahifada notFound() chaqiriladi). */
async function apiFetchOptional<T>(path: string): Promise<T | undefined> {
  try {
    return await apiFetch<T>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return undefined;
    throw error;
  }
}

/** Ro'yxatlar uchun: API ishlamasa sahifa buzilmasin, bo'sh ro'yxat ko'rsatiladi. */
async function apiFetchList<T>(path: string): Promise<T[]> {
  try {
    return await apiFetch<T[]>(path);
  } catch (error) {
    console.error(`[api] ${path} yuklanmadi:`, error);
    return [];
  }
}

// Kurslar va tadbirlar
export const getCourses = () => apiFetchList<CourseSummary>("/courses/");

export const getCourse = (slug: string) =>
  apiFetchOptional<Course>(`/courses/${encodeURIComponent(slug)}/`);

export const getEvents = () => apiFetchList<EventSummary>("/events/");

export const getEvent = (slug: string) =>
  apiFetchOptional<Event>(`/events/${encodeURIComponent(slug)}/`);

// Yangiliklar
export const getPosts = () => apiFetchList<PostSummary>("/news/");

export const getPost = (slug: string) =>
  apiFetchOptional<Post>(`/news/${encodeURIComponent(slug)}/`);

// Sayt bo'limlari
export const getStatistics = () => apiFetchList<Statistic>("/statistics/");
export const getFeatures = () => apiFetchList<Feature>("/features/");
export const getEquipment = () => apiFetchList<Equipment>("/equipment/");
export const getPartners = () => apiFetchList<Partner>("/partners/");
export const getVideoStories = () => apiFetchList<VideoStory>("/video-stories/");

/** Footer va aloqa sahifasi uchun. Ishlamasa `undefined` — layout buzilmaydi. */
export async function getSiteSettings(): Promise<SiteSettings | undefined> {
  try {
    return await apiFetchOptional<SiteSettings>("/site-settings/");
  } catch (error) {
    console.error("[api] /site-settings/ yuklanmadi:", error);
    return undefined;
  }
}

export type SubmitResult = { ok: true } | { ok: false; errors: FieldErrors };

/** Formani backend'ga yuboradi. `clientIp` spamga qarshi cheklov to'g'ri ishlashi uchun uzatiladi. */
export async function submitApplication(input: ApplicationInput, clientIp?: string): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/applications/`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(clientIp ? { "X-Forwarded-For": clientIp } : {}),
      },
      body: JSON.stringify(input),
    });
  } catch (error) {
    console.error("[api] /applications/ yuborilmadi:", error);
    return { ok: false, errors: { nonFieldErrors: ["Server bilan aloqa yo'q. Birozdan keyin qayta urinib ko'ring."] } };
  }

  if (res.ok) return { ok: true };
  if (res.status === 429) {
    return { ok: false, errors: { nonFieldErrors: ["Juda ko'p so'rov yuborildi. Birozdan keyin qayta urinib ko'ring."] } };
  }
  if (res.status === 400) {
    return { ok: false, errors: await res.json() };
  }
  return { ok: false, errors: { nonFieldErrors: ["Xatolik yuz berdi. Iltimos, telefon orqali bog'laning."] } };
}
