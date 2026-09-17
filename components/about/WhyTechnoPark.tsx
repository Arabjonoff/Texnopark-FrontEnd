"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTheme } from "@/lib/theme";
import type { Feature } from "@/lib/types";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

function FeatureCard({
  title,
  description,
  icon,
  theme,
  delay = 0,
  className = "",
}: {
  title: string;
  description: string;
  icon: string;
  theme: string;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 md:p-7 flex flex-col gap-4 cursor-pointer",
        "border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-xl hover:shadow-black/20",
        `bg-gradient-to-br ${getTheme(theme).fade}`,
        className
      )}
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-foreground/60 transition-all duration-300 group-hover:text-blue-400 group-hover:bg-blue-500/10">
        <DynamicIcon icon={icon} className="w-5 h-5" />
      </div>

      {/* Text */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1.5">{title}</h3>
        <p className="text-foreground/60 text-sm leading-relaxed">{description}</p>
      </div>

      {/* Subtle corner glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-blue-500/5 blur-xl pointer-events-none" />
    </motion.div>
  );
}

export function WhyTechnoPark({ features }: { features: Feature[] }) {
  if (features.length === 0) return null;

  // 3 ustunli bento: 1-2 kartalar chapda, 3-karta o'rtada (baland), qolganlari o'ngda
  const col1 = features.slice(0, 2);
  const col2 = features.slice(2, 3);
  const col3 = features.slice(3);

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 md:px-8 w-full">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4 text-center md:text-left">
          Nega aynan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
            Biz?
          </span>
        </h2>
        <p className="text-foreground/60 max-w-xl text-base md:text-lg text-center md:text-left">
          Andijon Yoshlar Texnoparki — innovatsiyalar va texnologiyalar markazi. Biz sizga kelajak sari muhim qadam tashlashda yordam beramiz.
        </p>
      </div>

      {/* 3-column bento layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1 */}
        <div className="flex flex-col gap-4">
          {col1.map((item, i) => (
            <FeatureCard key={item.id} {...item} delay={i * 0.1} />
          ))}
        </div>

        {/* Column 2 — tall card */}
        <div className="flex flex-col gap-4">
          {col2.map((item, i) => (
            <FeatureCard
              key={item.id}
              {...item}
              delay={0.2 + i * 0.1}
              className="flex-1"
            />
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-4">
          {col3.map((item, i) => (
            <FeatureCard key={item.id} {...item} delay={0.3 + i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}
