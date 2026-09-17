"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Qidiruv: yozish to'xtagach 350ms dan keyin URL yangilanadi (sahifa 1 ga qaytadi) */
export function SearchInput({ placeholder }: { placeholder: string }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const current = params.get("q") ?? "";
  const [value, setValue] = useState(current);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (value.trim() === current) return;
    const timer = setTimeout(() => {
      const next = new URLSearchParams(params.toString());
      if (value.trim()) next.set("q", value.trim());
      else next.delete("q");
      next.delete("page");
      startTransition(() => router.replace(next.size ? `${pathname}?${next}` : pathname, { scroll: false }));
    }, 350);
    return () => clearTimeout(timer);
  }, [value, current, params, pathname, router]);

  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dash-muted" />
      <input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-lg border border-dash-border bg-dash-surface pl-9 pr-9 text-sm text-dash-text placeholder:text-dash-muted/70 focus:border-dash-primary focus:outline-none focus:ring-2 focus:ring-dash-primary/20 [&::-webkit-search-cancel-button]:hidden"
      />
      {pending ? (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-dash-muted" />
      ) : (
        value && (
          <button type="button" onClick={() => setValue("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-dash-muted hover:text-dash-text" aria-label="Qidiruvni tozalash">
            <X className="h-3.5 w-3.5" />
          </button>
        )
      )}
    </div>
  );
}

function hrefWith(pathname: string, params: URLSearchParams, updates: Record<string, string | null>) {
  const next = new URLSearchParams(params.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value) next.set(key, value);
    else next.delete(key);
  }
  return next.size ? `${pathname}?${next}` : pathname;
}

/** Holat bo'yicha tezkor filtr tablari */
export function FilterTabs({
  param,
  options,
}: {
  param: string;
  options: { value: string; label: string; count?: number }[];
}) {
  const params = useSearchParams();
  const pathname = usePathname();
  const current = params.get(param) ?? "";

  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg bg-dash-subtle p-1" role="tablist">
      {options.map((option) => {
        const active = current === option.value;
        return (
          <Link
            key={option.value || "all"}
            role="tab"
            aria-selected={active}
            href={hrefWith(pathname, params, { [param]: option.value || null, page: null })}
            scroll={false}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-dash-surface text-dash-text shadow-sm" : "text-dash-muted hover:text-dash-text",
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cn("rounded-full px-1.5 text-xs tabular-nums", active ? "bg-dash-subtle" : "bg-dash-surface/60")}>
                {option.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export function Pagination({ count, page, pageSize }: { count: number; page: number; pageSize: number }) {
  const params = useSearchParams();
  const pathname = usePathname();
  const pages = Math.max(1, Math.ceil(count / pageSize));
  if (count === 0) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, count);
  const link = (target: number) => hrefWith(pathname, params, { page: target > 1 ? String(target) : null });
  const disabled = "pointer-events-none opacity-40";

  return (
    <div className="flex items-center justify-between gap-4 border-t border-dash-border px-4 py-3 text-sm text-dash-muted">
      <p>
        <span className="font-medium text-dash-text tabular-nums">{from}–{to}</span> / {count} ta
      </p>
      {pages > 1 && (
        <div className="flex items-center gap-1">
          <Link href={link(page - 1)} aria-label="Oldingi sahifa" aria-disabled={page <= 1} className={cn("rounded-lg border border-dash-border p-1.5 hover:bg-dash-subtle", page <= 1 && disabled)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <span className="px-2 tabular-nums">
            {page} / {pages}
          </span>
          <Link href={link(page + 1)} aria-label="Keyingi sahifa" aria-disabled={page >= pages} className={cn("rounded-lg border border-dash-border p-1.5 hover:bg-dash-subtle", page >= pages && disabled)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
