import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, CalendarDays, Clock, MessageSquare, Phone } from "lucide-react";
import { deleteApplication } from "@/app/dashboard/actions";
import { ApplicationForm } from "@/components/dashboard/ApplicationControls";
import { ConfirmButton } from "@/components/dashboard/ConfirmButton";
import { Badge, buttonVariants, Card, CardHeader, formatDate, PageHeader } from "@/components/dashboard/ui";
import { dashGet } from "@/lib/dashboard/api";
import { APPLICATION_STATUS, APPLICATION_TYPE } from "@/lib/dashboard/resources";
import type { AdminApplication } from "@/lib/dashboard/types";

type Props = { params: Promise<{ id: string }> };

async function load({ params }: Props) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();
  return dashGet<AdminApplication>(`/applications/${id}/`);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const app = await load(props);
  return { title: `Ariza: ${app.name}` };
}

function Row({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 px-5 py-3.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-dash-muted" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs text-dash-muted">{label}</dt>
        <dd className="mt-0.5 text-sm text-dash-text">{children}</dd>
      </div>
    </div>
  );
}

export default async function ApplicationDetailPage(props: Props) {
  const app = await load(props);
  const tel = app.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <PageHeader
        title={app.name}
        description={`#${app.id} · ${formatDate(app.createdAt, true)}`}
        back={{ href: "/dashboard/applications", label: "Arizalar" }}
        actions={
          <>
            <a href={`tel:${tel}`} className={buttonVariants.secondary}>
              <Phone className="h-4 w-4" /> Qo&apos;ng&apos;iroq qilish
            </a>
            <ConfirmButton
              title="Arizani o'chirasizmi?"
              description={`${app.name} arizasi butunlay o'chiriladi. Odatda arizani o'chirish o'rniga "Rad etilgan" holatini qo'yish tavsiya etiladi.`}
              action={deleteApplication.bind(null, app.id)}
            />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Ariza ma'lumotlari"
            action={
              <div className="flex gap-2">
                <Badge tone={APPLICATION_TYPE[app.type].tone}>{APPLICATION_TYPE[app.type].label}</Badge>
                <Badge tone={APPLICATION_STATUS[app.status].tone}>{APPLICATION_STATUS[app.status].label}</Badge>
              </div>
            }
          />
          <dl className="divide-y divide-dash-border border-t border-dash-border">
            <Row icon={Phone} label="Telefon">
              <a href={`tel:${tel}`} className="font-medium tabular-nums text-dash-primary hover:underline">{app.phone}</a>
            </Row>
            {app.courseTitle && (
              <Row icon={BookOpen} label="Kurs">
                <Link href={`/dashboard/courses/${app.course}`} className="hover:text-dash-primary hover:underline">{app.courseTitle}</Link>
              </Row>
            )}
            {app.eventTitle && (
              <Row icon={CalendarDays} label="Tadbir">
                <Link href={`/dashboard/events/${app.event}`} className="hover:text-dash-primary hover:underline">{app.eventTitle}</Link>
              </Row>
            )}
            <Row icon={MessageSquare} label="Xabar">
              {app.message ? <p className="whitespace-pre-line leading-relaxed">{app.message}</p> : <span className="text-dash-muted">Xabar yozilmagan</span>}
            </Row>
            <Row icon={Clock} label="Yuborilgan vaqt">
              {formatDate(app.createdAt, true)}
              {app.updatedAt !== app.createdAt && <span className="text-dash-muted"> · o&apos;zgartirilgan {formatDate(app.updatedAt, true)}</span>}
            </Row>
          </dl>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Ko'rib chiqish" description="Holat va ichki izoh" />
          <div className="px-5 pb-5">
            <ApplicationForm key={app.updatedAt} id={app.id} status={app.status} adminNote={app.adminNote} />
          </div>
        </Card>
      </div>
    </>
  );
}
