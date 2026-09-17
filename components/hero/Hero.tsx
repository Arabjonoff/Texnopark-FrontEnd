"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, PlayCircle } from "lucide-react";

export function Hero() {
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
            {/* Placeholder for 3D element or high quality image */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-foreground/5 flex items-center justify-center border border-foreground/10">
               <div className="text-center p-8">
                  <div className="w-24 h-24 rounded-2xl bg-blue-500/20 mx-auto mb-4 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground/80">3D / Video Element</h3>
                  <p className="text-sm text-foreground/50 mt-2">Placeholder for dynamic visual composition</p>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
