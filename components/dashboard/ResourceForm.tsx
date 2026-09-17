"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { saveResource, saveSiteSettings } from "@/app/dashboard/actions";
import { getResource, SITE_SETTINGS_SECTIONS, type Option } from "@/lib/dashboard/resources";
import type { FormState } from "@/lib/dashboard/types";
import { FormField } from "./FormFields";
import { buttonVariants, Card } from "./ui";

const initialState: FormState = { status: "idle" };

/**
 * Konfiguratsiya asosidagi forma. `resourceKey="site-settings"` — sayt sozlamalari (bitta yozuv).
 * Konfiguratsiya (funksiyalar bilan) serverdan uzatilmaydi — shu yerda kalit bo'yicha olinadi.
 */
export function ResourceForm({
  resourceKey,
  item,
  relations,
  cancelHref,
}: {
  resourceKey: string;
  item: Record<string, unknown> | null;
  relations?: Record<string, Option[]>;
  cancelHref: string;
}) {
  const isSettings = resourceKey === "site-settings";
  const resource = isSettings ? null : getResource(resourceKey);
  const sections = isSettings ? SITE_SETTINGS_SECTIONS : resource?.sections ?? [];
  const id = item && typeof item.id === "number" ? item.id : null;

  const action = isSettings ? saveSiteSettings : saveResource.bind(null, resourceKey, id);
  const [state, formAction, pending] = useActionState(action, initialState);
  const values = item ?? resource?.defaults ?? {};
  const errors = state.status === "error" ? state.errors : {};
  const alertRef = useRef<HTMLDivElement>(null);

  // Xato bo'lsa xabarga fokus — klaviatura va ekran o'quvchi foydalanuvchilari uchun
  useEffect(() => {
    if (state.status === "error") alertRef.current?.focus();
  }, [state]);

  // Formada backend'da mavjud bo'lmagan maydon xatosi (masalan nonFieldErrors)
  const knownFields = new Set(sections.flatMap((section) => section.fields.map((field) => field.name)));
  const otherErrors = Object.entries(errors)
    .filter(([name]) => !knownFields.has(name))
    .flatMap(([, messages]) => messages);

  return (
    <form
      action={formAction}
      // React forma action'dan keyin maydonlarni tozalaydi — xato bo'lganda kiritilgan matn yo'qolmasligi uchun
      onSubmit={(event) => {
        event.preventDefault();
        const submitter = (event.nativeEvent as SubmitEvent).submitter;
        startTransition(() => formAction(new FormData(event.currentTarget, submitter)));
      }}
      noValidate
      className="space-y-6 pb-24"
    >
      {state.status === "error" && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="flex gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-700 outline-none dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">{state.message}</p>
            {otherErrors.length > 0 && <p className="mt-1">{otherErrors.join(" ")}</p>}
          </div>
        </div>
      )}

      {sections.map((section) => (
        <Card key={section.title} className="grid gap-6 p-5 sm:p-6 lg:grid-cols-3">
          <div>
            <h2 className="text-sm font-semibold text-dash-text">{section.title}</h2>
            {section.description && <p className="mt-1 text-sm text-dash-muted">{section.description}</p>}
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
            {section.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                value={values[field.name]}
                errors={errors[field.name]}
                relationOptions={field.relation ? relations?.[field.relation] : undefined}
              />
            ))}
          </div>
        </Card>
      ))}

      {/* Doim ko'rinadigan amal paneli */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-dash-border bg-dash-surface/90 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-2 px-4 py-3 sm:px-6 lg:px-8">
          <a href={cancelHref} className={buttonVariants.ghost}>
            Bekor qilish
          </a>
          {!isSettings && (
            <button type="submit" name="intent" value="continue" disabled={pending} className={`${buttonVariants.secondary} hidden sm:inline-flex`}>
              Saqlash va davom etish
            </button>
          )}
          <button type="submit" name="intent" value="save" disabled={pending} className={buttonVariants.primary}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {pending ? "Saqlanmoqda..." : "Saqlash"}
          </button>
        </div>
      </div>
    </form>
  );
}
