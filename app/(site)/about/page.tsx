import { WhyTechnoPark } from "@/components/about/WhyTechnoPark";
import { Laboratory } from "@/components/about/Laboratory";
import { getEquipment, getFeatures } from "@/lib/api";

export const revalidate = 60;

export default async function AboutPage() {
  const [features, equipment] = await Promise.all([getFeatures(), getEquipment()]);

  return (
    <div className="pt-10 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Biz <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Haqimizda</span>
        </h1>
        <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
          Andijon Yoshlar Texnoparki - yoshlarning innovatsion va texnologik loyihalarini qo&apos;llab-quvvatlash, dasturlash va muhandislik ko&apos;nikmalarini rivojlantirish hamda startap ekotizimini mustahkamlash maqsadida tashkil etilgan markazdir.
        </p>
      </div>
      <WhyTechnoPark features={features} />
      <Laboratory equipment={equipment} />
    </div>
  );
}
