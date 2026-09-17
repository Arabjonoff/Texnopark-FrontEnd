"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getTheme } from "@/lib/theme";
import type { EventSummary } from "@/lib/types";

export function EventsList({ events }: { events: EventSummary[] }) {
  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
            Tadbirlar va <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Musobaqalar</span>
          </h2>
          <p className="text-foreground/70 max-w-2xl text-lg">
            Texnoparkda bo&apos;lib o&apos;tadigan eng so&apos;nggi tadbirlar, xakatonlar va musobaqalarda ishtirok eting.
          </p>
        </div>
        <Link 
          href="/events"
          className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 transition-colors"
        >
          Barcha tadbirlar
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {events.length === 0 && (
        <p className="glass-card rounded-3xl p-8 text-center text-foreground/60">
          Hozircha rejalashtirilgan tadbirlar yo&apos;q.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative"
          >
            <Link href={`/events/${event.id}`} className="block h-full">
              <div className="glass-card rounded-3xl p-6 md:p-8 h-full flex flex-col justify-between border border-white/10 dark:border-white/5 overflow-hidden relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                
                {/* Decorative blob */}
                <div className={cn("absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl group-hover:opacity-20 transition-opacity", getTheme(event.theme).solid)} />

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-foreground/5 text-xs font-bold uppercase tracking-wider text-foreground/80">
                      {event.category}
                    </span>
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      <ArrowRight className="w-5 h-5 text-foreground" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-foreground/70 font-medium mb-6 line-clamp-3">
                    {event.shortDesc}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-foreground/60 text-sm font-semibold pt-4 border-t border-foreground/10">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center md:hidden">
        <Link 
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-foreground bg-foreground/5 hover:bg-foreground/10 transition-colors"
        >
          Barcha tadbirlar
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
