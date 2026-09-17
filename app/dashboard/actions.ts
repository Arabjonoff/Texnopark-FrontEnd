"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { CONTENT_TAG } from "@/lib/api";
import { clearSession, dashRequest, DASHBOARD_API, LOGIN_PATH, setSession } from "@/lib/dashboard/api";
import { getResource, SITE_SETTINGS_SECTIONS, type Section } from "@/lib/dashboard/resources";
import type { FormErrors, FormState } from "@/lib/dashboard/types";

// --- Yordamchilar ------------------------------------------------------------------------

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function parseJson(formData: FormData, name: string): unknown[] {
  try {
    const parsed = JSON.parse(text(formData, name) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Forma maydonlarini konfiguratsiya bo'yicha API qiymatlariga aylantiradi. */
function readFields(sections: Section[], formData: FormData, multipart: boolean) {
  const values: Record<string, unknown> = {};
  const files: Record<string, File> = {};
  const clears: string[] = [];

  for (const field of sections.flatMap((section) => section.fields)) {
    const raw = text(formData, field.name);
    switch (field.type) {
      case "switch":
        values[field.name] = formData.get(field.name) === "on";
        break;
      case "number":
        values[field.name] = raw === "" ? null : Number(raw);
        break;
      case "datetime":
        // Bo'sh bo'lsa yuborilmaydi — backend hozirgi vaqtni qo'yadi
        if (raw) values[field.name] = raw;
        break;
      case "time":
      case "relation":
        values[field.name] = raw === "" ? null : raw;
        break;
      case "stringList":
        values[field.name] = parseJson(formData, field.name)
          .map((item) => String(item).trim())
          .filter(Boolean);
        break;
      case "repeater":
        values[field.name] = parseJson(formData, field.name).filter((row) =>
          Object.values(row as Record<string, string>).some((v) => String(v ?? "").trim()),
        );
        break;
      case "image": {
        const file = formData.get(field.name);
        if (file instanceof File && file.size > 0) files[field.name] = file;
        if (formData.get(`${field.name}Clear`) === "on") clears.push(field.name);
        break;
      }
      default:
        values[field.name] = raw;
    }
  }

  if (!multipart) return values;

  const body = new FormData();
  for (const [name, value] of Object.entries(values)) {
    body.set(name, value === null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value));
  }
  for (const [name, file] of Object.entries(files)) body.set(name, file);
  for (const name of clears) if (!files[name]) body.set(`${name}Clear`, "true");
  return body;
}

/** DRF xatolarini forma uchun tekis ko'rinishga keltiradi (ichki qatorlar: "3-qator: ...") */
function normalizeErrors(data: Record<string, unknown> | null): FormErrors {
  const errors: FormErrors = {};
  if (!data) return errors;
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
      errors[key] = value as string[];
    } else if (Array.isArray(value)) {
      errors[key] = value.flatMap((row, i) =>
        row && typeof row === "object" && Object.keys(row).length
          ? Object.values(row as Record<string, string[]>).flat().map((msg) => `${i + 1}-qator: ${msg}`)
          : [],
      );
    } else if (typeof value === "string") {
      errors[key] = [value];
    }
  }
  return errors;
}

function failure(status: number, data: Record<string, unknown> | null): FormState {
  if (status === 400) {
    return { status: "error", errors: normalizeErrors(data), message: "Formada xatolar bor. Belgilangan maydonlarni tekshiring." };
  }
  if (status === 403) return { status: "error", errors: {}, message: "Bu amal uchun huquqingiz yo'q." };
  return { status: "error", errors: {}, message: `Server xatosi (${status}). Birozdan keyin qayta urinib ko'ring.` };
}

// --- Auth --------------------------------------------------------------------------------

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const username = text(formData, "username");
  const password = String(formData.get("password") ?? "");
  const next = text(formData, "next");

  let res: Response;
  try {
    res = await fetch(`${DASHBOARD_API}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      cache: "no-store",
    });
  } catch {
    return { status: "error", errors: {}, message: "Server bilan aloqa yo'q. Birozdan keyin qayta urinib ko'ring." };
  }

  if (res.status === 429) {
    return { status: "error", errors: {}, message: "Juda ko'p urinish. Bir daqiqadan keyin qayta urinib ko'ring." };
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const errors = normalizeErrors(data);
    return { status: "error", errors, message: errors.nonFieldErrors?.[0] ?? "Kirishda xatolik." };
  }

  await setSession(data.token, data.expiresAt);
  // Faqat dashboard ichidagi manzilga qaytariladi (tashqi saytga yo'naltirish hujumidan himoya)
  redirect(next.startsWith("/dashboard") && !next.startsWith("//") ? next : "/dashboard");
}

export async function logout() {
  await dashRequest("/auth/logout/", { method: "POST" }).catch(() => null);
  await clearSession();
  redirect(LOGIN_PATH);
}

// --- CRUD --------------------------------------------------------------------------------

export async function saveResource(
  resourceKey: string,
  id: number | null,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const resource = getResource(resourceKey);
  if (!resource) return { status: "error", errors: {}, message: "Noma'lum bo'lim." };

  const body = readFields(resource.sections, formData, Boolean(resource.multipart));
  const result = await dashRequest(id ? `${resource.endpoint}${id}/` : resource.endpoint, {
    method: id ? "PATCH" : "POST",
    body,
  });
  if (!result.ok) return failure(result.status, result.data);

  updateTag(CONTENT_TAG);
  const intent = text(formData, "intent");
  const savedId = (result.data as { id: number }).id;
  redirect(
    intent === "continue"
      ? `/dashboard/${resource.key}/${savedId}?toast=saved`
      : `/dashboard/${resource.key}?toast=${id ? "saved" : "created"}`,
  );
}

export async function deleteResource(resourceKey: string, id: number) {
  const resource = getResource(resourceKey);
  if (!resource) return;
  const result = await dashRequest(`${resource.endpoint}${id}/`, { method: "DELETE" });
  if (!result.ok && result.status !== 404) {
    redirect(`/dashboard/${resource.key}?toast=error`);
  }
  updateTag(CONTENT_TAG);
  redirect(`/dashboard/${resource.key}?toast=deleted`);
}

// --- Arizalar ------------------------------------------------------------------------------

export async function updateApplicationStatus(id: number, status: string) {
  const result = await dashRequest(`/applications/${id}/`, { method: "PATCH", body: { status } });
  return { ok: result.ok };
}

export async function saveApplication(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  const result = await dashRequest(`/applications/${id}/`, {
    method: "PATCH",
    body: { status: text(formData, "status"), adminNote: text(formData, "adminNote") },
  });
  if (!result.ok) return failure(result.status, result.data);
  redirect(`/dashboard/applications/${id}?toast=saved`);
}

export async function deleteApplication(id: number) {
  await dashRequest(`/applications/${id}/`, { method: "DELETE" });
  redirect("/dashboard/applications?toast=deleted");
}

// --- Sayt sozlamalari ------------------------------------------------------------------------

export async function saveSiteSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  // Rasm yuklash uchun multipart
  const body = readFields(SITE_SETTINGS_SECTIONS, formData, true);
  const result = await dashRequest("/site-settings/", { method: "PUT", body });
  if (!result.ok) return failure(result.status, result.data);
  updateTag(CONTENT_TAG);
  redirect("/dashboard/settings?toast=saved");
}
