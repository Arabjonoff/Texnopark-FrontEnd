"use client";

import { useActionState, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { sendApplication, type ContactFormState } from "@/app/(site)/contact/actions";
import { cn } from "@/lib/utils";
import type { ApplicationType, CourseSummary, EventSummary, FieldErrors } from "@/lib/types";

const initialState: ContactFormState = { status: "idle" };

const typeOptions: { value: ApplicationType; label: string }[] = [
  { value: "contact", label: "Xabar" },
  { value: "course", label: "Kursga yozilish" },
  { value: "event", label: "Tadbirga ro'yxat" },
];

const inputClass =
  "w-full bg-foreground/5 border border-foreground/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground";

function FieldError({ errors, name }: { errors: FieldErrors; name: keyof FieldErrors }) {
  const messages = errors[name];
  if (!messages?.length) return null;
  return (
    <p id={`${name}-error`} className="mt-1.5 text-sm text-red-500">
      {messages.join(" ")}
    </p>
  );
}

export function ContactForm({
  courses,
  events,
  initialType,
  initialCourse,
  initialEvent,
}: {
  courses: CourseSummary[];
  events: EventSummary[];
  initialType: ApplicationType;
  initialCourse?: string;
  initialEvent?: string;
}) {
  const [state, formAction, pending] = useActionState(sendApplication, initialState);
  const [type, setType] = useState<ApplicationType>(initialType);
  const openEvents = events.filter((e) => e.status !== "closed");

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-10" role="status">
        <CheckCircle className="w-14 h-14 text-emerald-500" />
        <h3 className="text-2xl font-bold">Murojaatingiz qabul qilindi!</h3>
        <p className="text-foreground/70 max-w-sm">
          Tez orada ko&apos;rsatilgan telefon raqam orqali siz bilan bog&apos;lanamiz.
        </p>
      </div>
    );
  }

  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : undefined;
  const describedBy = (name: string) => (errors[name as keyof FieldErrors] ? `${name}-error` : undefined);

  return (
    // Xatodan keyin kiritilgan qiymatlar saqlanib qolishi uchun forma qayta yaratiladi
    <form action={formAction} className="space-y-4" key={state.status === "error" ? JSON.stringify(values) : "new"} noValidate>
      <fieldset>
        <legend className="block text-sm font-medium text-foreground/70 mb-2">Murojaat turi</legend>
        <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-foreground/5 border border-foreground/10">
          {typeOptions.map((option) => (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer text-center text-sm font-semibold rounded-lg px-2 py-2 transition-colors",
                type === option.value ? "bg-blue-600 text-white shadow" : "text-foreground/70 hover:bg-foreground/5",
              )}
            >
              <input
                type="radio"
                name="type"
                value={option.value}
                checked={type === option.value}
                onChange={() => setType(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      {type === "course" && (
        <div>
          <label htmlFor="course" className="block text-sm font-medium text-foreground/70 mb-2">Kurs</label>
          <select
            id="course"
            name="course"
            defaultValue={values?.course || initialCourse || ""}
            className={inputClass}
            aria-describedby={describedBy("course")}
          >
            <option value="" disabled>Kursni tanlang</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
          <FieldError errors={errors} name="course" />
        </div>
      )}

      {type === "event" && (
        <div>
          <label htmlFor="event" className="block text-sm font-medium text-foreground/70 mb-2">Tadbir</label>
          <select
            id="event"
            name="event"
            defaultValue={values?.event || initialEvent || ""}
            className={inputClass}
            aria-describedby={describedBy("event")}
          >
            <option value="" disabled>Tadbirni tanlang</option>
            {openEvents.map((event) => (
              <option key={event.id} value={event.id}>{event.title} — {event.date}</option>
            ))}
          </select>
          <FieldError errors={errors} name="event" />
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-2">Ism</label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          defaultValue={values?.name}
          className={inputClass}
          placeholder="Ismingizni kiriting"
          aria-describedby={describedBy("name")}
        />
        <FieldError errors={errors} name="name" />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-foreground/70 mb-2">Telefon raqam</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          required
          defaultValue={values?.phone}
          className={inputClass}
          placeholder="+998 90 123 45 67"
          aria-describedby={describedBy("phone")}
        />
        <FieldError errors={errors} name="phone" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground/70 mb-2">
          Xabar{type !== "contact" && <span className="text-foreground/40"> (ixtiyoriy)</span>}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          defaultValue={values?.message}
          className={inputClass}
          placeholder="Xabaringizni yozing..."
          aria-describedby={describedBy("message")}
        />
        <FieldError errors={errors} name="message" />
      </div>

      {errors.nonFieldErrors && (
        <p className="text-sm text-red-500" role="alert">{errors.nonFieldErrors.join(" ")}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold rounded-xl px-4 py-3 hover:bg-blue-700 transition-colors disabled:opacity-60"
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin" />}
        {pending ? "Yuborilmoqda..." : "Yuborish"}
      </button>
    </form>
  );
}
