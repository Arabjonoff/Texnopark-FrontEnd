import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, BarChart, Users, Monitor, CheckCircle, BookOpen } from "lucide-react";
import { getCourse, getCourses } from "@/lib/api";
import { getTheme } from "@/lib/theme";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export const revalidate = 60;

// Mavjud kurslar build paytida tayyorlanadi; admin'da keyin qo'shilganlari birinchi ochilganda yaratiladi
export async function generateStaticParams() {
  const courses = await getCourses();
  return courses.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) return {};
  return {
    title: `${course.title} — Andijon Yoshlar Texnoparki`,
    description: course.shortDesc,
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const theme = getTheme(course.theme);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Banner */}
      <div className={`relative bg-gradient-to-br ${theme.soft} border-b border-foreground/5 pt-10 pb-20 px-4 md:px-8`}>
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Barcha yo&apos;nalishlar
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl shrink-0 ${theme.solid}`}>
              <DynamicIcon icon={course.icon} className="w-8 h-8" />
            </div>

            <div>
              <p className="text-sm font-semibold text-foreground/50 uppercase tracking-widest mb-1">
                Yo&apos;nalish
              </p>
              <h1 className="text-4xl md:text-6xl font-black text-foreground">
                {course.title}
              </h1>
            </div>
          </div>

          <p className="text-foreground/70 text-lg max-w-2xl mb-10">
            {course.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Clock, label: "Davomiyligi", value: course.duration },
              { icon: BarChart, label: "Daraja", value: course.level },
              { icon: Monitor, label: "Format", value: course.format },
              { icon: Users, label: "O'rinlar", value: `${course.seats} ta` },
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

            {/* Skills */}
            <div>
              <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-foreground/50" />
                O&apos;rganiladigan texnologiyalar
              </h2>
              <div className="flex flex-wrap gap-3">
                {course.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold bg-foreground/[0.06] border border-foreground/[0.08] text-foreground/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Curriculum */}
            <div>
              <h2 className="text-2xl font-bold mb-6">O&apos;quv dasturi</h2>
              <div className="flex flex-col gap-3">
                {course.curriculum.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${theme.solid}`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs text-foreground/40 font-medium mb-0.5">{item.week}</p>
                      <p className="font-semibold text-foreground">{item.topic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcomes */}
            <div>
              <h2 className="text-2xl font-bold mb-5">Kurs natijasi</h2>
              <div className="flex flex-col gap-3">
                {course.outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-foreground/80">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Sticky CTA Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm overflow-hidden">
                {/* Price Banner */}
                <div className={`px-6 py-5 bg-gradient-to-r ${theme.soft}`}>
                  <p className="text-sm text-foreground/60 mb-1">Kurs narxi</p>
                  <p className="text-3xl font-black text-foreground">{course.price}</p>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-2 text-sm text-foreground/60 border-b border-white/[0.06] pb-4">
                    <div className="flex justify-between">
                      <span>Davomiyligi</span>
                      <span className="font-semibold text-foreground">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daraja</span>
                      <span className="font-semibold text-foreground">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bo&apos;sh o&apos;rinlar</span>
                      <span className="font-semibold text-foreground">{course.seats} ta</span>
                    </div>
                  </div>

                  <Link
                    href={`/contact?course=${course.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-100 ${theme.solid}`}
                  >
                    Kursga yozilish
                  </Link>
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
