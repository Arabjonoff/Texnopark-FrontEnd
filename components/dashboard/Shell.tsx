"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ExternalLink, LogOut, Menu, X } from "lucide-react";
import { logout } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";
import type { DashUser } from "@/lib/dashboard/types";
import { findActiveItem, NAV_GROUPS } from "./nav";
import { buttonVariants } from "./ui";

type Counters = { newApplications: number };

function Brand() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 px-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-dash-primary text-xs font-bold text-white">YT</span>
      <span className="leading-tight">
        <span className="block text-sm font-bold text-dash-text">Yoshlar Texnoparki</span>
        <span className="block text-xs text-dash-muted">Boshqaruv paneli</span>
      </span>
    </Link>
  );
}

function SidebarNav({ counters, onNavigate }: { counters: Counters; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = findActiveItem(pathname);

  return (
    <nav aria-label="Dashboard menyusi" className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-dash-muted/80">{group.label}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = active?.href === item.href;
              const badge = item.badgeKey ? counters[item.badgeKey] : 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-dash-primary/10 text-dash-primary"
                        : "text-dash-muted hover:bg-dash-subtle hover:text-dash-text",
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {badge > 0 && (
                      <span className="min-w-5 rounded-full bg-dash-primary px-1.5 text-center text-[11px] font-semibold leading-5 text-white">
                        {badge > 99 ? "99+" : badge}
                        <span className="sr-only"> ta yangi</span>
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function UserMenu({ user }: { user: DashUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : !ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const initials = user.fullName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-lg p-1 pr-2 text-sm hover:bg-dash-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dash-primary"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-dash-primary/15 text-xs font-bold text-dash-primary">
          {initials}
        </span>
        <span className="hidden max-w-32 truncate font-medium text-dash-text sm:block">{user.fullName}</span>
        <ChevronDown className="h-4 w-4 text-dash-muted" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-dash-border bg-dash-surface p-1.5 shadow-lg">
          <div className="border-b border-dash-border px-3 py-2">
            <p className="truncate text-sm font-semibold text-dash-text">{user.fullName}</p>
            <p className="truncate text-xs text-dash-muted">{user.email || user.username}</p>
          </div>
          <a
            role="menuitem"
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-dash-text hover:bg-dash-subtle"
          >
            <ExternalLink className="h-4 w-4 text-dash-muted" /> Saytni ochish
          </a>
          <form action={logout}>
            <button role="menuitem" type="submit" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-500/10">
              <LogOut className="h-4 w-4" /> Chiqish
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export function DashboardShell({
  user,
  counters,
  children,
}: {
  user: DashUser;
  counters: Counters;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const active = findActiveItem(pathname);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-dash-bg text-dash-text">
      <a href="#dashboard-main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-dash-surface focus:px-4 focus:py-2">
        Asosiy qismga o&apos;tish
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-dash-border bg-dash-surface lg:flex">
        <div className="flex h-16 items-center border-b border-dash-border px-3">
          <Brand />
        </div>
        <SidebarNav counters={counters} />
      </aside>

      {/* Mobil sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menyu">
          <div className="absolute inset-0 bg-slate-950/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-dash-surface shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-dash-border px-3">
              <Brand />
              <button type="button" className={buttonVariants.icon} onClick={() => setMobileOpen(false)} aria-label="Menyuni yopish">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav counters={counters} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-dash-border bg-dash-surface/85 px-4 backdrop-blur sm:px-6">
          <button type="button" className={cn(buttonVariants.icon, "lg:hidden")} onClick={() => setMobileOpen(true)} aria-label="Menyuni ochish">
            <Menu className="h-5 w-5" />
          </button>
          <p className="min-w-0 flex-1 truncate text-sm text-dash-muted">
            <span className="hidden sm:inline">Boshqaruv paneli</span>
            {active && active.href !== "/dashboard" && (
              <>
                <span className="mx-2 hidden sm:inline" aria-hidden>/</span>
                <span className="font-medium text-dash-text">{active.label}</span>
              </>
            )}
          </p>
          <UserMenu user={user} />
        </header>

        <main id="dashboard-main" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
