import type { EventStatus, Theme } from "@/lib/types";

type ThemeClasses = {
  /** To'liq rang: ikonka foni, tugmalar */
  solid: string;
  /** Detal sahifa banneri gradienti */
  soft: string;
  /** "Nega aynan biz?" kartasi gradienti */
  fade: string;
  /** Laboratoriya kartasi foni */
  tint: string;
  /** Video story kartasi foni (rasm yo'q bo'lsa) */
  dark: string;
};

// API faqat kalit qaytaradi; Tailwind class'lari shu yerda to'liq yozilgan bo'lishi shart
// (dinamik yig'ilgan class'larni Tailwind topa olmaydi).
export const themeClasses: Record<Theme, ThemeClasses> = {
  blue: { solid: "bg-blue-500", soft: "from-blue-500/20 to-blue-500/5", fade: "from-blue-500/10 to-transparent", tint: "bg-blue-500/10", dark: "bg-blue-900/40" },
  cyan: { solid: "bg-cyan-500", soft: "from-cyan-500/20 to-cyan-500/5", fade: "from-cyan-500/10 to-transparent", tint: "bg-cyan-500/10", dark: "bg-cyan-900/40" },
  purple: { solid: "bg-purple-500", soft: "from-purple-500/20 to-purple-500/5", fade: "from-purple-500/10 to-transparent", tint: "bg-purple-500/10", dark: "bg-purple-900/40" },
  yellow: { solid: "bg-yellow-500", soft: "from-yellow-500/20 to-yellow-500/5", fade: "from-yellow-500/10 to-transparent", tint: "bg-yellow-500/10", dark: "bg-yellow-900/40" },
  red: { solid: "bg-red-500", soft: "from-red-500/20 to-red-500/5", fade: "from-red-500/10 to-transparent", tint: "bg-red-500/10", dark: "bg-red-900/40" },
  emerald: { solid: "bg-emerald-500", soft: "from-emerald-500/20 to-emerald-500/5", fade: "from-emerald-500/10 to-transparent", tint: "bg-emerald-500/10", dark: "bg-emerald-900/40" },
  orange: { solid: "bg-orange-500", soft: "from-orange-500/20 to-orange-500/5", fade: "from-orange-500/10 to-transparent", tint: "bg-orange-500/10", dark: "bg-orange-900/40" },
};

export function getTheme(theme: string) {
  return themeClasses[theme as Theme] ?? themeClasses.blue;
}

export const eventStatusLabels: Record<EventStatus, { label: string; className: string }> = {
  open: { label: "Ro'yxatdan o'tish ochiq", className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  upcoming: { label: "Tez orada", className: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  closed: { label: "Ro'yxatdan o'tish yopilgan", className: "bg-foreground/10 text-foreground/60" },
};
