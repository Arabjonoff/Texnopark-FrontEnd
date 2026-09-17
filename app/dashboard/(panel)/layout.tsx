import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/Shell";
import { Toaster } from "@/components/dashboard/Toaster";
import { dashGet, getCurrentUser } from "@/lib/dashboard/api";
import type { DashboardStats } from "@/lib/dashboard/types";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Foydalanuvchi va menyudagi "yangi arizalar" hisoblagichi (token yaroqsiz bo'lsa login'ga yo'naltiriladi)
  const [user, stats] = await Promise.all([getCurrentUser(), dashGet<DashboardStats>("/stats/")]);

  return (
    <DashboardShell user={user} counters={{ newApplications: stats.applications.new }}>
      {children}
      <Suspense>
        <Toaster />
      </Suspense>
    </DashboardShell>
  );
}
