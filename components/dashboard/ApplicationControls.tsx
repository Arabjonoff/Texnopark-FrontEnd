"use client";

import { startTransition, useActionState, useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { saveApplication, updateApplicationStatus } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";
import { APPLICATION_STATUS } from "@/lib/dashboard/resources";
import type { FormState } from "@/lib/dashboard/types";
import { inputClass } from "./FormFields";
import { buttonVariants } from "./ui";

const statusTone: Record<string, string> = {
  new: "text-blue-700 bg-blue-500/10 dark:text-blue-300",
  in_progress: "text-amber-700 bg-amber-500/10 dark:text-amber-300",
  done: "text-emerald-700 bg-emerald-500/10 dark:text-emerald-300",
  rejected: "text-red-700 bg-red-500/10 dark:text-red-300",
};

/** Jadvalda holatni tezkor o'zgartirish (optimistik — natija kutilmasdan ko'rsatiladi) */
export function StatusSelect({ id, status, label }: { id: number; status: string; label: string }) {
  const router = useRouter();
  const [optimistic, setOptimistic] = useOptimistic(status);
  const [pending, start] = useTransition();

  return (
    <div className="relative z-10 inline-flex items-center gap-1.5">
      <span className="relative inline-flex items-center">
      <select
        value={optimistic}
        aria-label={`${label} — holati`}
        disabled={pending}
        onChange={(event) => {
          const next = event.target.value;
          start(async () => {
            setOptimistic(next);
            await updateApplicationStatus(id, next);
            router.refresh();
          });
        }}
        className={cn(
          "cursor-pointer appearance-none rounded-full border-0 py-1 pl-2.5 pr-6 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-dash-primary",
          statusTone[optimistic],
        )}
      >
        {Object.entries(APPLICATION_STATUS).map(([value, { label: text }]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-1.5 h-3 w-3 opacity-60" aria-hidden />
      </span>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-dash-muted" />}
    </div>
  );
}

const initialState: FormState = { status: "idle" };

export function ApplicationForm({ id, status, adminNote }: { id: number; status: string; adminNote: string }) {
  const [state, formAction, pending] = useActionState(saveApplication.bind(null, id), initialState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(() => formAction(new FormData(event.currentTarget)));
      }}
      className="space-y-5"
    >
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-dash-text">Holati</legend>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(APPLICATION_STATUS).map(([value, { label }]) => (
            <label key={value} className="cursor-pointer">
              <input type="radio" name="status" value={value} defaultChecked={status === value} className="peer sr-only" />
              <span className="flex items-center justify-center rounded-lg border border-dash-border px-3 py-2 text-sm font-medium text-dash-muted transition-colors hover:bg-dash-subtle peer-checked:border-dash-primary peer-checked:bg-dash-primary/10 peer-checked:text-dash-primary peer-focus-visible:ring-2 peer-focus-visible:ring-dash-primary">
                {label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="adminNote" className="mb-1.5 block text-sm font-medium text-dash-text">
          Ichki izoh
        </label>
        <textarea id="adminNote" name="adminNote" rows={4} defaultValue={adminNote} placeholder="Masalan: qo'ng'iroq qilindi, 20-sentabr guruhiga yozildi" className={inputClass} />
        <p className="mt-1.5 text-xs text-dash-muted">Faqat dashboard&apos;da ko&apos;rinadi</p>
      </div>
      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600">{state.message}</p>
      )}
      <button type="submit" disabled={pending} className={cn(buttonVariants.primary, "w-full")}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {pending ? "Saqlanmoqda..." : "Saqlash"}
      </button>
    </form>
  );
}
