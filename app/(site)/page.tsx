import { Hero } from "@/components/hero/Hero";
import { Statistics } from "@/components/statistics/Statistics";
import { DirectionsBento } from "@/components/courses/DirectionsBento";
import { WhyTechnoPark } from "@/components/about/WhyTechnoPark";
import { VideoStories } from "@/components/videos/VideoStories";
import { StartupJourney } from "@/components/projects/StartupJourney";
import { Laboratory } from "@/components/about/Laboratory";
import { EventsList } from "@/components/events/EventsList";
import { Partners } from "@/components/partners/Partners";
import { FinalCTA } from "@/components/cta/FinalCTA";
import {
  getCourses,
  getEquipment,
  getEvents,
  getFeatures,
  getPartners,
  getSiteSettings,
  getStatistics,
  getVideoStories,
} from "@/lib/api";

export const revalidate = 60;

export default async function Home() {
  const [courses, events, stats, features, stories, equipment, partners, settings] = await Promise.all([
    getCourses(),
    getEvents(),
    getStatistics(),
    getFeatures(),
    getVideoStories(),
    getEquipment(),
    getPartners(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col gap-12 pb-12">
      <Hero image={settings?.heroImage ?? null} videoUrl={settings?.heroVideoUrl ?? ""} />
      <Statistics stats={stats} />
      <DirectionsBento courses={courses} />
      <WhyTechnoPark features={features} />
      <VideoStories stories={stories} />
      <StartupJourney />
      <Laboratory equipment={equipment} />
      <EventsList events={events.slice(0, 3)} />
      <Partners partners={partners} />
      <FinalCTA />
    </div>
  );
}
