"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 w-full">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 p-8 md:p-16 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-10 border border-white/20 shadow-2xl shadow-blue-500/20"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mix-blend-overlay pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 mix-blend-overlay pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
            Kelajakni kutmang. <br className="hidden md:block" />
            <span className="text-white/80">Uni birga yarating.</span>
          </h2>
          <p className="text-white/70 text-lg md:text-xl font-medium">
            Yoshlar Texnoparkiga qo&apos;shiling va o&apos;z g&apos;oyalaringizni reallikka aylantiring. Biz bilan innovatsiyalar olamiga qadam qo&apos;ying.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
          <Link
            href="/courses"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-white text-blue-600 font-bold hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Kursga yozilish
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-black/20 text-white font-bold backdrop-blur-sm border border-white/10 hover:bg-black/30 transition-colors duration-300"
          >
            <PhoneCall className="w-5 h-5" />
            Biz bilan bog&apos;lanish
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
