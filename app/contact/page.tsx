import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { getCourses, getEvents, getSiteSettings } from "@/lib/api";
import type { ApplicationType } from "@/lib/types";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function param(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined;
}

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const [settings, courses, events] = await Promise.all([getSiteSettings(), getCourses(), getEvents()]);

  // /contact?course=python yoki /contact?event=... — kurs/tadbir sahifasidagi tugmalardan
  const initialCourse = param(query.course);
  const initialEvent = param(query.event);
  const initialType: ApplicationType = initialCourse ? "course" : initialEvent ? "event" : "contact";

  const contacts = settings
    ? [
        { icon: MapPin, title: "Manzil", value: settings.address, href: settings.mapUrl || undefined },
        { icon: Phone, title: "Telefon", value: settings.phone, href: `tel:${settings.phone.replace(/[^\d+]/g, "")}` },
        { icon: Mail, title: "Elektron pochta", value: settings.email, href: `mailto:${settings.email}` },
        ...(settings.workingHours ? [{ icon: Clock, title: "Ish vaqti", value: settings.workingHours, href: undefined }] : []),
      ]
    : [];

  return (
    <div className="pt-10 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Biz bilan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Bog&apos;laning</span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Savollaringiz bormi? Yoki loyihangizni birgalikda amalga oshirmoqchimisiz? Biz bilan bog&apos;laning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          {contacts.length > 0 && (
            <div className="flex flex-col gap-8">
              <div className="glass-card p-8 rounded-3xl">
                <h2 className="text-2xl font-bold mb-6">Aloqa ma&apos;lumotlari</h2>
                <ul className="space-y-6">
                  {contacts.map(({ icon: Icon, title, value, href }) => (
                    <li key={title} className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                        {href ? (
                          <a href={href} className="text-foreground/70 hover:text-blue-600 transition-colors">{value}</a>
                        ) : (
                          <p className="text-foreground/70">{value}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className={contacts.length > 0 ? "glass-card p-8 rounded-3xl" : "glass-card p-8 rounded-3xl md:col-span-2 max-w-2xl mx-auto w-full"}>
            <h2 className="text-2xl font-bold mb-6">Xabar yuborish</h2>
            <ContactForm
              courses={courses}
              events={events}
              initialType={initialType}
              initialCourse={initialCourse}
              initialEvent={initialEvent}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
