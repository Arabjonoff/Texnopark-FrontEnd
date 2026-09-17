import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andijon Yoshlar Texnoparki | Innovatsiya, Ta'lim, Startup",
  description: "Andijon Yoshlar Texnoparki - Yoshlarning innovatsion va texnologik loyihalarini qo'llab-quvvatlash, dasturlash va muhandislik ko'nikmalarini rivojlantirish markazi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${plusJakarta.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen flex flex-col font-sans bg-grid-pattern relative">
        <Navbar />
        <main className="flex-1 pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
