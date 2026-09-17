import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { deleteResource } from "@/app/dashboard/actions";
import { ConfirmButton } from "@/components/dashboard/ConfirmButton";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { buttonVariants, formatDate, PageHeader } from "@/components/dashboard/ui";
import { dashGet } from "@/lib/dashboard/api";
import { getResource } from "@/lib/dashboard/resources";
import { loadRelations } from "@/lib/dashboard/relations";
import type { ResourceItem } from "@/lib/dashboard/types";

type Props = { params: Promise<{ resource: string; id: string }> };

async function load({ params }: Props) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource || !/^\d+$/.test(id)) notFound();
  const item = await dashGet<ResourceItem>(`${resource.endpoint}${id}/`);
  return { resource, item };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { resource, item } = await load(props);
  return { title: String(item[resource.titleField] ?? resource.singular) };
}

export default async function EditResourcePage(props: Props) {
  const { resource, item } = await load(props);
  const listHref = `/dashboard/${resource.key}`;
  const title = String(item[resource.titleField] ?? resource.singular);
  const publicPath = resource.publicPath?.(item);
  const updatedAt = typeof item.updatedAt === "string" ? item.updatedAt : null;

  return (
    <>
      <PageHeader
        title={title}
        description={updatedAt ? `Oxirgi o'zgarish: ${formatDate(updatedAt, true)}` : undefined}
        back={{ href: listHref, label: resource.title }}
        actions={
          <>
            {publicPath && item.isPublished !== false && (
              <a href={publicPath} target="_blank" rel="noopener noreferrer" className={buttonVariants.secondary}>
                <ExternalLink className="h-4 w-4" /> Saytda ko&apos;rish
              </a>
            )}
            <ConfirmButton
              title={`${resource.singular}ni o'chirasizmi?`}
              description={`"${title}" butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.`}
              action={deleteResource.bind(null, resource.key, item.id)}
            />
          </>
        }
      />
      <ResourceForm
        // Saqlangandan keyin yangi ma'lumot bilan forma qayta yaratiladi
        key={updatedAt ?? item.id}
        resourceKey={resource.key}
        item={item}
        relations={await loadRelations(resource)}
        cancelHref={listHref}
      />
    </>
  );
}
