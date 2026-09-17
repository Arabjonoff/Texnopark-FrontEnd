"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Play, ChevronRight, ChevronLeft } from "lucide-react";
import { getTheme } from "@/lib/theme";
import type { VideoStory } from "@/lib/types";

function StoryCardShell({
  videoUrl,
  label,
  className,
  children,
}: {
  videoUrl: string;
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  if (!videoUrl) return <div className={className}>{children}</div>;
  return (
    <a href={videoUrl} target="_blank" rel="noopener noreferrer" aria-label={label} className={className}>
      {children}
    </a>
  );
}

export function VideoStories({ stories }: { stories: VideoStory[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  if (stories.length === 0) return null;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            O&apos;quvchilar <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">natijalari</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl text-lg">
            Bizning bitiruvchilarimiz erishayotgan yutuqlar va amaliy natijalar bilan tanishing.
          </p>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex items-center gap-3 hidden md:flex">
          <button 
            onClick={scrollLeft}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="Oldingi"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={scrollRight}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-foreground hover:bg-foreground/5 transition-colors"
            aria-label="Keyingi"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-8 -mx-4 px-4 md:mx-0 md:px-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {stories.map((story, i) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="min-w-[85vw] md:min-w-[400px] snap-center shrink-0 group relative"
          >
            {/* Video Card — video havolasi bo'lsa yangi oynada ochiladi */}
            <StoryCardShell
              videoUrl={story.videoUrl}
              label={`${story.studentName}: ${story.result} — videoni ko'rish`}
              className={`relative block h-[500px] w-full rounded-3xl overflow-hidden ${getTheme(story.theme).dark} border border-white/10 flex flex-col justify-end p-8 transition-transform duration-500 group-hover:scale-[1.02]`}
            >
              {story.thumbnail && (
                // eslint-disable-next-line @next/next/no-img-element -- admin yuklagan muqova
                <img src={story.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover" />
              )}

              {/* Background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Play Button */}
              {story.videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-blue-600/50 transition-all duration-300">
                    <Play className="w-8 h-8 text-white ml-2" />
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 transform transition-transform duration-300 group-hover:-translate-y-2">
                <div className="inline-block px-3 py-1 mb-3 rounded-full bg-blue-600/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                  {story.course}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {story.studentName}
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {story.result}
                </p>
              </div>
            </StoryCardShell>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
