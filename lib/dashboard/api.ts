import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { DashUser } from "@/lib/dashboard/types";

const API_URL = (process.env.API_URL ?? "http://127.0.0.1:8000/api").replace(/\/$/, "");
export const DASHBOARD_API = `${API_URL}/dashboard`;

// Token faqat httpOnly cookie'da — brauzerdagi JavaScript uni o'qiy olmaydi
export const TOKEN_COOKIE = "tp_dashboard_token";
export const LOGIN_PATH = "/dashboard/login";

export async function getToken() {
  return (await cookies()).get(TOKEN_COOKIE)?.value;
}

/** Faqat Server Action ichida chaqiriladi (cookie yozish renderda mumkin emas). */
export async function setSession(token: string, expiresAt: string) {
  (await cookies()).set(TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function clearSession() {
  (await cookies()).delete(TOKEN_COOKIE);
}

export type ApiResult<T = unknown> =
  | { ok: true; status: number; data: T }
  | { ok: false; status: number; data: Record<string, unknown> | null };

/**
 * Dashboard API'ga so'rov. Token bo'lmasa yoki muddati o'tgan bo'lsa login sahifasiga yo'naltiradi.
 * `body`: oddiy obyekt -> JSON, FormData -> multipart (rasm yuklash).
 */
export async function dashRequest<T = unknown>(
  path: string,
  { method = "GET", body }: { method?: string; body?: Record<string, unknown> | FormData } = {},
): Promise<ApiResult<T>> {
  const token = await getToken();
  if (!token) redirect(LOGIN_PATH);

  const headers: Record<string, string> = { Authorization: `Token ${token}` };
  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(`${DASHBOARD_API}${path}`, { method, headers, body: payload, cache: "no-store" });

  if (res.status === 401) redirect(`${LOGIN_PATH}?expired=1`);

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (res.ok) return { ok: true, status: res.status, data: data as T };
  return { ok: false, status: res.status, data };
}

/**
 * Sahifalar uchun GET: 404 -> notFound(), boshqa xato -> error.tsx.
 * Bitta so'rov davomida bir xil manzil qayta yuklanmaydi (layout va sahifa ikkalasi /stats/ ni so'raganda).
 */
const cachedGet = cache(async (path: string) => {
  const result = await dashRequest(path);
  if (result.ok) return result.data;
  if (result.status === 404) notFound();
  throw new Error(`Dashboard API ${result.status}: ${path}`);
});

export function dashGet<T>(path: string): Promise<T> {
  return cachedGet(path) as Promise<T>;
}

export const getCurrentUser = () => dashGet<DashUser>("/auth/me/");

export function toQuery(params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}
