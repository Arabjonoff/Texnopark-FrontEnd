"use client";

import { useRef, useTransition } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui";

/** O'chirish kabi qaytarib bo'lmaydigan amal uchun tasdiqlash oynasi (native <dialog>: fokus va Esc avtomatik) */
export function ConfirmButton({
  action,
  title,
  description,
  confirmLabel = "O'chirish",
  label = "O'chirish",
  compact = false,
}: {
  action: () => Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  label?: string;
  compact?: boolean;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        className={compact ? buttonVariants.icon + " hover:!text-red-600" : buttonVariants.dangerGhost}
        aria-label={compact ? label : undefined}
        title={compact ? label : undefined}
      >
        <Trash2 className="h-4 w-4" />
        {!compact && label}
      </button>

      <dialog
        ref={dialogRef}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-dash-border bg-dash-surface p-0 text-dash-text shadow-2xl backdrop:bg-slate-950/50"
        onClick={(event) => {
          if (event.target === dialogRef.current && !pending) dialogRef.current?.close();
        }}
      >
        <div className="p-6">
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-dash-muted">{description}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" className={buttonVariants.secondary} onClick={() => dialogRef.current?.close()} disabled={pending} autoFocus>
              Bekor qilish
            </button>
            <button
              type="button"
              className={cn(buttonVariants.danger)}
              disabled={pending}
              onClick={() => startTransition(() => action())}
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {confirmLabel}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
