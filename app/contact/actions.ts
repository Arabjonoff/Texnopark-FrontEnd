"use server";

import { headers } from "next/headers";
import { submitApplication } from "@/lib/api";
import type { ApplicationType, FieldErrors } from "@/lib/types";

export type ContactFormState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; errors: FieldErrors; values: Record<string, string> };

const TYPES: ApplicationType[] = ["contact", "course", "event"];

function field(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function sendApplication(_prev: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const rawType = field(formData, "type");
  const type = TYPES.includes(rawType as ApplicationType) ? (rawType as ApplicationType) : "contact";

  const values = {
    type,
    name: field(formData, "name"),
    phone: field(formData, "phone"),
    message: field(formData, "message"),
    course: field(formData, "course"),
    event: field(formData, "event"),
  };

  // Spamga qarshi cheklov backend'da IP bo'yicha ishlaydi — foydalanuvchi IP'sini uzatamiz
  const headerList = await headers();
  const clientIp = headerList.get("x-forwarded-for")?.split(",")[0].trim() ?? headerList.get("x-real-ip") ?? undefined;

  const result = await submitApplication(
    {
      type,
      name: values.name,
      phone: values.phone,
      message: values.message,
      course: type === "course" ? values.course || null : null,
      event: type === "event" ? values.event || null : null,
    },
    clientIp,
  );

  if (result.ok) return { status: "success" };
  return { status: "error", errors: result.errors, values };
}
