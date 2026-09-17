import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, SearchX } from "lucide-react";
import { StatusSelect } from "@/components/dashboard/ApplicationControls";
import { FilterTabs, Pagination, SearchInput } from "@/components/dashboard/ListControls";
import { Badge, Card, EmptyState, formatDate, formatRelative, PageHeader } from "@/components/dashboard/ui";
import { dashGet, toQuery } from "@/lib/dashboard/api";
import { APPLICATION_STATUS, APPLICATION_TYPE } from "@/lib/dashboard/resources";
import type { AdminApplication, DashboardStats, Paginated } from "@/lib/dashboard/types";

export const metadata: Metadata = { title: "Arizalar" };

const PAGE_SIZE = 20;

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function ApplicationsPage({ searchParams }: Props) {
  const query = await searchParams;
  const str = (value: string | string[] | undefined) => (typeof value === "string" ? value : undefined);
  const page = Math.max(1, Number(str(query.page)) || 1);
  const status = str(query.status);
  const type = str(query.type);
  const q = str(query.q);

  const [data, stats] = await Promise.all([
    dashGet<Paginated<AdminApplication>>(`/applications/${toQuery({ page, page_size: PAGE_SIZE, status, type, search: q })}`),
    dashGet<DashboardStats>("/stats/"),
  ]);
  const byStatus = stats.applications.byStatus;

  return (
    <>
      <PageHeader title="Arizalar" description="Saytdagi formalardan kelgan murojaatlar: kursga yozilish, tadbirga ro'yxat, xabarlar" />

      <Card>
        <div className="flex flex-col gap-3 border-b border-dash-border p-4 xl:flex-row xl:items-center xl:justify-between">
          <FilterTabs
            param="status"
            options={[
              { value: "", label: "Hammasi", count: stats.applications.total },
              ...Object.entries(APPLICATION_STATUS).map(([value, meta]) => ({
                value,
                label: meta.label,
                count: byStatus[value as keyof typeof byStatus] ?? 0,
              })),
            ]}
          />
          <SearchInput placeholder="Ism, telefon yoki xabar" />
        </div>
        <div className="border-b border-dash-border px-4 py-2">
          <FilterTabs
            param="type"
            options={[{ value: "", label: "Barcha turlar" }, ...Object.entries(APPLICATION_TYPE).map(([value, meta]) => ({ value, label: meta.label }))]}
          />
        </div>

        {data.results.length === 0 ? (
          status || type || q ? (
            <EmptyState icon={SearchX} title="Mos ariza topilmadi" description="Filtr yoki qidiruvni o'zgartirib ko'ring" />
          ) : (
            <EmptyState icon={Inbox} title="Hozircha arizalar yo'q" description="Saytdagi aloqa formasi orqali yuborilgan arizalar shu yerda ko'rinadi" />
          )
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-dash-border bg-dash-subtle/60 text-xs uppercase tracking-wide text-dash-muted">
                    <th scope="col" className="px-4 py-2.5 font-medium">Murojaatchi</th>
                    <th scope="col" className="hidden px-4 py-2.5 font-medium md:table-cell">Turi</th>
                    <th scope="col" className="hidden px-4 py-2.5 font-medium lg:table-cell">Kurs / tadbir</th>
                    <th scope="col" className="px-4 py-2.5 font-medium">Holati</th>
                    <th scope="col" className="hidden px-4 py-2.5 text-right font-medium sm:table-cell">Sana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dash-border">
                  {data.results.map((app) => (
                    <tr key={app.id} className="group relative hover:bg-dash-subtle/60">
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/applications/${app.id}`} className="block focus:outline-none">
                          <span className="flex items-center gap-2 font-medium text-dash-text group-hover:text-dash-primary">
                            {app.status === "new" && <span className="h-2 w-2 shrink-0 rounded-full bg-dash-primary" aria-label="Yangi" />}
                            {app.name}
                          </span>
                          <span className="block text-xs tabular-nums text-dash-muted">{app.phone}</span>
                          <span className="absolute inset-0" aria-hidden />
                        </Link>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <Badge tone={APPLICATION_TYPE[app.type].tone}>{APPLICATION_TYPE[app.type].label}</Badge>
                      </td>
                      <td className="hidden max-w-56 truncate px-4 py-3 text-dash-muted lg:table-cell">
                        {app.courseTitle ?? app.eventTitle ?? (app.message ? `"${app.message}"` : "—")}
                      </td>
                      <td className="px-4 py-3">
                        <StatusSelect id={app.id} status={app.status} label={app.name} />
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-right text-dash-muted sm:table-cell" title={formatDate(app.createdAt, true)}>
                        {formatRelative(app.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination count={data.count} page={page} pageSize={PAGE_SIZE} />
          </>
        )}
      </Card>
    </>
  );
}
