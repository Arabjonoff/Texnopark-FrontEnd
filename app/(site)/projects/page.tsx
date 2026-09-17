import { StartupJourney } from "@/components/projects/StartupJourney";
import { VideoStories } from "@/components/videos/VideoStories";
import { getVideoStories } from "@/lib/api";

export const revalidate = 60;

export default async function ProjectsPage() {
  const stories = await getVideoStories();

  return (
    <div className="pt-10 pb-24 min-h-screen flex flex-col gap-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
          Startaplar va <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Loyihalar</span>
        </h1>
        <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
          O&apos;quvchilarimiz tomonidan amalga oshirilgan eng yaxshi loyihalar va startaplar katalogi. G&apos;oyadan biznesgacha bo&apos;lgan yo&apos;l.
        </p>
      </div>
      
      <StartupJourney />
      <VideoStories stories={stories} />
    </div>
  );
}
