"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { SiteLogo } from "./SiteLogo";

const navLinks = [
  { name: "Bosh sahifa", href: "/" },
  { name: "Yo'nalishlar", href: "/courses" },
  { name: "Biz haqimizda", href: "/about" },
  { name: "Jamoa", href: "/team" },
  { name: "Startup", href: "/projects" },
  { name: "Tadbirlar", href: "/events" },
];

export function Navbar({ logo = null }: { logo?: string | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-8 py-4",
        isScrolled ? "py-3" : "py-6"
      )}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto flex items-center justify-between rounded-full px-6 py-3 transition-all duration-300",
          // Kunduzgi rejimda och, tungi rejimda qora; desktopda skroll qilinmaguncha shaffof
          isScrolled
            ? "bg-white/85 dark:bg-[rgba(10,10,20,0.85)] backdrop-blur-xl shadow-lg border border-black/5 dark:border-white/10"
            : "bg-white/70 dark:bg-[rgba(10,10,20,0.6)] backdrop-blur-md border border-black/5 dark:border-white/5 lg:bg-transparent lg:dark:bg-transparent lg:backdrop-blur-none lg:border-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <SiteLogo logo={logo} />
          <span className="font-bold text-lg leading-tight hidden sm:block">
            Yoshlar<br />Texnoparki
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-foreground/80 hover:text-blue-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            <span className="relative z-10">Kursga yozilish</span>
            <Rocket className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>

        {/* Mobile: rejim tugmasi + burger */}
        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle className="relative z-50 h-9 w-9" />
          <button
            className="relative z-50 p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menyuni ochish/yopish"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[80px] left-4 right-4 rounded-3xl p-6 flex flex-col gap-6 lg:hidden shadow-2xl border border-black/5 dark:border-white/10 bg-white/95 dark:bg-[rgba(10,10,20,0.95)] backdrop-blur-xl"
          >
            <nav className="flex flex-col gap-4 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-blue-600 transition-colors py-2"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 text-white bg-blue-600 rounded-xl font-semibold shadow-lg shadow-blue-500/30"
            >
              Kursga yozilish
              <Rocket className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
