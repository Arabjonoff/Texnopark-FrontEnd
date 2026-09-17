"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTheme } from "@/lib/theme";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { CourseSummary } from "@/lib/types";

// Bento joylashuvi kurs tartibi bo'yicha (admin panelda "tartib" maydoni); kurslar ko'p bo'lsa takrorlanadi
const bentoLayout = [
  "md:col-span-1 md:row-span-2",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-3 md:row-span-1",
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function DirectionsBento({ courses }: { courses: CourseSummary[] }) {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 w-full">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
          Kelajak Kasblari
        </h2>
        <p className="text-foreground/70 max-w-2xl text-lg">
          O&apos;zingizga mos yo&apos;nalishni tanlang va soha mutaxassislaridan ta&apos;lim oling.
        </p>
      </div>

      {courses.length === 0 && (
        <p className="glass-card rounded-3xl p-8 text-center text-foreground/60">
          Yo&apos;nalishlar hozircha yuklanmadi. Birozdan keyin qayta urinib ko&apos;ring.
        </p>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-4 md:gap-6"
      >
        {courses.map((dir, i) => {
          const color = getTheme(dir.theme).solid;
          return (
            <motion.div key={dir.id} variants={itemVariants} className={cn("group relative", bentoLayout[i % bentoLayout.length])}>
              <Link href={`/courses/${dir.id}`} className="block w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.03] to-transparent rounded-3xl -z-10 group-hover:from-foreground/[0.05] transition-colors" />
                <div className="glass-card w-full h-full rounded-3xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative transition-all duration-300 hover:shadow-2xl hover:shadow-foreground/5 hover:-translate-y-1">
                  
                  {/* Decorative Background Blob */}
                  <div className={cn("absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity", color)} />

                  <div className="flex justify-between items-start">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", color)}>
                      <DynamicIcon icon={dir.icon} className="w-6 h-6" />
                    </div>
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 bg-white/10">
                      <ArrowUpRight className="w-5 h-5 text-foreground" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-blue-600 transition-colors">
                      {dir.title}
                    </h3>
                    <p className="text-foreground/60 text-sm md:text-base font-medium">
                      {dir.shortDesc}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
