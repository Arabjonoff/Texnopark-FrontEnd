import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Users, CheckCircle, Trophy, ListChecks } from "lucide-react";
import { getEvent, getEvents } from "@/lib/api";
import { eventStatusLabels, getTheme } from "@/lib/theme";

export const revalidate = 60;

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) return {};
  return {
    title: `${event.title} — Andijon Yoshlar Texnoparki`,
    description: event.shortDesc,
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  const status = eventStatusLabels[event.status];
  const theme = getTheme(event.theme);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Banner */}
      <div className={`relative bg-gradient-to-br ${theme.soft} border-b border-foreground/5 pt-10 pb-20 px-4 md:px-8`}>
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Barcha tadbirlar
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-foreground/5 text-xs font-bold uppercase tracking-wider text-foreground/80">
              {event.category}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${status.className}`}>
              {status.label}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6">
            {event.title}
          </h1>

          <p className="text-foreground/70 text-lg max-w-2xl mb-10">
            {event.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Calendar, label: "Sana", value: event.date },
              { icon: Clock, label: "Vaqt", value: event.time },
              { icon: MapPin, label: "Manzil", value: event.location },
              { icon: Users, label: "O'rinlar", value: `${event.seats} ta` },
            ].map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm rounded-2xl p-4"
                >
                  <StatIcon className="w-5 h-5 text-foreground/40 mb-2" />
                  <p className="text-xs text-foreground/50 mb-0.5">{stat.label}</p>
                  <p className="font-bold text-foreground text-sm">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — Main Content */}
          <div className="lg:col-span-2 flex flex-col gap-12">

            {/* Schedule */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-foreground/50" />
                Tadbir dasturi
              </h2>
              <div className="flex flex-col gap-3">
                {event.schedule.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                  >
                    <div className={`px-3 py-1.5 rounded-full text-white text-xs font-bold shrink-0 tabular-nums ${theme.solid}`}>
                      {item.time}
                    </div>
                    <p className="font-semibold text-foreground">{item.activity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prizes */}
            <div>
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-foreground/50" />
                Sovrinlar
              </h2>
              <div className="flex flex-col gap-3">
                {event.prizes.map((prize, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/80">{prize}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-foreground/50" />
                Ishtirok shartlari
              </h2>
              <div className="flex flex-col gap-3">
                {event.requirements.map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/80">{req}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Sticky CTA Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
                <div className={`px-6 py-5 bg-gradient-to-r ${theme.soft}`}>
                  <p className="text-sm text-foreground/60 mb-1">Tashkilotchi</p>
                  <p className="text-lg font-black text-foreground">{event.organizer}</p>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-2 text-sm text-foreground/60 border-b border-white/[0.06] pb-4">
                    <div className="flex justify-between gap-4">
                      <span>Sana</span>
                      <span className="font-semibold text-foreground text-right">{event.date}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Vaqt</span>
                      <span className="font-semibold text-foreground text-right">{event.time}</span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>{"O'rinlar"}</span>
                      <span className="font-semibold text-foreground text-right">{event.seats} ta</span>
                    </div>
                  </div>

                  {event.status === "closed" ? (
                    <span className="w-full flex items-center justify-center py-3.5 rounded-2xl font-bold text-sm bg-foreground/5 text-foreground/50 cursor-not-allowed">
                      {"Ro'yxatdan o'tish yopilgan"}
                    </span>
                  ) : (
                    <Link
                      href={`/contact?event=${event.id}`}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-100 ${theme.solid}`}
                    >
                      {"Ro'yxatdan o'tish"}
                    </Link>
                  )}
                  <Link
                    href="/contact"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm border border-foreground/10 hover:bg-foreground/5 transition-colors"
                  >
                    Savol berish
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
