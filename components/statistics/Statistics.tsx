"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Statistic } from "@/lib/types";

function AnimatedCounter({ value, suffix, text, delay = 0 }: { value: number; suffix: string; text: string; delay?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000; // 2 seconds
      const incrementTime = 30;
      const steps = Math.max(Math.floor(duration / incrementTime), 1);
      const increment = Math.max((end - start) / steps, 1);

      // Start delay
      const timeout = setTimeout(() => {
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCount(end);
            clearInterval(timer);
          } else {
            setCount(Math.ceil(start));
          }
        }, incrementTime);
        return () => clearInterval(timer);
      }, delay * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="glass rounded-3xl p-8 text-center relative overflow-hidden group hover:shadow-xl transition-shadow border border-foreground/5 hover:border-blue-500/30"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-2 relative z-10">
        {count}{suffix}
      </h3>
      <p className="text-lg md:text-xl font-bold text-foreground/80 relative z-10 tracking-wide uppercase">
        {text}
      </p>
    </motion.div>
  );
}

export function Statistics({ stats }: { stats: Statistic[] }) {
  if (stats.length === 0) return null;

  return (
    <section className="py-20 relative max-w-7xl mx-auto px-4 md:px-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <AnimatedCounter key={stat.id} value={stat.value} suffix={stat.suffix} text={stat.label} delay={0.1 * (i + 1)} />
        ))}
      </div>
    </section>
  );
}
