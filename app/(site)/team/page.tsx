import type { Metadata } from "next";
import { Team } from "@/components/about/Team";
import { getTeam } from "@/lib/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Jamoa | Andijon Yoshlar Texnoparki",
  description:
    "Andijon Yoshlar Texnoparkida yoshlarga bilim berayotgan va loyihalarni qo'llab-quvvatlayotgan mentorlar va mutaxassislar jamoasi.",
};

export default async function TeamPage() {
  const team = await getTeam();

  return (
    <div className="pt-10 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Bizning{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Jamoa</span>
        </h1>
        <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
          Texnoparkda yoshlarga bilim berayotgan, loyihalarni qo&apos;llab-quvvatlayotgan va startap ekotizimini
          rivojlantirayotgan mentorlar va mutaxassislar.
        </p>
      </div>

      {team.length > 0 ? (
        <Team members={team} variant="grid" withHeading={false} />
      ) : (
        <p className="max-w-7xl mx-auto px-4 md:px-8 text-center text-foreground/60">
          Jamoa a&apos;zolari ro&apos;yxati hozircha yuklanmadi.
        </p>
      )}
    </div>
  );
}
