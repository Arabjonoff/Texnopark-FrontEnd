"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const root = () => document.documentElement;

/** `<html data-theme>` — React'dan tashqaridagi holat, shuning uchun o'zgarishi kuzatiladi */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const getSnapshot = (): Theme => (root().getAttribute("data-theme") === "dark" ? "dark" : "light");

// Server'da rejim noma'lum (u brauzerdagi tanlov yoki tizim sozlamasiga bog'liq)
const getServerSnapshot = (): Theme | null => null;

/**
 * Tungi/kunduzgi rejim tugmasi. Tanlov `localStorage` da saqlanadi va
 * `<html data-theme>` orqali qo'llanadi (boshlang'ich qiymatni `app/layout.tsx`
 * dagi inline skript sahifa chizilishidan oldin qo'yadi — miltillash bo'lmaydi).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    root().setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Maxfiy rejimda localStorage yopiq bo'lishi mumkin — tanlov shu sahifa uchun baribir ishlaydi
    }
  };

  const isDark = theme === "dark";
  const label = isDark ? "Kunduzgi rejimga o'tish" : "Tungi rejimga o'tish";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full glass text-foreground/80 transition-colors hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        className,
      )}
    >
      {/* Rejim aniqlanmaguncha (server HTML'da) ikonka chizilmaydi — noto'g'risi ko'rinib ketmaydi */}
      {theme === null ? (
        <span className="h-5 w-5" aria-hidden="true" />
      ) : isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
