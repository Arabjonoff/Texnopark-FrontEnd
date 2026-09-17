import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/dashboard/resources";

// --- Tugmalar ------------------------------------------------------------------------------

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dash-primary focus-visible:ring-offset-2 focus-visible:ring-offset-dash-bg disabled:opacity-60 disabled:pointer-events-none";

export const buttonVariants = {
  primary: `${buttonBase} h-9 px-4 bg-dash-primary text-white hover:bg-dash-primary-hover shadow-sm`,
  secondary: `${buttonBase} h-9 px-4 bg-dash-surface text-dash-text border border-dash-border hover:bg-dash-subtle`,
  ghost: `${buttonBase} h-9 px-3 text-dash-muted hover:text-dash-text hover:bg-dash-subtle`,
  danger: `${buttonBase} h-9 px-4 bg-red-600 text-white hover:bg-red-700 shadow-sm`,
  dangerGhost: `${buttonBase} h-9 px-3 text-red-600 hover:bg-red-500/10`,
  icon: `${buttonBase} h-9 w-9 text-dash-muted hover:text-dash-text hover:bg-dash-subtle`,
};

// --- Karta va sarlavhalar ------------------------------------------------------------------------

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-dash-border bg-dash-surface shadow-[0_1px_2px_rgba(15,23,42,0.04)]", className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-dash-text">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-dash-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="mb-3 inline-flex items-center gap-1 text-sm text-dash-muted hover:text-dash-text">
          <span aria-hidden>←</span> {back.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-dash-text">{title}</h1>
          {description && <p className="mt-1 text-sm text-dash-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

// --- Badge -------------------------------------------------------------------------------------

const toneClasses: Record<Tone, { badge: string; dot: string }> = {
  neutral: { badge: "bg-slate-500/10 text-slate-600 dark:text-slate-300", dot: "bg-slate-400" },
  blue: { badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
  green: { badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  amber: { badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
  red: { badge: "bg-red-500/10 text-red-700 dark:text-red-300", dot: "bg-red-500" },
  purple: { badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
};

/** Holat belgisi: rang + nuqta + matn (rang yolg'iz ma'no tashimaydi) */
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap", toneClasses[tone].badge)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", toneClasses[tone].dot)} aria-hidden />
      {children}
    </span>
  );
}

// --- Bo'sh holat ---------------------------------------------------------------------------------

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-dash-subtle text-dash-muted">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-dash-text">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-dash-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// --- Formatlash --------------------------------------------------------------------------------

const MONTHS = ["yan", "fev", "mar", "apr", "may", "iyn", "iyl", "avg", "sen", "okt", "noy", "dek"];

export function formatDate(value: string | null | undefined, withTime = false) {
  if (!value) return "—";
  // "2026-10-12" yoki "2026-09-17T18:28:56+05:00" — Toshkent vaqti bilan keladi, qayta hisoblanmaydi
  const [datePart, timePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const base = `${day} ${MONTHS[month - 1]} ${year}`;
  return withTime && timePart ? `${base}, ${timePart.slice(0, 5)}` : base;
}

export function formatRelative(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "hozirgina";
  if (minutes < 60) return `${minutes} daqiqa oldin`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} soat oldin`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} kun oldin`;
  return formatDate(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("uz-UZ").format(value);
}
