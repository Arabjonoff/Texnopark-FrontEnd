import Link from "next/link";
import { ExternalLink, ImageIcon, Pencil } from "lucide-react";
import { deleteResource } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";
import type { Column, Resource } from "@/lib/dashboard/resources";
import type { ResourceItem } from "@/lib/dashboard/types";
import { ConfirmButton } from "./ConfirmButton";
import { Badge, buttonVariants, formatDate } from "./ui";

function Cell({ column, item, href }: { column: Column; item: ResourceItem; href: string }) {
  const value = item[column.name];

  switch (column.type) {
    case "title":
      return (
        <Link href={href} className="block min-w-0 max-w-md focus:outline-none">
          <span className="block truncate font-medium text-dash-text group-hover:text-dash-primary">{String(value ?? "—")}</span>
          {column.subtitle && item[column.subtitle] ? (
            <span className="mt-0.5 block truncate text-xs text-dash-muted">{String(item[column.subtitle])}</span>
          ) : null}
          {/* Butun qator bosiladigan bo'lishi uchun */}
          <span className="absolute inset-0" aria-hidden />
        </Link>
      );
    case "badge": {
      const badge = column.badges?.[String(value)];
      return badge ? <Badge tone={badge.tone}>{badge.label}</Badge> : <span className="text-dash-muted">—</span>;
    }
    case "image":
      return typeof value === "string" && value ? (
        // eslint-disable-next-line @next/next/no-img-element -- API'dan kelgan kichik ko'rinish
        <img src={value} alt="" className="h-10 w-10 rounded-md border border-dash-border object-cover" />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-dash-subtle text-dash-muted">
          <ImageIcon className="h-4 w-4" />
        </span>
      );
    case "date":
    case "datetime":
      return <span className="whitespace-nowrap text-dash-muted">{formatDate(value as string, column.type === "datetime")}</span>;
    case "number":
      return <span className="tabular-nums text-dash-text">{value === null || value === undefined ? "—" : String(value)}</span>;
    default:
      return <span className="text-dash-muted">{value === null || value === undefined || value === "" ? "—" : String(value)}</span>;
  }
}

export function DataTable({ resource, items }: { resource: Resource; items: ResourceItem[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-dash-border bg-dash-subtle/60">
            {resource.columns.map((column) => (
              <th
                key={column.name}
                scope="col"
                className={cn(
                  "px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-dash-muted",
                  column.hideOnMobile && "hidden md:table-cell",
                  column.align === "right" && "text-right",
                  column.type === "image" && "w-14",
                )}
              >
                {column.label || <span className="sr-only">Rasm</span>}
              </th>
            ))}
            <th scope="col" className="w-24 px-4 py-2.5">
              <span className="sr-only">Amallar</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-dash-border">
          {items.map((item) => {
            const href = `/dashboard/${resource.key}/${item.id}`;
            const publicPath = resource.publicPath?.(item);
            const title = String(item[resource.titleField] ?? "");
            return (
              <tr key={item.id} className="group relative transition-colors hover:bg-dash-subtle/60">
                {resource.columns.map((column) => (
                  <td
                    key={column.name}
                    className={cn(
                      "px-4 py-3 align-middle",
                      column.hideOnMobile && "hidden md:table-cell",
                      column.align === "right" && "text-right",
                    )}
                  >
                    <Cell column={column} item={item} href={href} />
                  </td>
                ))}
                <td className="px-2 py-3">
                  {/* relative z-10: qator havolasi ustida bosiladigan tugmalar */}
                  <div className="relative z-10 flex items-center justify-end gap-0.5">
                    {publicPath && item.isPublished !== false && (
                      <a href={publicPath} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants.icon, "hidden sm:inline-flex")} title="Saytda ko'rish" aria-label={`${title} — saytda ko'rish`}>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <Link href={href} className={buttonVariants.icon} title="Tahrirlash" aria-label={`${title} — tahrirlash`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <ConfirmButton
                      compact
                      label={`${title} — o'chirish`}
                      title={`${resource.singular}ni o'chirasizmi?`}
                      description={`"${title}" butunlay o'chiriladi. Bu amalni qaytarib bo'lmaydi.`}
                      action={deleteResource.bind(null, resource.key, item.id)}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
