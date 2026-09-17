"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const MESSAGES: Record<string, { text: string; error?: boolean }> = {
  saved: { text: "O'zgarishlar saqlandi" },
  created: { text: "Muvaffaqiyatli yaratildi" },
  deleted: { text: "O'chirildi" },
  error: { text: "Amal bajarilmadi. Qayta urinib ko'ring", error: true },
};

/** Server action'dan keyin `?toast=saved` bilan kelgan xabarni ko'rsatadi va URL'ni tozalaydi */
export function Toaster() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [toast, setToast] = useState<{ text: string; error?: boolean } | null>(null);

  const key = params.get("toast");

  useEffect(() => {
    if (!key || !MESSAGES[key]) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL'dagi bir martalik xabarni ko'rsatish
    setToast(MESSAGES[key]);
    const rest = new URLSearchParams(params.toString());
    rest.delete("toast");
    router.replace(rest.size ? `${pathname}?${rest}` : pathname, { scroll: false });
  }, [key, params, pathname, router]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  const Icon = toast.error ? AlertCircle : CheckCircle2;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4 sm:justify-end sm:px-6" aria-live="polite">
      <div
        role={toast.error ? "alert" : "status"}
        className="pointer-events-auto flex items-center gap-3 rounded-xl border border-dash-border bg-dash-surface py-3 pl-4 pr-2 text-sm text-dash-text shadow-lg"
      >
        <Icon className={toast.error ? "h-5 w-5 text-red-500" : "h-5 w-5 text-emerald-500"} />
        <span className="font-medium">{toast.text}</span>
        <button type="button" onClick={() => setToast(null)} className="rounded-md p-1 text-dash-muted hover:bg-dash-subtle hover:text-dash-text" aria-label="Yopish">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
