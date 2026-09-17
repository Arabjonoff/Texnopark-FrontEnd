import { DirectionsBento } from "@/components/courses/DirectionsBento";
import { getCourses } from "@/lib/api";

export const revalidate = 60;

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="pt-10 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
          O&apos;quv Yo&apos;nalishlari
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          Bizning kurslarimiz orqali kelajak kasblarini o&apos;rganing. Har bir yo&apos;nalish amaliyot va real loyihalar ustiga qurilgan.
        </p>
      </div>
      <DirectionsBento courses={courses} />
    </div>
  );
}
