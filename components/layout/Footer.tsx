import Link from "next/link";
import { MessageCircle, Globe, Send, MapPin, Phone, Mail, Play } from "lucide-react";
import { getCourses, getSiteSettings } from "@/lib/api";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, courses] = await Promise.all([getSiteSettings(), getCourses()]);

  const socials = [
    { href: settings?.instagramUrl, label: "Instagram", icon: Globe },
    { href: settings?.telegramUrl, label: "Telegram", icon: Send },
    { href: settings?.facebookUrl, label: "Facebook", icon: MessageCircle },
    { href: settings?.youtubeUrl, label: "YouTube", icon: Play },
  ].filter((social) => social.href);

  return (
    <footer className="bg-foreground/[0.02] border-t border-foreground/10 pt-20 pb-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
                YT
              </div>
              <span className="font-bold text-xl leading-tight">
                Yoshlar<br />Texnoparki
              </span>
            </Link>
            <p className="text-foreground/70 mb-6 text-sm leading-relaxed">
              Andijon Yoshlar Texnoparki - innovatsiyalar, ta&apos;lim va startaplar uchun zamonaviy ekosistema.
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-4">
                {socials.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full glass flex items-center justify-center text-foreground/70 hover:text-blue-600 hover:bg-white transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Navigatsiya</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-foreground/70 hover:text-blue-600 transition-colors text-sm">Bosh sahifa</Link></li>
              <li><Link href="/about" className="text-foreground/70 hover:text-blue-600 transition-colors text-sm">Biz haqimizda</Link></li>
              <li><Link href="/courses" className="text-foreground/70 hover:text-blue-600 transition-colors text-sm">Yo&apos;nalishlar</Link></li>
              <li><Link href="/projects" className="text-foreground/70 hover:text-blue-600 transition-colors text-sm">Startaplar</Link></li>
              <li><Link href="/events" className="text-foreground/70 hover:text-blue-600 transition-colors text-sm">Tadbirlar</Link></li>
              <li><Link href="/news" className="text-foreground/70 hover:text-blue-600 transition-colors text-sm">Yangiliklar</Link></li>
            </ul>
          </div>

          {/* Directions */}
          <div>
            <h4 className="font-bold text-foreground mb-6">Yo&apos;nalishlar</h4>
            <ul className="space-y-3">
              {courses.map((course) => (
                <li key={course.id}>
                  <Link href={`/courses/${course.id}`} className="text-foreground/70 hover:text-blue-600 transition-colors text-sm">
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          {settings && (
            <div>
              <h4 className="font-bold text-foreground mb-6">Aloqa</h4>
              <ul className="space-y-4">
                <li className="flex gap-3 text-sm">
                  <MapPin className="w-5 h-5 text-blue-600 shrink-0" />
                  <span className="text-foreground/70">{settings.address}</span>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Phone className="w-5 h-5 text-blue-600 shrink-0" />
                  <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="text-foreground/70 hover:text-blue-600 transition-colors">
                    {settings.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm">
                  <Mail className="w-5 h-5 text-blue-600 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="text-foreground/70 hover:text-blue-600 transition-colors">
                    {settings.email}
                  </a>
                </li>
              </ul>
            </div>
          )}

        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-foreground/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/50">
          <p>© {currentYear} Andijon Yoshlar Texnoparki. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Maxfiylik siyosati</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Foydalanish shartlari</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
