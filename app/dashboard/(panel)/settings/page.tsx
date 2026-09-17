import type { Metadata } from "next";
import { ResourceForm } from "@/components/dashboard/ResourceForm";
import { formatDate, PageHeader } from "@/components/dashboard/ui";
import { dashGet } from "@/lib/dashboard/api";

export const metadata: Metadata = { title: "Sayt sozlamalari" };

export default async function SettingsPage() {
  const settings = await dashGet<Record<string, unknown>>("/site-settings/");
  const updatedAt = typeof settings.updatedAt === "string" ? settings.updatedAt : null;

  return (
    <>
      <PageHeader
        title="Sayt sozlamalari"
        description={updatedAt ? `Oxirgi o'zgarish: ${formatDate(updatedAt, true)}` : "Aloqa ma'lumotlari va ijtimoiy tarmoqlar"}
      />
      <ResourceForm key={updatedAt ?? "new"} resourceKey="site-settings" item={settings} cancelHref="/dashboard" />
    </>
  );
}
