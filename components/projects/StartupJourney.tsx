"use client";

import { motion } from "framer-motion";
import { Lightbulb, Settings, Layers, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "G'oya",
    description: "Muammoni aniqlash va yechimni o'ylab topish",
    icon: Lightbulb,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    id: 2,
    title: "Prototip",
    description: "Dastlabki dizayn va ishchi modelni yaratish",
    icon: Settings,
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    id: 3,
    title: "MVP",
    description: "Eng zarur funksiyalarga ega tayyor mahsulot (Minimum Viable Product)",
    icon: Layers,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    id: 4,
    title: "Startup",
    description: "Bozorga chiqish, mijozlar jalb qilish va investitsiya",
    icon: Rocket,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  }
];

export function StartupJourney() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 w-full relative">
      <div className="text-center mb-20">
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">G&apos;oyadan</span> Startupgacha
        </h2>
        <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
          Bizning inkubatsiya va akseleratsiya dasturimiz orqali o&apos;z g&apos;oyangizni qanday qilib tayyor biznesga aylantirishingiz mumkin?
        </p>
      </div>

      <div className="relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-foreground/5 rounded-full" />
        
        {/* Animated Progress Line */}
        <motion.div 
          initial={{ width: "0%" }}
          whileInView={{ width: "100%" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="hidden md:block absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" 
        />

        {/* Connecting Line (Mobile) */}
        <div className="md:hidden absolute top-0 bottom-0 left-8 w-1 bg-foreground/5 rounded-full" />
        <motion.div 
          initial={{ height: "0%" }}
          whileInView={{ height: "100%" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="md:hidden absolute top-0 left-8 w-1 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" 
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                className="relative z-10 flex flex-row md:flex-col items-center md:text-center gap-6 md:gap-6 pl-4 md:pl-0"
              >
                {/* Node */}
                <div className={cn(
                  "w-20 h-20 shrink-0 rounded-2xl glass flex items-center justify-center border-2 border-background shadow-xl shadow-foreground/5 transition-transform duration-300 hover:scale-110",
                  step.bg
                )}>
                  <Icon className={cn("w-8 h-8", step.color)} />
                </div>
                
                {/* Text Content */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 font-medium">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
