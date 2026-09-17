import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, SearchX } from "lucide-react";
import { DataTable } from "@/components/dashboard/DataTable";
import { FilterTabs, Pagination, SearchInput } from "@/components/dashboard/ListControls";
import { NAV_GROUPS } from "@/components/dashboard/nav";
import { buttonVariants, Card, EmptyState, PageHeader } from "@/components/dashboard/ui";
import { dashGet, toQuery } from "@/lib/dashboard/api";
import { getResource } from "@/lib/dashboard/resources";
import type { Paginated, ResourceItem } from "@/lib/dashboard/types";

const PAGE_SIZE = 20;

type Props = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = getResource((await params).resource);
  return { title: resource?.title ?? "Topilmadi" };
}

export default async function ResourceListPage({ params, searchParams }: Props) {
  const resource = getResource((await params).resource);
  if (!resource) notFound();

  const query = await searchParams;
  const str = (value: string | string[] | undefined) => (typeof value === "string" ? value : undefined);
  const page = Math.max(1, Number(str(query.page)) || 1);
  const q = str(query.q);
  const filterValue = resource.filter ? str(query[resource.filter.param]) : undefined;

  const data = await dashGet<Paginated<ResourceItem>>(
    `${resource.endpoint}${toQuery({
      page,
      page_size: PAGE_SIZE,
      search: q,
      ...(resource.filter ? { [resource.filter.param]: filterValue } : {}),
    })}`,
  );

  const Icon = NAV_GROUPS.flatMap((group) => group.items).find((item) => item.href === `/dashboard/${resource.key}`)?.icon ?? Plus;
  const filtered = Boolean(q || filterValue);
  const newHref = `/dashboard/${resource.key}/new`;

  return (
    <>
      <PageHeader
        title={resource.title}
        description={resource.description}
        actions={
          <Link href={newHref} className={buttonVariants.primary}>
            <Plus className="h-4 w-4" /> {resource.singular} qo&apos;shish
          </Link>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-dash-border p-4 sm:flex-row sm:items-center sm:justify-between">
          {resource.filter ? <FilterTabs param={resource.filter.param} options={resource.filter.options} /> : <div />}
          <SearchInput placeholder={resource.searchPlaceholder} />
        </div>

        {data.results.length === 0 ? (
          filtered ? (
            <EmptyState icon={SearchX} title="Hech narsa topilmadi" description="Qidiruv so'zini yoki filtrni o'zgartirib ko'ring" />
          ) : (
            <EmptyState
              icon={Icon}
              title={`Hozircha ${resource.title.toLowerCase()} yo'q`}
              description="Birinchi yozuvni qo'shing — u saytda darhol paydo bo'ladi"
              action={
                <Link href={newHref} className={buttonVariants.primary}>
                  <Plus className="h-4 w-4" /> {resource.singular} qo&apos;shish
                </Link>
              }
            />
          )
        ) : (
          <>
            <DataTable resource={resource} items={data.results} />
            <Pagination count={data.count} page={page} pageSize={PAGE_SIZE} />
          </>
        )}
      </Card>
    </>
  );
}
