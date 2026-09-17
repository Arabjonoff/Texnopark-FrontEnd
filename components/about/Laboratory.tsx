"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTheme } from "@/lib/theme";
import type { Equipment } from "@/lib/types";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

// Bento joylashuvi tartib raqami bo'yicha; jihozlar ko'p bo'lsa takrorlanadi
const bentoLayout = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];


export function Laboratory({ equipment }: { equipment: Equipment[] }) {
  if (equipment.length === 0) return null;

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
          Zamonaviy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Laboratoriya</span>
        </h2>
        <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
          Bizning laboratoriyamiz amaliy mashg&apos;ulotlar va murakkab muhandislik loyihalari uchun to&apos;liq jihozlangan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] gap-4 md:gap-6">
        {equipment.map((item, i) => {
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-3xl p-6 md:p-8 flex flex-col justify-end border border-white/10 dark:border-white/5 cursor-pointer",
                bentoLayout[i % bentoLayout.length]
              )}
            >
              {/* Background Placeholder with Zoom effect */}
              <div className={cn(
                "absolute inset-0 transition-transform duration-700 group-hover:scale-110 -z-20",
                getTheme(item.theme).tint
              )}>
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element -- admin yuklagan rasm
                  <img src={item.image} alt="" className="w-full h-full object-cover opacity-60" />
                )}
              </div>
              
              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent -z-10" />

              {/* Icon */}
              <div className="absolute top-6 right-6 w-12 h-12 rounded-xl glass flex items-center justify-center border-white/20">
                <DynamicIcon icon={item.icon} className="w-6 h-6 text-foreground" />
              </div>

              {/* Content */}
              <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-foreground/80 font-medium line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
