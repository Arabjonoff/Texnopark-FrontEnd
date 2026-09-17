import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { PageHeader } from "@/components/dashboard/ui";
import { getResource } from "@/lib/dashboard/resources";
import { loadRelations } from "@/lib/dashboard/relations";

type Props = { params: Promise<{ resource: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = getResource((await params).resource);
  return { title: resource ? `Yangi: ${resource.singular}` : "Topilmadi" };
}

export default async function NewResourcePage({ params }: Props) {
  const resource = getResource((await params).resource);
  if (!resource) notFound();

  const listHref = `/dashboard/${resource.key}`;
  return (
    <>
      <PageHeader title={`Yangi ${resource.singular.toLowerCase()}`} back={{ href: listHref, label: resource.title }} />
      <ResourceForm resourceKey={resource.key} item={null} relations={await loadRelations(resource)} cancelHref={listHref} />
    </>
  );
}
