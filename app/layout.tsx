import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Andijon Yoshlar Texnoparki | Innovatsiya, Ta'lim, Startup",
  description: "Andijon Yoshlar Texnoparki - Yoshlarning innovatsion va texnologik loyihalarini qo'llab-quvvatlash, dasturlash va muhandislik ko'nikmalarini rivojlantirish markazi.",
};

// Umumiy qobiq: sayt (app/(site)) va dashboard (app/dashboard) o'z layout'lariga ega
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${plusJakarta.variable} antialiased scroll-smooth`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
