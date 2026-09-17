"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";
import { parseVideoUrl } from "@/lib/video";

/** Karta ichidagi media: video havolasi bo'lsa video, bo'lmasa rasm, ikkalasi ham bo'lmasa placeholder */
function HeroMedia({ image, videoUrl }: { image: string | null; videoUrl: string }) {
  const video = parseVideoUrl(videoUrl);

  if (video?.kind === "file") {
    return (
      <video
        src={video.src}
        poster={image ?? undefined}
        autoPlay
        muted
        loop
        playsInline
        controls
        className="h-full w-full object-cover"
      />
    );
  }

  if (video?.kind === "embed") {
    return (
      <iframe
        src={video.src}
        title="Andijon Yoshlar Texnoparki videosi"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    );
  }

  if (image) {
    const media = (
      // eslint-disable-next-line @next/next/no-img-element -- admin yuklagan rasm
      <img src={image} alt="Andijon Yoshlar Texnoparki" className="h-full w-full object-cover" />
    );
    // Havola YouTube/Vimeo emas (masalan Instagram) — rasm ustiga Play tugmasi
    return video?.kind === "link" ? (
      <a href={video.src} target="_blank" rel="noopener noreferrer" className="group/media relative block h-full w-full" aria-label="Videoni ko'rish">
        {media}
        <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover/media:bg-black/40">
          <PlayCircle className="h-16 w-16 text-white" />
        </span>
      </a>
    ) : (
      media
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-24 w-24 animate-pulse items-center justify-center rounded-2xl bg-blue-500/20">
          <Sparkles className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-foreground/80">Rasm yoki video</h2>
        <p className="mt-2 text-sm text-foreground/50">
          Boshqaruv panelidagi &quot;Sayt sozlamalari&quot; bo&apos;limidan qo&apos;shiladi
        </p>
      </div>
    </div>
  );
}

export function Hero({ image = null, videoUrl = "" }: { image?: string | null; videoUrl?: string }) {
  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-0 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-3xl -z-10 mix-blend-multiply" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-blue-200/50 text-blue-700 text-sm font-semibold mb-6 dark:text-blue-400 dark:border-blue-900/50"
            >
              <Sparkles className="w-4 h-4" />
              <span>Andijon Yoshlar Texnoparki</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6"
            >
              G&apos;OYANGIZNI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                KELAJAKKA
              </span> <br />
              AYLANTIRING.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-foreground/70 mb-8 max-w-lg leading-relaxed"
            >
              Ta&apos;lim • Texnologiya • Innovatsiya. Yoshlarning innovatsion va texnologik loyihalarini qo&apos;llab-quvvatlash markazi.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Link
                href="/courses"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-full font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)]"
              >
                <span className="relative z-10">Kurslarni ko&apos;rish</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 transition-colors"
              >
                <PlayCircle className="w-5 h-5" />
                <span>Biz haqimizda</span>
              </Link>
            </motion.div>
          </div>

          {/* Right Content / Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative lg:h-[600px] rounded-3xl overflow-hidden glass-card p-4 flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 -z-10" />
            {/* Rasm/video boshqaruv panelidan (Sayt sozlamalari -> Bosh sahifa kartasi) */}
            <div className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden bg-foreground/5 border border-foreground/10">
              <HeroMedia image={image} videoUrl={videoUrl} />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
