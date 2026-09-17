"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/lib/types";

const CARD_STEP = 320;

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const links = [
    { href: member.telegramUrl, label: "Telegram", icon: Send },
    { href: member.linkedinUrl, label: "LinkedIn", icon: ExternalLink },
  ].filter((link) => link.href);

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.08 }}
      className="group relative w-[70vw] shrink-0 snap-start sm:w-[280px]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 bg-foreground/5">
        {member.photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin yuklagan rasm
          <img
            src={member.photo}
            alt={member.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-within:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600/20 to-cyan-500/20 text-5xl font-black text-foreground/30">
            {initials(member.name)}
          </div>
        )}

        {/* Matn o'qilishi uchun pastdan qoraytiruvchi qatlam */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {links.length > 0 && (
          <div className="absolute right-3 top-3 flex gap-2">
            {links.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} — ${label}`}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}

        {/* Ism va lavozim doim ko'rinadi (telefonda hover yo'q), qisqacha esa hover/fokusda ochiladi */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="mt-0.5 text-sm font-medium text-blue-200">{member.role}</p>
          {member.bio && (
            <p className="mt-0 max-h-0 overflow-hidden text-sm leading-relaxed text-white/75 opacity-0 transition-all duration-300 group-hover:mt-2 group-hover:max-h-32 group-hover:opacity-100 group-focus-within:mt-2 group-focus-within:max-h-32 group-focus-within:opacity-100">
              {member.bio}
            </p>
          )}
        </div>
      </div>
    </motion.li>
  );
}

export function Team({ members }: { members: TeamMember[] }) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 8,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8,
    });
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges, members.length]);

  if (members.length === 0) return null;

  const scroll = (direction: -1 | 1) =>
    scrollRef.current?.scrollBy({ left: direction * CARD_STEP, behavior: "smooth" });

  return (
    <section className="py-20 w-full overflow-hidden">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Bizning{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">jamoa</span>
          </h2>
          <p className="max-w-2xl text-lg text-foreground/70">
            Texnoparkda yoshlarga bilim berayotgan va loyihalarni qo&apos;llab-quvvatlayotgan mutaxassislar.
          </p>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={edges.start}
            aria-label="Oldingi"
            className="flex h-12 w-12 items-center justify-center rounded-full glass text-foreground transition-opacity hover:bg-foreground/5 disabled:opacity-30"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={edges.end}
            aria-label="Keyingi"
            className="flex h-12 w-12 items-center justify-center rounded-full glass text-foreground transition-opacity hover:bg-foreground/5 disabled:opacity-30"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <ul
        ref={scrollRef}
        onScroll={updateEdges}
        className={cn(
          "mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-4 md:px-8",
          "hide-scrollbar mx-auto max-w-7xl",
        )}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {members.map((member, index) => (
          <MemberCard key={member.id} member={member} index={index} />
        ))}
      </ul>
    </section>
  );
}
