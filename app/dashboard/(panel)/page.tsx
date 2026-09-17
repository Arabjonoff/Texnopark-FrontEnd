import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Inbox, Newspaper, Plus } from "lucide-react";
import { ApplicationsChart } from "@/components/dashboard/ApplicationsChart";
import { Badge, buttonVariants, Card, CardHeader, EmptyState, formatDate, formatNumber, formatRelative, PageHeader } from "@/components/dashboard/ui";
import { dashGet, getCurrentUser } from "@/lib/dashboard/api";
import { APPLICATION_STATUS, APPLICATION_TYPE } from "@/lib/dashboard/resources";
import type { DashboardStats } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Umumiy ko'rinish" };

function StatTile({
  label,
  value,
  href,
  icon: Icon,
  hint,
  delta,
}: {
  label: string;
  value: number;
  href: string;
  icon: typeof Inbox;
  hint?: string;
  delta?: { value: number; label: string };
}) {
  const up = delta && delta.value >= 0;
  return (
    <Link href={href} className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-primary">
      <Card className="h-full p-4 transition-shadow group-hover:shadow-md sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-dash-muted sm:text-sm">{label}</p>
          <span className="hidden h-8 w-8 items-center justify-center rounded-lg bg-dash-subtle text-dash-muted group-hover:text-dash-primary sm:flex">
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-2 text-2xl font-semibold tracking-tight text-dash-text sm:mt-3 sm:text-3xl">{formatNumber(value)}</p>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-dash-muted">
          {delta && (
            <span className={cn("inline-flex items-center gap-0.5 font-medium", up ? "text-emerald-600" : "text-red-600")}>
              {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {up ? "+" : ""}
              {delta.value}
            </span>
          )}
          <span>{delta?.label ?? hint}</span>
        </div>
      </Card>
    </Link>
  );
}

export default async function DashboardHome() {
  const [stats, user] = await Promise.all([dashGet<DashboardStats>("/stats/"), getCurrentUser()]);
  const { applications } = stats;
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", timeZone: "Asia/Tashkent" }).format(new Date()));
  const greeting = hour < 12 ? "Xayrli tong" : hour < 18 ? "Xayrli kun" : "Xayrli kech";

  return (
    <>
      <PageHeader
        title={`${greeting}, ${user.fullName.split(" ")[0]}`}
        description="Sayt faoliyatining qisqacha ko'rinishi"
        actions={
          <>
            <Link href="/dashboard/news/new" className={buttonVariants.secondary}>
              <Newspaper className="h-4 w-4" /> Yangilik yozish
            </Link>
            <Link href="/dashboard/events/new" className={buttonVariants.primary}>
              <Plus className="h-4 w-4" /> Tadbir qo&apos;shish
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatTile
          label="Yangi arizalar"
          value={applications.new}
          href="/dashboard/applications?status=new"
          icon={Inbox}
          hint={applications.new ? "ko'rib chiqilishi kerak" : "hammasi ko'rib chiqilgan"}
        />
        <StatTile
          label="Arizalar (30 kun)"
          value={applications.last30Days}
          href="/dashboard/applications"
          icon={Inbox}
          delta={
            applications.last30Days || applications.previous30Days
              ? { value: applications.last30Days - applications.previous30Days, label: "oldingi 30 kunga nisbatan" }
              : undefined
          }
          hint="hali ariza kelmagan"
        />
        <StatTile label="Faol kurslar" value={stats.courses.published} href="/dashboard/courses" icon={BookOpen} hint={`jami ${stats.courses.total} ta`} />
        <StatTile label="Yaqin tadbirlar" value={stats.events.upcoming} href="/dashboard/events" icon={CalendarDays} hint={`${stats.events.open} tasida ro'yxat ochiq`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Arizalar dinamikasi" description="So'nggi 30 kun, kunlik" />
          <div className="px-5 pb-5">
            <ApplicationsChart data={applications.daily} />
          </div>
        </Card>

        <Card>
          <CardHeader title="Ariza turlari" description={`Jami ${formatNumber(applications.total)} ta`} />
          <ul className="space-y-4 px-5 pb-5">
            {Object.entries(APPLICATION_TYPE).map(([type, meta]) => {
              const count = applications.byType[type as keyof typeof applications.byType] ?? 0;
              const share = applications.total ? Math.round((count / applications.total) * 100) : 0;
              return (
                <li key={type}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-dash-text">{meta.label}</span>
                    <span className="tabular-nums text-dash-muted">
                      {count} <span className="text-xs">({share}%)</span>
                    </span>
                  </div>
                  {/* Meter: to'ldirilmagan qism ham shu rangning ochiq tusi */}
                  <div className="h-2 overflow-hidden rounded-full bg-dash-chart/15" role="presentation">
                    <div className="h-full rounded-full bg-dash-chart" style={{ width: `${share}%` }} />
                  </div>
                </li>
              );
            })}
            <li className="border-t border-dash-border pt-4">
              <p className="mb-2 text-sm text-dash-muted">Holati bo&apos;yicha</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(APPLICATION_STATUS).map(([status, meta]) => (
                  <Link key={status} href={`/dashboard/applications?status=${status}`} className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-dash-primary">
                    <Badge tone={meta.tone}>
                      {meta.label}: {applications.byStatus[status as keyof typeof applications.byStatus] ?? 0}
                    </Badge>
                  </Link>
                ))}
              </div>
            </li>
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="So'nggi arizalar"
            action={
              <Link href="/dashboard/applications" className="inline-flex items-center gap-1 text-sm font-medium text-dash-primary hover:underline">
                Barchasi <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {stats.recentApplications.length === 0 ? (
            <EmptyState icon={Inbox} title="Hozircha arizalar yo'q" description="Saytdagi forma orqali yuborilgan arizalar shu yerda ko'rinadi" />
          ) : (
            <ul className="divide-y divide-dash-border border-t border-dash-border">
              {stats.recentApplications.map((app) => (
                <li key={app.id}>
                  <Link href={`/dashboard/applications/${app.id}`} className="flex items-center gap-4 px-5 py-3 hover:bg-dash-subtle/60">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-dash-subtle text-sm font-semibold text-dash-muted">
                      {app.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-dash-text">{app.name}</p>
                      <p className="truncate text-xs text-dash-muted">
                        {APPLICATION_TYPE[app.type].label}
                        {app.courseTitle && ` · ${app.courseTitle}`}
                        {app.eventTitle && ` · ${app.eventTitle}`}
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <Badge tone={APPLICATION_STATUS[app.status].tone}>{APPLICATION_STATUS[app.status].label}</Badge>
                      <p className="mt-1 text-xs text-dash-muted">{formatRelative(app.createdAt)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Yaqin tadbirlar"
            action={
              <Link href="/dashboard/events" className="inline-flex items-center gap-1 text-sm font-medium text-dash-primary hover:underline">
                Barchasi <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          {stats.upcomingEvents.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Rejalashtirilgan tadbir yo'q"
              action={<Link href="/dashboard/events/new" className={buttonVariants.secondary}><Plus className="h-4 w-4" /> Tadbir qo&apos;shish</Link>}
            />
          ) : (
            <ul className="space-y-1 px-3 pb-3">
              {stats.upcomingEvents.map((event) => {
                const [, month, day] = event.date.split("-");
                return (
                  <li key={event.id}>
                    <Link href={`/dashboard/events/${event.id}`} className="flex items-center gap-3 rounded-lg p-2 hover:bg-dash-subtle/60">
                      <span className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-dash-border text-dash-text">
                        <span className="text-base font-bold leading-none">{Number(day)}</span>
                        <span className="text-[10px] uppercase text-dash-muted">{formatDate(event.date).split(" ")[1] ?? month}</span>
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-dash-text">{event.title}</p>
                        <p className="truncate text-xs text-dash-muted">
                          {event.startTime} · {event.applicationsCount} ta ariza
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
